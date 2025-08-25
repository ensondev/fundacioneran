import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { InsertParticipantsDto } from './dto/insert-participants.dto';
import { DeleteParticipantsDto } from './dto/delete-participants.dto';

@Injectable()
export class ParticipantsService {
    constructor(private databaseSerevice: DatabaseService){};

    async insertParticipant(dto: InsertParticipantsDto){
        const {nombres, cedula, telefono, correo, direccion, fecha_nacimiento} = dto;
        const query = `INSERT INTO public.participantes(nombres, cedula, telefono, correo, direccion, fecha_nacimiento, fecha_registro)
                    VALUES($1, $2, $3, $4, $5, $6, now())
                    RETURNING id_participante, nombres, cedula, telefono, correo, direccion, fecha_nacimiento, fecha_registro;`;
        const values = [nombres, cedula, telefono, correo, direccion, fecha_nacimiento];

        try{
            const result = await this.databaseSerevice.query(query, values);
            const participante = result.rows[0];
            return{
                p_message: 'Participante registrado correctamente',
                p_status: true,
                p_data: {
                    sub: participante.id_participante,
                    nombres: participante.nombres,
                    cedula: participante.cedula,
                    telefono: participante.telefono,
                    correo: participante.correo,
                    direccion: participante.direccion,
                    fecha_nacimiento: participante.fecha_nacimiento,
                    fecha_registro: participante.fecha_registro,
                }
            }
        }catch(error){
            return{
                p_message: error.message,
                p_status: false,
                p_data: {},
            }
        }
    }

    async getParticipants(res){
        const query = `SELECT id_participante, nombres, cedula, telefono, correo, direccion, fecha_nacimiento, fecha_registro
                    FROM public.participantes;`
        try{
            const result = await this.databaseSerevice.query(query, []);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    participants: result.rows,
                }
            })
        }catch(error){
            res.status(500).json({
                p_message: error.message,
                p_status: false,
                p_data: {}
            })
        }
    }

    async deleteParticipant(dto: DeleteParticipantsDto){
        const {id_participante} = dto;

        const query = `DELETE FROM public.participantes
                    WHERE id_participante = $1`;
        const values = [id_participante];
        try{
            const result = await this.databaseSerevice.query(query, values);
            return{
                p_message: 'Participante eliminado correctamente',
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
