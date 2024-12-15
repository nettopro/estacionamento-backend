-- This is your Prisma migration file.
-- Learn more about Prisma migrations at https://pris.ly/d/migrate

DROP FUNCTION IF EXISTS verificar_tolerancia;

CREATE OR REPLACE FUNCTION verificar_tolerancia()
RETURNS void AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT id, placa, data_pagamento, data_saida, valor_a_pagar, "estacionamentoId"
        FROM "EntradaSaida"
        WHERE pago = true AND data_saida IS NOT NULL AND data_pagamento IS NOT NULL
    LOOP
        IF rec.data_saida > rec.data_pagamento + interval '15 minutes' THEN
            UPDATE "EntradaSaida"
            SET valor_a_pagar = (SELECT valor_hora FROM "Estacionamento" WHERE id = rec."estacionamentoId"),
                data_entrada = now(),
                data_saida = null,
                data_pagamento = null,
                pago = false
            WHERE id = rec.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;