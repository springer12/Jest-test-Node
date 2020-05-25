import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import Doctor from './entity/Events';

const typeOrmConfig: PostgresConnectionOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "zenner-comms-microservice",
    synchronize: true,
    logging: false,
    entities: [
        Doctor,
    ]
};

export { typeOrmConfig };
