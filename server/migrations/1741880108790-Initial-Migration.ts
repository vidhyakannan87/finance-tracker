import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1741880108790 implements MigrationInterface {
  name = 'InitialMigration1741880108790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("transactionId" uuid NOT NULL DEFAULT uuid_generate_v4(), "category" "public"."transaction_category_enum" NOT NULL, "subcategory" character varying, "amount" double precision NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying, "userId" uuid, CONSTRAINT "PK_bdcf2c929b61c0935576652d9b0" PRIMARY KEY ("transactionId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`,
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
