import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertCategorieDto } from './dto/insert-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { DeleteCategorieDto } from './dto/delete-categorie.dto';

@Injectable()
export class CategoriesService {
    constructor(private databaseService: DatabaseService) { };

    //CRUD SENCILLO (CREATE - READ - UPDATE - DELETE)

    async insertCategorie(dto: InsertCategorieDto) {
        const { nombre_categoria } = dto;
        const query = `INSERT INTO public.categorias (nombre_categoria) VALUES ($1)
                    RETURNING id_categoria, nombre_categoria`;
        const values = [nombre_categoria];
        try {
            const result = await this.databaseService.query(query, values);
            const categoria = result.rows[0];
            return {
                p_message: 'Categoria registrada correctamente',
                p_status: true,
                p_data: {
                    sub: categoria.id_categoria,
                    nombre: categoria.nombre_categoria
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async getCategories(res) {
        const query = `SELECT id_categoria, nombre_categoria FROM public.categorias;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    categoria: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            });
        }
    }

    async updateCategorie(dto: UpdateCategorieDto) {
        const { nombre_categoria, id_categoria } = dto;
        const query = `UPDATE public.categorias
                        SET nombre_categoria = $1
                        WHERE id_categoria = $2 RETURNING nombre_categoria`;
        const values = [nombre_categoria, id_categoria];
        try {
            const result = await this.databaseService.query(query, values);
            const categoria = result.rows[0];
            return {
                p_message: 'Categoria actualizada correctamente',
                p_status: true,
                p_data: {
                    nombre: categoria.nombre_categoria,
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteCategorie(dto: DeleteCategorieDto) {
        const { id_categoria } = dto;
        const query = `DELETE FROM public.categorias WHERE id_categoria = $1;`;
        const values = [id_categoria];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_message: 'Categoria eliminado correctamente',
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
