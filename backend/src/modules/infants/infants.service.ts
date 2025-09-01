import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertInfantsDto } from './dto/insert-infants.dto';
import { UpdateInfantsDto } from './dto/update-infants.dto';
import { DeleteInfantsDto } from './dto/delete-infants.dto';

@Injectable()
export class InfantsService {
    constructor(private databaseService: DatabaseService) { }

    async insertInfant(dto: InsertInfantsDto) {
        const { nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion } = dto;
        const query = `INSERT INTO public.infantes(nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion, fecha_registro)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now())
                    RETURNING id_infante, nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion, fecha_registro;`;
        const values = [nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_message: 'Infante registrada/o correctamente',
                p_status: true,
                p_data: {
                    infante: result.rows[0]
                }
            }
        } catch (error) {
            return {
                p_message: error.p_message,
                p_status: false,
                p_data: {}
            }
        }
    }


    async getInfants(res) {
        const query = `SELECT id_infante, nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion, fecha_registro FROM public.infantes;`;
        try {
            const result = await this.databaseService.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    infantes: result.rows
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

    async updateInfant(dto: UpdateInfantsDto) {
        const { nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion, id_infante } = dto;
        const query = `UPDATE public.infantes
                SET nombres = $1, cedula = $2, genero = $3, fecha_nacimiento = $4, nombre_acudiente = $5, cedula_acudiente = $6, telefono_acudiente = $7, direccion = $8
                WHERE id_infante = $9
                RETURNING nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion, id_infante;`;
        const values = [nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion, id_infante];
        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_message: 'Infante actualizado correctamente',
                p_status: true,
                p_data: {
                    infante: result.rows[0]
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

    async deleteInfant(dto: DeleteInfantsDto) {
        const { id_infante } = dto;
        const query = `DELETE FROM public.infantes
                    WHERE id_infante = $1;`;
        try {
            const result = await this.databaseService.query(query, [id_infante]);
            return {
                p_message: 'Infante eliminado correctamente',
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
