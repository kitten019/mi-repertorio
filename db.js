import pg from 'pg';
const { Pool } = pg;

//Las credenciales se cambian de acuerdo al usuario que tengas en postgres sql en user y password
const pool = new Pool({
    user: 'postgres',
    password: 'xxxxx',
    host: 'localhost',
    port: 5432,
    database: 'repertorio'
});

export default pool; 