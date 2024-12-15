-- This is your Prisma migration file.
-- Learn more about Prisma migrations at https://pris.ly/d/migrate

DROP FUNCTION IF EXISTS verificar_tolerancia;

CREATE OR REPLACE FUNCTION verificar_tolerancia()
RETURNS void AS $$
DECLARE
    rec RECORD;
    DATA_TOLERANCIA TIMESTAMP;
BEGIN
    FOR rec IN
        SELECT id, placa, data_pagamento, data_saida, valor_a_pagar, "estacionamentoId"
        FROM "EntradaSaida"
        WHERE pago = true AND data_saida IS NOT NULL AND data_pagamento IS NOT NULL
    LOOP
        DATA_TOLERANCIA := rec.data_pagamento + interval '15 minutes';
        IF now() > DATA_TOLERANCIA THEN
            UPDATE "EntradaSaida"
            SET 
                data_saida = DATA_TOLERANCIA
            WHERE id = rec.id;

            INSERT INTO "EntradaSaida" (placa, data_entrada, estacionamentoId)
            VALUES (rec.placa, DATA_TOLERANCIA, rec.estacionamentoId);
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;