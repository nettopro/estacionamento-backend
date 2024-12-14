-- This is your Prisma migration file.
-- Learn more about Prisma migrations at https://pris.ly/d/migrate

-- Drop the old stored procedure if it exists
DROP FUNCTION IF EXISTS calcular_valor_a_pagar;

-- Add the new stored procedure
CREATE OR REPLACE FUNCTION calcular_valor_a_pagar()
RETURNS void AS $$
DECLARE
    rec RECORD;
    minutos INT;
    horas INT;
BEGIN
    FOR rec IN
        SELECT id, placa, data_entrada, valor_a_pagar, "estacionamentoId"
        FROM "EntradaSaida"
        WHERE pago = false AND data_saida IS NULL
    LOOP
        -- Calculate the difference in minutes between data_entrada and now
        minutos := EXTRACT(EPOCH FROM (now() - rec.data_entrada)) / 60;

        -- Convert minutes to hours, ensuring at least 1 hour is charged
        horas := CEIL(minutos / 60); -- Round up to the nearest full hour

        -- Update the existing record to reflect the calculated charge
        UPDATE "EntradaSaida"
        SET valor_a_pagar = (1 + horas) * (SELECT valor_hora FROM "Estacionamento" WHERE id = rec."estacionamentoId")
        WHERE id = rec.id;

        -- Log the plate and parking lot information
        RAISE NOTICE 'Vehicle with plate % has a new charge in parking lot %', rec.placa, rec."estacionamentoId";
    END LOOP;
END;
$$ LANGUAGE plpgsql;