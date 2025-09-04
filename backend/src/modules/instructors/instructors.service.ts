import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertInstructorsDto } from './dto/insert-instructors.dto';
import { DeleteInstructorsDto } from './dto/delete-instructors.dto';
import { UpdateInventoryDto } from '../inventory/dto/update-inventory.dto';
import { UpdateInstructorsDto } from './dto/update-instructors.dto';

@Injectable()
export class InstructorsService {
    constructor(private databaseService: DatabaseService) { };

    async insertInstructor(dto: InsertInstructorsDto) {
        const { nombres, cedula, telefono, correo, especialidad } = dto;
        const query = `INSERT INTO public.instructores(nombres, cedula, telefono, correo, especialidad, fecha_contratacion)
                    VALUES($1, $2, $3, $4, $5, now())
                    RETURNING id_instructor, nombres, cedula, telefono, correo, especialidad, fecha_contratacion, activo`;

        const values = [nombres, cedula, telefono, correo, especialidad];

        try {
            const result = await this.databaseService.query(query, values);
            const instructor = result.rows[0];
            return {
                p_message: 'Instructor registrado correctamente',
                p_status: true,
                p_data: {
                    sub: instructor.id_instructor,
                    nombres: instructor.nombres,
                    cedula: instructor.cedula,
                    telefono: instructor.cedula,
                    correo: instructor.correo,
                    especialidad: instructor.especialidad,
                    fecha_contratacion: instructor.fecha_contratacion,
                    activo: instructor.activo,
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

    async getInstructors(res) {
        const query = `SELECT id_instructor, nombres, cedula, telefono, correo, especialidad, fecha_contratacion, activo
                    FROM public.instructores;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    instructores: result.rows,
                }
            })
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_status: false,
                p_data: {}
            });
        }
    }

    async getInstructorsParams(query: any, res) {
        const { cedula, fecha_inicio, fecha_fin } = query;

        let sql = `
        SELECT id_instructor, nombres, cedula, telefono, correo, especialidad, fecha_contratacion, activo
        FROM public.instructores
        WHERE 1=1
    `;
        const values: any[] = [];
        let index = 1;

        if (cedula && cedula.trim() !== '') {
            sql += ` AND cedula = $${index}`;
            values.push(cedula.trim());
            index++;
        }

        if (fecha_inicio) {
            sql += ` AND fecha_contratacion >= $${index}`;
            values.push(fecha_inicio);
            index++;
        }

        if (fecha_fin) {
            sql += ` AND fecha_contratacion <= $${index}`;
            values.push(fecha_fin);
            index++;
        }

        try {
            const result = await this.databaseService.query(sql, values);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    instructores: result.rows
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_status: false,
                p_data: {}
            });
        }
    }

    async updateInstructor(dto: UpdateInstructorsDto) {
        const { nombres, cedula, telefono, correo, especialidad, id_instructor } = dto;
        const query = `UPDATE public.instructores
                    SET nombres = $1, cedula = $2, telefono = $3, correo = $4, especialidad = $5
                    WHERE id_instructor = $6
                    RETURNING nombres, cedula, telefono, correo, especialidad, id_instructor;`;
        const values = [nombres, cedula, telefono, correo, especialidad, id_instructor];
        try {
            const result = await this.databaseService.query(query, values);
            const instructor = result.rows[0];
            return {
                p_message: 'Instructor actualizado correctamente',
                p_status: true,
                p_data: {
                    id_instructor: instructor.id_instructor,
                    nombres: instructor.nombres,
                    cedula: instructor.cedula,
                    telefono: instructor.telefono,
                    correo: instructor.correo,
                    especialidad: instructor.especialidad
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

    async deleteInstructor(dto: DeleteInstructorsDto) {
        const { id_instructor } = dto;
        const query = `DELETE FROM public.instructores
                    WHERE id_instructor = $1;`;
        const values = [id_instructor];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_message: 'Instructor eliminado correctamente',
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
