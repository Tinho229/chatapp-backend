import {Pool} from 'pg' ;

const pool = new Pool({
    // Utilisez des vrais valeurs
    user :  process.env.DB_USER ?? 'user' ,
    password : process.env.DB_PASSWORD ??  'password' , 
    host : process.env.DB_HOST ?? 'host' ,
    port : Number(process.env.DB_PORT) ?? 1234 ,
    database : process.env.DB_NAME ?? 'name'
}) ;

export default pool ;