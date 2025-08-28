import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertCoursesDto } from './dto/insert-courses.dto';
import { DeleteCoursesDto } from './dto/delete-courses.dto';
import { UpdateCoursesDto } from './dto/update-courses.dto';
import { UpdateAvailabilityCoursesDto } from './dto/update-availability-courses.dto';

@Injectable()
export class CoursesService {
    constructor(private databaseService: DatabaseService) { };

    async insertCourse(dto: InsertCoursesDto) {
        const { materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo } = dto;
        const query = `INSERT INTO public.cursos (materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo)
                    VALUES ($1, $2, $3, $4, $5, $6)
                    RETURNING id_curso, materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo, activo`;
        const values = [materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo]
        try {
            const result = await this.databaseService.query(query, values);
            const curso = result.rows[0];
            return {
                p_message: 'Curso registrado correctamente',
                p_status: true,
                p_data: {
                    sub: curso.id_curso,
                    materia: curso.materia_id,
                    instructor: curso.instructor_id,
                    descripcion: curso.descripcion,
                    inicio: curso.fecha_inicio,
                    fin: curso.fecha_fin,
                    cupo: curso.cupo_maximo
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

    async getCourses(res) {
        const query = `SELECT 
                    c.id_curso,
                    c.materia_id,
                    m.nombre_materia,
                    c.instructor_id,
                    i.nombres,
                    c.descripcion,
                    c.fecha_inicio,
                    c.fecha_fin,
                    c.cupo_maximo,
                    c.activo,
                    COUNT(ins.id_inscripcion) AS inscripciones_actuales
                FROM cursos c
                JOIN materias m ON c.materia_id = m.id_materia
                JOIN instructores i ON c.instructor_id = i.id_instructor
                LEFT JOIN inscripciones ins ON ins.curso_id = c.id_curso
                GROUP BY 
                    c.id_curso,
                    c.materia_id,
                    m.nombre_materia,
                    c.instructor_id,
                    i.nombres,
                    c.descripcion,
                    c.fecha_inicio,
                    c.fecha_fin,
                    c.cupo_maximo,
                    c.activo;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    courses: result.rows
                }
            })
        } catch (error) {
            res.status(200).json({
                p_message: error.message,
                p_status: false,
                p_data: {}
            })
        }
    }

    async updateCourses(dto: UpdateCoursesDto){
        const {materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo, id_curso} = dto;
        const query = `UPDATE public.cursos
                    SET materia_id = $1, instructor_id = $2, descripcion = $3, fecha_inicio = $4, fecha_fin = $5, cupo_maximo = $6
                    WHERE id_curso = $7
                    RETURNING materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo, id_curso;`;
        const values = [materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo, id_curso];
        try{
            const result = await this.databaseService.query(query, values);
            const curso = result.rows[0];
            return {
                p_message: 'Curso actualizado correctamente',
                p_status: true,
                p_data: {
                    curso: curso.id_curso,
                    materia: curso.materia_id,
                    instructor: curso.instructor_id,
                    descripcion: curso.descripcion,
                    fecha_inicio: curso.fecha_inicio,
                    fecha_fin: curso.fecha_fin,
                    cupo_maximo: curso.cupo_maximo
                }
            }
        }catch(error){
            return {
                p_message: error.message,
                p_status: false,
                p_data: {}
            }
        }
    }

    async updateAvailabilityCourse(dto: UpdateAvailabilityCoursesDto){
        const { activo, id_curso} = dto;
        const query = `UPDATE public.cursos
                    SET activo = $1
                    WHERE id_curso = $2
                    RETURNING activo, id_curso;`;
        const values = [activo, id_curso];
        try{
            const result = await this.databaseService.query(query, values);
            const disponibilidad = result.rows[0];
            return{
                p_message: 'activo del curso actualizado correctamente',
                p_status: true,
                p_data: {
                    activo: disponibilidad.activo,
                    id_curso: disponibilidad.id_curso,
                }
            }
        }catch(error){
            return {
                p_message: error.message,
                p_status: false,
                p_data: {}
            }
        }
    }

    async deleteCourses(dto: DeleteCoursesDto) {
        const { id_curso } = dto;
        const query = `DELETE FROM public.cursos
                    WHERE id_curso = $1;`;
        try {
            const result = await this.databaseService.query(query, [id_curso]);
            return {
                p_message: 'Curso eliminado correctamente',
                p_status: true,
                p_data: {}
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_status: false,
                p_data: {}
            }
        }
    }
}
