import 'reflect-metadata';

import { createConnection } from 'typeorm';

import { typeOrmConfig } from './config';
import Doctor from './entity/Events';

(async () => {
    const conn = await createConnection(typeOrmConfig);
    console.log('PG connected');

    await conn.close();
    console.log('PG connection closed.');
})();
