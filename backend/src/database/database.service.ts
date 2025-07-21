import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
    
    private pool: Pool;

    constructor(){
        
        this.pool = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME, 
        })
    };

    async query(queryText: string, params: any[] = []): Promise<any> {
        const client = await this.pool.connect();
        try{
            const result = await client.query(queryText, params);
            return result;
        }catch(error){
            throw new Error(`Error en la conexion ${error.message}`);
        }finally{
            client.release();
        }
    }
}
