import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertRegistrationsDto } from './dto/insert-registrations.dto';
import { DeleteRegistrationsDto } from './dto/delete-registrations.dto';
import { UpdateRegistrationsDto } from './dto/update-registrations.dto';

@Injectable()
export class RegistrationsService {
    constructor(private databaseService: DatabaseService) { };

    async insertRegistration(dto: InsertRegistrationsDto) {
        const { participante_id, curso_id } = dto;

        try {

            // 0. Verificar si ya está inscrito en el curso
            const checkQuery = `
            SELECT COUNT(*) AS inscritos
            FROM inscripciones
            WHERE participante_id = $1 AND curso_id = $2
        `;
            const checkResult = await this.databaseService.query(checkQuery, [participante_id, curso_id]);

            const yaInscrito = parseInt(checkResult.rows[0].inscritos, 10);

            if (yaInscrito > 0) {
                return {
                    p_message: 'El participante ya está inscrito en este curso.',
                    p_status: false,
                    p_data: {}
                };
            }

            // 1. Verificar inscripciones actuales para ese curso
            const countQuery = `
            SELECT COUNT(*) AS inscritos
            FROM inscripciones
            WHERE curso_id = $1`;

            const countResult = await this.databaseService.query(countQuery, [curso_id]);
            const inscritosActuales = parseInt(countResult.rows[0].inscritos, 10);

            // 2. Obtener cupo máximo del curso
            const cupoQuery = `
            SELECT cupo_maximo
            FROM cursos
            WHERE id_curso = $1`;

            const cupoResult = await this.databaseService.query(cupoQuery, [curso_id]);

            if (cupoResult.rowCount === 0) {
                return {
                    p_message: 'Curso no encontrado',
                    p_status: false,
                    p_data: {}
                };
            }

            const cupoMaximo = parseInt(cupoResult.rows[0].cupo_maximo, 10);

            // 3. Verificar si hay cupo
            if (inscritosActuales >= cupoMaximo) {
                return {
                    p_message: 'Cupo completo. No se puede registrar esta inscripción.',
                    p_status: false,
                    p_data: {}
                };
            }

            // 4. Registrar inscripción si hay cupo
            const query = `
            INSERT INTO public.inscripciones (participante_id, curso_id, fecha_inscripcion)
            VALUES ($1, $2, now())
            RETURNING id_inscripcion, participante_id, curso_id, fecha_inscripcion, estado_inscripcion;`;

            const values = [participante_id, curso_id];

            const result = await this.databaseService.query(query, values);
            const inscripcion = result.rows[0];

            return {
                p_message: 'Inscripción registrada correctamente',
                p_status: true,
                p_data: {
                    sub: inscripcion.id_inscripcion,
                    participante: inscripcion.participante_id,
                    curso: inscripcion.curso_id,
                    fecha_inscripcion: inscripcion.fecha_inscripcion,
                    estado: inscripcion.estado_inscripcion
                }
            };

        } catch (error) {
            return {
                p_message: 'Error al registrar inscripción: ' + error.message,
                p_status: false,
                p_data: {}
            };
        }
    }


    async getRegistrations(res) {
        const query = `
                SELECT 
                    i.id_inscripcion,
                    p.nombres,
                    p.id_participante,
                    m.nombre_materia,
                    c.id_curso,
                    i.fecha_inscripcion,
                    i.estado_inscripcion
                FROM inscripciones i
                JOIN participantes p ON i.participante_id = p.id_participante
                JOIN cursos c ON i.curso_id = c.id_curso
                JOIN materias m ON c.materia_id = m.id_materia;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    registrations: result.rows,
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

    async updateRegistration(dto: UpdateRegistrationsDto) {
        const { participante_id, curso_id, id_inscripcion } = dto;
        const query = `UPDATE public.inscripciones
                    SET participante_id = $1, curso_id = $2
                    WHERE id_inscripcion = $3
                    RETURNING participante_id, curso_id, id_inscripcion;`;
        const values = [participante_id, curso_id, id_inscripcion];
        try {
            const result = await this.databaseService.query(query, values);
            const inscripcion = result.rows[0];
            return {
                p_message: 'Inscripcion actualizada correctamente',
                p_status: true,
                p_data: {
                    id_inscripcion: inscripcion.id_inscripcion,
                    participante: inscripcion.participante_id,
                    curso: inscripcion.curso_id
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

    async deleteRegistration(dto: DeleteRegistrationsDto) {
        const { id_inscripcion } = dto;
        const query = `DELETE FROM public.inscripciones
                    WHERE id_inscripcion = $1;`;
        try {
            const result = await this.databaseService.query(query, [id_inscripcion]);
            return {
                p_message: 'Inscripcion eliminada correctamente',
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
