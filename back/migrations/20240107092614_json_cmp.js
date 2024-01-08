/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function (knex) {
    await knex.raw(/* sql */ `
        CREATE OR REPLACE FUNCTION jsonb_contains_all_keys_and_values(subset jsonb, superset jsonb)
        RETURNS boolean AS $$
        DECLARE
        key text;
        value jsonb;
        BEGIN
        -- Iterate over each key and value in the subset JSONB
        FOR key, value IN SELECT * FROM jsonb_each(subset) LOOP
            -- Check if the key exists in the superset and has the same value
            IF superset -> key IS NULL OR superset -> key != value THEN
            -- If a key is missing or the value is different, return false
            RETURN false;
            END IF;
        END LOOP;
        -- If all keys and their values are present, return true
        RETURN true;
        END;
        $$ LANGUAGE plpgsql IMMUTABLE PARALLEL SAFE;
    `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function (knex) {
    await knex.raw(/* sql */ `
        DROP FUNCTION jsonb_contains_all_keys_and_values(jsonb, jsonb);
    `);
};
