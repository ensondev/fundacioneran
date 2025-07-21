import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertProductDto } from './dto/insert-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';

@Injectable()
export class ProductsService {
    constructor(private databaseService: DatabaseService) { }

    //CRUD SENCILLO (CREATE - READ - UPDATE - DELETE)

    async registerProduct(dto: InsertProductDto) {
        const { es_caducible, nombre_producto, detalle_producto, categoria_id, fecha_caducidad, precio_venta } = dto;
        const query = `INSERT INTO public.productos (es_caducible, nombre_producto, detalle_producto, categoria_id, fecha_caducidad, precio_venta, fecha_registro) 
                    VALUES ($1, $2, $3, $4, $5, $6, NOW())
                    RETURNING id_producto, es_caducible, nombre_producto, detalle_producto, categoria_id, fecha_caducidad, precio_venta, fecha_registro ;`;
        const values = [es_caducible, nombre_producto, detalle_producto, categoria_id, fecha_caducidad, precio_venta];
        try {
            const result = await this.databaseService.query(query, values);
            const producto = result.rows[0];
            return {
                p_message: 'Producto registrado exitosamente',
                p_status: true,
                p_data: {
                    sub: producto.id_producto,
                    tipo: producto.es_caducible,
                    producto: producto.nombre_producto,
                    descripcion: producto.detalle_producto,
                    categoria: producto.categoria,
                    caduce: producto.fecha_caducidad,
                    precio: producto.precio_venta,
                    fecha: producto.fecha_registro
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

    async getProducts(res) {
        const query = `SELECT id_producto, es_caducible, nombre_producto, detalle_producto, categoria_id, fecha_caducidad, precio_venta, fecha_registro FROM public.productos;`;
        try {
            const result = await this.databaseService.query(query, []);
            return {
                p_message: null,
                p_status: true,
                p_data: {
                    producto: result.rows,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async updateProduct(dto: UpdateProductDto) {
        const { es_caducible, nombre_producto, detalle_producto, categoria_id, fecha_caducidad, precio_venta, id_producto } = dto;
        const query = `UPDATE public.productos
                    SET es_caducible = $1, nombre_producto = $2, detalle_producto = $3, categoria_id = $4, fecha_caducidad = $5, precio_venta = $6, 
                    WHERE id_producto = $7
                    RETURNING es_caducible, nombre_producto, detalle_producto, categoria_id, fecha_caducidad, precio_venta;`;
        const values = [es_caducible, nombre_producto, detalle_producto, categoria_id, fecha_caducidad, precio_venta, id_producto];
        try {
            const result = await this.databaseService.query(query, values);
            const producto = result.rows[0]
            return {
                p_messaje: 'Producto actualizado correctamente',
                p_status: true,
                p_data: {
                    tipo: producto.es_caducible,
                    producto: producto.nombre_producto,
                    detalle: producto.detalle_producto,
                    categoria: producto.categoria,
                    caduce: producto.fecha_caducidad,
                    precio: producto.valor_venta,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteProduct(dto: DeleteProductDto) {
        const { id_producto } = dto;
        const query = `DELETE FROM public.productos
                    WHERE id_producto = $1`;
        const values = [id_producto];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_messaje: 'Producto eliminado correctamente',
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
