import {MigrationInterface, QueryRunner} from "typeorm";

export class serverDetails1590499851036 implements MigrationInterface {
    name = 'serverDetails1590499851036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comms_event" ADD "result" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comms_event" ADD "server" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comms_event" DROP COLUMN "server"`);
        await queryRunner.query(`ALTER TABLE "comms_event" DROP COLUMN "result"`);
    }

}
