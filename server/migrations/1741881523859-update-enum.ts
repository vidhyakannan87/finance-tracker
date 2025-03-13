import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEnum1741881523859 implements MigrationInterface {
  name = 'UpdateEnum1741881523859';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."transaction_category_enum" RENAME TO "transaction_category_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_category_enum" AS ENUM('Essentials & Living Expenses', 'Transportation', 'Debt & Financial Obligations', 'Dining & Entertainment', 'Shopping & Personal Care', 'Health & Wellness', 'Education & Professional Development', 'Gifts & Donations', 'Home & Maintenance', 'Travel & Vacation', 'Pets', 'Unknown')`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "category" TYPE "public"."transaction_category_enum" USING "category"::"text"::"public"."transaction_category_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."transaction_category_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."transaction_category_enum_old" AS ENUM('Essentials & Living Expenses', 'Transportation', 'Debt & Financial Obligations', 'Dining & Entertainment', 'Shopping & Personal Care', 'Health & Wellness', 'Education & Professional Development', 'Gifts & Donations', 'Home & Maintenance', 'Travel & Vacation', 'Pets')`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ALTER COLUMN "category" TYPE "public"."transaction_category_enum_old" USING "category"::"text"::"public"."transaction_category_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."transaction_category_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."transaction_category_enum_old" RENAME TO "transaction_category_enum"`,
    );
  }
}
