import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertInventoryDto } from './dto/insert-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { DeleteInventoryDto } from './dto/delete-inventory.dto'; 

@Injectable()
export class InventoryService {
    constructor(private databaseService: DatabaseService) { };

    async insertProductInventory(dto: InsertInventoryDto) {
        const { producto_id, bodega_id, cantidad_disponible } = dto;
        const query = `INSERT INTO public.inventario_bodega (producto_id, bodega_id, cantidad_disponible, fecha_actualizacion)
                    VALUES ($1, $2, $3, now())
                    RETURNING id_inventario, producto_id, bodega_id, cantidad_disponible, fecha_actualizacion;`;
        const values = [producto_id, bodega_id, cantidad_disponible];

        try {
            const result = await this.databaseService.query(query, values);
            const producto = result.rows[0];
            return {
                p_message: 'Producto ingresado al inventario exitosamente',
                p_status: true,
                p_data: {
                    sub: producto.id_inventario,
                    producto: producto.producto_id,
                    bodega: producto.bodega_id,
                    stock: producto.cantidad_disponible,
                    fecha: producto.fecha_actualizacion
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async getProductsInventory(res) {
        const query = `SELECT id_inventario, producto_id, bodega_id, cantidad_disponible, fecha_actualizacion FROM public.inventario_bodega;`;
        try {
            const result = await this.databaseService.query(query, []);
            return {
                p_message: null,
                p_status: true,
                p_data: {
                    inventario: result.rows,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async updateProductInventory(dto: UpdateInventoryDto) {
        const { producto_id, bodega_id, cantidad_disponible, id_inventario } = dto;
        const query = `UPDATE public.inventario_bodega
                    SET producto_id = $1, bodega_id = $2, cantidad_disponible = $3, fecha_actualizacion = now()
                    WHERE id_inventario = $4
                    RETURNING producto_id, bodega_id, cantidad_disponible, fecha_actualizacion;`;
        const values = [producto_id, bodega_id, cantidad_disponible, id_inventario];
        try {
            const result = await this.databaseService.query(query, values);
            const producto = result.rows[0]
            return {
                p_messaje: 'Producto actualizado correctamente',
                p_status: true,
                p_data: {
                    producto: producto.producto_id,
                    bodega: producto.bodega_id,
                    stock: producto.cantidad_disponible,
                    fecha: producto.fecha_actualizacion
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteProductInventory(dto: DeleteInventoryDto) {
        const { id_inventario } = dto;
        const query = `DELETE FROM public.inventario_bodega
                    WHERE id_inventario = $1`;
        const values = [id_inventario];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_messaje: 'Producto eliminado del inventario correctamente',
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
