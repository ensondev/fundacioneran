import { Injectable } from '@nestjs/common';
import { DeleteUsersDto } from 'src/modules/users/dto/delete-users.dto';
import { UpdateUsersDto } from 'src/modules/users/dto/update-users.dto';
import { encrypt } from 'src/authentication/auth/libs/bcrypt';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
    constructor(private databaseService: DatabaseService) { };

    //CRUD SENCILLO (CREATE - READ - UPDATE - DELETE)

    //CREATE => Esta realizado en el apartado de Auth

    async getAllUsers(res) {
        const query = `SELECT id_usuario, nombre_usuario, rol_usuario, password, cuenta_activa, fecha_creacion FROM public.usuarios;`;
        const value = [];
        try {
            const result = await this.databaseService.query(query, value);
            res.status(200).json({
                p_message: null,
                p_status: true,
                p_data: {
                    users: result.rows,
                }
            });
        } catch (error) {
            res.status(500).json({
                p_message: error.message,
                p_data: {}
            });
        }
    }

    async updateUsers(dto: UpdateUsersDto) {
        const { nombre_usuario, password, id_usuario } = dto;
        console.log('DTO recibido:', dto); // 👈 Agrega esto
        const hashedPassword = await encrypt(password);
        const query = `UPDATE public.usuarios SET nombre_usuario = $1, password = $2, fecha_actualizacion = now()
                    WHERE id_usuario = $3
                    RETURNING nombre_usuario, fecha_actualizacion;`;

        const values = [nombre_usuario, hashedPassword, id_usuario];

        try {
            const result = await this.databaseService.query(query, values);
            const userUpdate = result.rows[0];

            return {
                p_message: 'Usuario actualizado correctamente',
                p_status: true,
                p_data: {
                    usuario: userUpdate.nombre_usuario,
                    actualizado: userUpdate.fecha_actualizacion
                }
            }
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            }
        }
    }

    async deleteUser(dto: DeleteUsersDto) {
        const { id_usuario } = dto;
        const query = `DELETE FROM public.usuarios
                    WHERE id_usuario = $1;`;
        const values = [id_usuario];

        try {
            const result = await this.databaseService.query(query, values);
            return {
                p_message: 'Usuario eliminado correctamente',
                p_status: true,
                p_data: {
                    user: result.rows,
                }
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



