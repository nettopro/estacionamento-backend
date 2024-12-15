-- This is your Prisma migration file.
-- Learn more about Prisma migrations at https://pris.ly/d/migrate

DROP FUNCTION IF EXISTS calcular_valor_a_pagar;

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
        minutos := EXTRACT(EPOCH FROM (now() - rec.data_entrada)) / 60;

        horas := CEIL(minutos / 60);

        UPDATE "EntradaSaida"
        SET valor_a_pagar = (1 + horas) * (SELECT valor_hora FROM "Estacionamento" WHERE id = rec."estacionamentoId")
        WHERE id = rec.id;

    END LOOP;
END;
$$ LANGUAGE plpgsql;