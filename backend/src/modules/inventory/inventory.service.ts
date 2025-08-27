import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertInventoryDto } from './dto/insert-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { DeleteInventoryDto } from './dto/delete-inventory.dto';

@Injectable()
export class InventoryService {
    constructor(private databaseService: DatabaseService) { };

    async insertProductInventory(dto: InsertInventoryDto) {
        const { producto_id, categoria_id, bodega_id, cantidad_disponible } = dto;
        const checkQuery = `SELECT * FROM public.inventario_bodega WHERE producto_id = $1 AND (categoria_id != $2 OR categoria_id = $2) AND bodega_id = $3 LIMIT 1`;
        const checkValues = [producto_id, categoria_id, bodega_id];
        try {
            const existing = await this.databaseService.query(checkQuery, checkValues);

            if (existing.rows.length > 0) {
                return {
                    p_message: 'El producto ya existe en esta bodega.',
                    p_status: false,
                    p_data: {}
                };
            }

            const query = `INSERT INTO public.inventario_bodega (producto_id, categoria_id, bodega_id, cantidad_disponible, fecha_actualizacion)
                    VALUES ($1, $2, $3, $4, now())
                    RETURNING id_inventario, producto_id, categoria_id, bodega_id, cantidad_disponible, fecha_actualizacion;`;
            const values = [producto_id, categoria_id, bodega_id, cantidad_disponible];

            const result = await this.databaseService.query(query, values);
            const producto = result.rows[0];

            return {
                p_message: 'Producto ingresado al inventario exitosamente',
                p_status: true,
                p_data: {
                    sub: producto.id_inventario,
                    producto: producto.producto_id,
                    categoria: producto.categoria_id,
                    bodega: producto.bodega_id,
                    stock: producto.cantidad_disponible,
                    fecha: producto.fecha_actualizacion
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_status: false,
                p_data: {}
            }
        }
    }

    async getProductsInventory(res) {
        /* const query = `SELECT id_inventario, producto_id, categoria_id, bodega_id, cantidad_disponible, fecha_actualizacion FROM public.inventario_bodega;`; */
        const query = `SELECT 
                    ib.id_inventario,
                    ib.producto_id,
                    ib.categoria_id,
                    ib.bodega_id,
                    ib.cantidad_disponible,
                    ib.fecha_actualizacion,
                    p.nombre_producto,
                    p.precio_venta,
                    c.nombre_categoria,
                    b.nombre_bodega
                FROM inventario_bodega ib
                JOIN productos p ON p.id_producto = ib.producto_id
                JOIN categorias c ON c.id_categoria = ib.categoria_id
                JOIN bodega b ON b.id_bodega = ib.bodega_id;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    inventario: result.rows,
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

    async updateProductInventory(dto: UpdateInventoryDto) {
        const { producto_id, categoria_id, bodega_id, cantidad_disponible, id_inventario } = dto;
        const query = `UPDATE public.inventario_bodega
                    SET producto_id = $1, categoria_id = $2, bodega_id = $3, cantidad_disponible = $4, fecha_actualizacion = now()
                    WHERE id_inventario = $5
                    RETURNING producto_id, bodega_id, cantidad_disponible, fecha_actualizacion;`;
        const values = [producto_id, categoria_id, bodega_id, cantidad_disponible, id_inventario];
        try {
            const result = await this.databaseService.query(query, values);
            const producto = result.rows[0]
            return {
                p_messaje: 'Producto actualizado correctamente',
                p_status: true,
                p_data: {
                    producto: producto.producto_id,
                    categoria: producto.categoria_id,
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

    async updateStock(id_inventario: number, cantidadVendida: number) {
        const query = `UPDATE public.inventario_bodega
                    SET cantidad_disponible = cantidad_disponible - $1
                    WHERE id_inventario = $2;`;
        const values = [cantidadVendida, id_inventario];

        try {
            await this.databaseService.query(query, values);
            return {
                p_message: 'Stock actualizado correctamente',
                p_status: true,
            };
        } catch (error) {
            return {
                p_message: error.message,
                p_status: false,
            };
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
