import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertDetailDto } from './dto/insert-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { DeleteDetailDto } from './dto/delete-detail.dto';

@Injectable()
export class SalesDetailsService {
    constructor(private databaseService: DatabaseService) { };

    async insertSalesDetail(dto: InsertDetailDto) {
        const { id_venta, producto_id, cantidad, precio_unitario } = dto;
        const query = `INSERT INTO public.ventas_detalle (id_venta, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4);`;
        const value = [id_venta, producto_id, cantidad, precio_unitario];
        try {
            const result = await this.databaseService.query(query, value);
            const detail = result.rows[0];
            return {
                p_message: 'venta producto ingresado correctamente',
                p_status: true,
                p_data: {
                    sub: detail.id_detalle,
                    header: detail.id_venta,
                    producto: detail.producto_id,
                    cantidad: detail.cantidad,
                    precio: detail.precio_unitario
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async getSalesDetail(res) {
        const query = `SELECT id_detalle, id_venta, producto_id, cantidad, precio_unitario, subtotal FROM public.ventas_detalle;`;
        try {
            const result = await this.databaseService.query(query,[]);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    sales_detail: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            });
        }
    }

    async updateSalesDetail(dto: UpdateDetailDto) {
        const { id_venta, producto_id, cantidad, precio_unitario, id_detalle } = dto;
        const query = `UPDATE FROM public.ventas_detalle
                    SET id_venta = $1, producto_id = $2, cantidad = $3, precio_unitario = $4
                    WHERE id_detalle = $5`;
        const values = [id_venta, producto_id, cantidad, precio_unitario, id_detalle];
        try {
            const result = await this.databaseService.query(query, values);
            const detail = result.rows[0];
            return {
                p_messaje: 'venta producto actualizado correctamente',
                p_status: true,
                p_data: {
                    header: detail.id_venta,
                    producto: detail.producto_id,
                    cantidad: detail.cantidad,
                    precio: detail.precio_unitario
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteSalesDetail(dto: DeleteDetailDto) {
        const { id_detalle } = dto;
        const query = `DELETE FROM public.ventas_detalle
                    WHERE id_detalle = $1`;
        const values = [id_detalle];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_messaje: 'venta producto eliminado correctamente',
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
