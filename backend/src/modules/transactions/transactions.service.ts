import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertTransactionDto } from './dto/insert-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DeleteTransactionDto } from './dto/delete-transaction.dto';

@Injectable()
export class TransactionsService {
    constructor(private databaseService: DatabaseService) { };

    async insertTransaction(dto: InsertTransactionDto) {
        const { tipo_transaccion, monto, razon } = dto;
        const query = `INSERT INTO public.transacciones (tipo_transaccion, monto, razon, fecha_transaccion) VALUES ($1, $2, $3, now())`;
        const value = [tipo_transaccion, monto, razon];
        try {
            const result = await this.databaseService.query(query, value);
            const transaccion = result.rows[0];
            return {
                p_message: 'Transación realizada correctamente',
                p_status: true,
                p_data: {
                    sub: transaccion.id_transaccion,
                    transaccion: transaccion.tipo_transaccion,
                    monto: transaccion.monto,
                    razon: transaccion.razon,
                    fecha: transaccion.fecha_transaccion
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async getTransactions(res) {
        const query = `SELECT id_transaccion, tipo_transaccion, monto, razon, fecha_transaccion FROM public.transacciones;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    transaccion: result.rows,
                }
            })
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_status: false,
                p_data: {}
            })
        }
    }

    async updateTransactions(dto: UpdateTransactionDto) {
        const { tipo_transaccion, monto, razon, id_transaccion } = dto;
        const query = `UPDATE FROM public.transacciones
                    SET tipo_transaccion = $1, monto = $2, razon = $3
                    HERE id_transaccion = $4`;
        const values = [tipo_transaccion, monto, razon, id_transaccion];
        try {
            const result = await this.databaseService.query(query, values);
            const transaccion = result.rows[0];
            return {
                p_messaje: 'transacción actualizado correctamente',
                p_status: true,
                p_data: {
                    transaccion: transaccion.tipo_transaccion,
                    monto: transaccion.monto,
                    razon: transaccion.razon,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteTransactions(dto: DeleteTransactionDto) {
        const { id_transaccion } = dto;
        const query = `DELETE FROM public.transacciones
                    WHERE id_transaccion = $1`;
        const values = [id_transaccion];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_messaje: 'transacción eliminada correctamente',
                p_status: true,
                p_data: {}
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async getCountIngreso(res) {
        const query = `
        SELECT 
            COUNT(*) AS cantidad, 
            COALESCE(SUM(monto), 0) AS total 
        FROM public.transacciones 
        WHERE tipo_transaccion = 'Ingreso';
    `;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    ingreso: result.rows[0]
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_status: false,
                p_data: {},
            });
        }
    }

    async getCountEgreso(res) {
        const query = `
        SELECT 
            COUNT(*) AS cantidad, 
            COALESCE(SUM(monto), 0) AS total 
        FROM public.transacciones 
        WHERE tipo_transaccion = 'Egreso';
    `;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    egreso: result.rows[0]
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_status: false,
                p_data: {},
            });
        }
    }

}
