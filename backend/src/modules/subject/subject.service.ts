import { Injectable } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';
import { DatabaseService } from 'src/database/database.service';
import { InsertSubjectDto } from './dto/insert-subject.dto';
import { DeleteSubjectDto } from './dto/delete-subject.dto';

@Injectable()
export class SubjectService {
    constructor(private databaseService: DatabaseService){};

    async insertSubjet(dto: InsertSubjectDto){
        const {nombre_materia, descripcion} = dto;
        const query = `INSERT INTO public.materias (nombre_materia, descripcion)
                VALUES ($1, $2) RETURNING id_materia, nombre_materia, descripcion;`;
        const values = [nombre_materia, descripcion];
        try{
            const result = await this.databaseService.query(query, values);
            const materia = result.rows[0];
            return{
                p_message: 'Materia registrada correctamente',
                p_status: true,
                p_data: {
                    sub: materia.id_materia,
                    materia: result.nombre_materia,
                    descripcion: result.descripcion
                }
            }
        }catch(error){
            return{
                p_message: error.message,
                p_status: false,
                p_data: {}
            }
        }
    }

    async getSubject(res){
        const query = `SELECT id_materia, nombre_materia, descripcion FROM public.materias;`;
        try{
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_messaje: null,
                p_status: true,
                p_data: {
                    subject: result.rows
                }
            });
        }catch(error){
            res.status(500).json({
                p_messaje: error.message,
                p_status: false,
                p_data: {}
            });
        }
    }

    async deleteSubject(dto: DeleteSubjectDto){
        const {id_materia} = dto;
        const query = `DELETE FROM public.materias
                    WHERE id_materia = $1;`;
        try{
            const result = await this.databaseService.query(query, [id_materia]);
            return{
                p_message: 'Materia eliminada correctamente',
                p_status: true,
                p_data: {}
            }
        }catch(error){
            return{
                p_message: error.message,
                p_status: false,
                p_data: {}
            }
        }
    }

    
}
