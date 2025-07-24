import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertWarehouseDto } from './dto/insert-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { DeleteWarehouseDto } from './dto/delete-warehouse.dto';

@Injectable()
export class WarehouseService {
    constructor(private databaseService: DatabaseService) { };

    //CRUD SENCILLO (CREATE - READ - UPDATE - DELETE)

    async createWareHouse(dto: InsertWarehouseDto) {
        const { nombre_bodega, ubicacion } = dto;
        const query = `INSERT INTO public.bodega (nombre_bodega, ubicacion) VALUES ($1, $2)
                    RETURNING id_bodega, nombre_bodega, ubicacion;`;
        const values = [nombre_bodega, ubicacion];
        try {
            const result = await this.databaseService.query(query, values);
            const bodega = result.rows[0];
            return {
                p_message: 'Bodega creada correctamente',
                p_status: true,
                p_data: {
                    sub: bodega.id_bodega,
                    bodega: bodega.nombre_bodega,
                    ubicacion: bodega.ubicacion
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async getWareHouse(res) {
        const query = `SELECT id_bodega, nombre_bodega, ubicacion FROM public.bodega;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    bodega: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            });
        }
    }

    async updateWarehouse(dto: UpdateWarehouseDto) {
        const { nombre_bodega, ubicacion, id_bodega } = dto;
        const query = `UPDATE public.bodega
                    SET nombre_bodega = $1, ubicacion = $2
                    WHERE id_bodega = $3 RETURNING nombre_bodega, ubicacion;`;
        const values = [nombre_bodega, ubicacion, id_bodega];
        try {
            const result = await this.databaseService.query(query, values);
            const bodega = result.rows[0];
            return {
                p_messaje: 'bodega actualizada correctamente',
                p_status: true,
                p_data: {
                    bodega: bodega.nombre_bodega,
                    ubicacion: bodega.ubicacion
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteWarehouse(dto: DeleteWarehouseDto) {
        const { id_bodega } = dto;
        const query = `DELETE FROM public.bodega
                    WHERE id_bodega = $1`;
        const values = [id_bodega];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_messaje: 'bodega eliminado correctamente',
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

    //CONSULTAS COMPLEJAS
}
