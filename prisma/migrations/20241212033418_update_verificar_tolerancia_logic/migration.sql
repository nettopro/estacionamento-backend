-- This is your Prisma migration file.
-- Learn more about Prisma migrations at https://pris.ly/d/migrate

-- Drop the old stored procedure if it exists
DROP FUNCTION IF EXISTS verificar_tolerancia;

-- Add the updated stored procedure
CREATE OR REPLACE FUNCTION verificar_tolerancia()
RETURNS void AS $$
DECLARE
    rec RECORD;
BEGIN
    FOR rec IN
        SELECT id, data_pagamento, data_saida, valor_pago, "estacionamentoId"
        FROM "EntradaSaida"
        WHERE pago = true AND data_saida IS NOT NULL
    LOOP
        IF rec.data_saida > rec.data_pagamento + interval '15 minutes' THEN
            -- Update the existing record to reflect the additional hour charge
            UPDATE "EntradaSaida"
            SET valor_pago = valor_pago + (SELECT valor_hora FROM "Estacionamento" WHERE id = rec."estacionamentoId"),
                data_entrada = now(),
                pago = false
            WHERE id = rec.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;