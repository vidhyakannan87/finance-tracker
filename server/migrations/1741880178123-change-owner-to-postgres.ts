import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeOwnerToPostgres1710162578432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Change the owner of the entire database
    await queryRunner.query(`ALTER DATABASE finance OWNER TO postgres;`);

    // Change the owner of all tables (if necessary)
    await queryRunner.query(`
      DO $$ 
      DECLARE 
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE format('ALTER TABLE public.%I OWNER TO postgres;', r.tablename);
        END LOOP;
      END $$;
    `);

    // Change the owner of the schema
    await queryRunner.query(`ALTER SCHEMA public OWNER TO postgres;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Optional: Revert changes if needed (change 'postgres' back to previous owner)
    await queryRunner.query(`ALTER DATABASE finance OWNER TO vidhya.kannan;`);
    await queryRunner.query(`ALTER SCHEMA public OWNER TO vidhya.kannan;`);
  }
}
