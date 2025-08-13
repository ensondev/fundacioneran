import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertHeaderDto } from './dto/insert-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';
import { DeleteHeaderDto } from './dto/delete-header.dto';

@Injectable()
export class SalesHeaderService {
    constructor(private databaseService: DatabaseService) { };

    async insertSalesHeader(dto: InsertHeaderDto) {
        const { nombre_cliente, cedula_cliente, total } = dto;
        const query = `INSERT INTO public.ventas_cabecera (nombre_cliente, cedula_cliente, total, fecha_venta) 
                    VALUES ($1, $2, $3, now())
                    RETURNING id_venta, nombre_cliente, cedula_cliente, total, estado_venta, fecha_venta;`;
        const values = [nombre_cliente, cedula_cliente, total];
        try {
            const result = await this.databaseService.query(query, values);
            const header = result.rows[0];
            return {
                p_message: 'cliente venta ingresado exitosamente',
                p_status: true,
                p_data: {
                    sub: header.id_venta,
                    cliente: header.nombre_cliente,
                    cedula: header.cedula_cliente,
                    total: header.total,
                    estado: header.estado_venta,
                    fecha: header.fecha_venta,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                status: false,
                p_data: {}
            }
        }
    }

    async getSalesHeader(res) {
        const query = `SELECT id_venta, nombre_cliente, cedula_cliente, total, estado_venta, fecha_venta FROM public.ventas_cabecera;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    sales_header: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                status: false,
                p_data: {}
            });
        }
    }

    async updateSalesHeader(dto: UpdateHeaderDto) {
        const { nombre_cliente, cedula_cliente, total, estado_venta, id_venta } = dto;
        const query = `UPDATE FROM public.ventas_cabecera
                    SET nombre_cliente = $1, cedula_cliente = $2, total = $3, estado_venta = $4
                    WHERE id_venta = $5`;
        const values = [nombre_cliente, cedula_cliente, total, estado_venta, id_venta];
        try {
            const result = await this.databaseService.query(query, values);
            const header = result.rows[0];
            return {
                p_messaje: 'cliente venta actualizado correctamente',
                p_status: true,
                p_data: {
                    cliente: header.nombre_cliente,
                    cedula: header.cedula_cliente,
                    total: header.total,
                    estado: header.estado_venta,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteSalesHeader(dto: DeleteHeaderDto) {
        const { id_venta } = dto;
        const query = `DELETE FROM public.ventas_cabecera
                        WHERE id_venta = $1`;
        const values = [id_venta];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_messaje: 'cliente venta eliminado correctamente',
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
