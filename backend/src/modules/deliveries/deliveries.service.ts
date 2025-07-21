import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertDeliverieDto } from './dto/insert-deliverie.dto';
import { UpdateDeliverieDto } from './dto/update-deliverie.dto';
import { DeleteDeliverieDto } from './dto/delete-deliverie.dto';

@Injectable()
export class DeliveriesService {
    constructor(private databaseService: DatabaseService) { };

    async insertDeliverie(dto: InsertDeliverieDto) {
        const { beneficiario_id, donacion_id } = dto;
        const query = `INSERT INTO public.entregas (beneficiario_id, donacion_id, fecha_entrega) VALUES ($1, $2, now());`;
        const values = [beneficiario_id, donacion_id];
        try {
            const result = await this.databaseService.query(query, values);
            const entrega = result.rows[0];
            return {
                p_message: 'Entrega realizada correctamente',
                p_status: true,
                p_data: {
                    sub: entrega.id_entrega,
                    beneficiario: entrega.beneficiario_id,
                    producto: entrega.donacion_id,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async getDeliveries(res) {
        const query = `SELECT id_entrega, beneficiario_id, donacion_id, fecha_entrega FROM public.entregas;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    entregas: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            });
        }
    }

    async updateDeliverie(dto: UpdateDeliverieDto) {
        const { beneficiario_id, donacion_id, id_entrega } = dto;
        const query = `UPDATE public.entregas
                            SET beneficiario_id = $1, donacion_id = $2
                            WHERE id_entrega = $3`;
        const values = [beneficiario_id, donacion_id, id_entrega];
        try {
            const result = await this.databaseService.query(query, values);
            const entrega = result.rows[0];
            return {
                p_message: 'Entrega actualizada correctamente',
                p_status: true,
                p_data: {
                    beneficiario: entrega.beneficiario_id,
                    producto: entrega.donacion_id,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteDeliverie(dto: DeleteDeliverieDto) {
        const { id_entrega } = dto;
        const query = `DELETE FROM public.entregas WHERE id_entrega = $1;`;
        const values = [id_entrega];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_message: 'Entrega eliminada correctamente',
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
}
