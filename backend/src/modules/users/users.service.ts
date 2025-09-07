import { Injectable } from '@nestjs/common';
import { DeleteUsersDto } from 'src/modules/users/dto/delete-users.dto';
import { UpdateUsersDto } from 'src/modules/users/dto/update-users.dto';
import { encrypt } from 'src/authentication/auth/libs/bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
    constructor(private databaseService: DatabaseService) { };

    //CRUD SENCILLO (CREATE - READ - UPDATE - DELETE)

    //CREATE => Esta realizado en el apartado de Auth

    async getAllUsers(res) {
        const query = `SELECT id_usuario, nombres_completo, apellidos_completos, nombre_usuario, fecha_nacimiento, genero, numero_telefono, correo, rol_usuario, cuenta_activa, fecha_creacion, fecha_actualizacion
                    FROM public.usuarios;`;
        try {
            const result = await this.databaseService.query(query, []);
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

    async getUserName(req, res) {
        const { nombre_usuario } = req.body;
        const query = `SELECT id_usuario, nombres_completo, apellidos_completos, nombre_usuario, fecha_nacimiento, genero, numero_telefono, correo, rol_usuario, cuenta_activa, fecha_creacion, fecha_actualizacion
                    FROM public.usuarios
                    WHERE nombre_usuario = $1;`
        const value = [nombre_usuario];
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
                p_status: false,
                p_data: {}
            });
        }
    }

    async updateUsers(dto: UpdateUsersDto) {
        const { nombres_completo, apellidos_completos, nombre_usuario, fecha_nacimiento, genero, numero_telefono, correo, password, id_usuario } = dto;
        console.log('DTO recibido:', dto); // 👈 Para debug

        let query: string;
        let values: any[];

        try {
            if (password) {
                const hashedPassword = await encrypt(password);
                query = `
                UPDATE public.usuarios
                SET nombres_completo = $1, apellidos_completos = $2, nombre_usuario = $3, fecha_nacimiento = $4, genero = $5, numero_telefono = $6, correo = $7, password = $8, fecha_actualizacion = now()
                WHERE id_usuario = $9
                RETURNING nombres_completo, apellidos_completos, nombre_usuario, fecha_nacimiento, genero, numero_telefono, correo, fecha_actualizacion;
            `;
                values = [nombres_completo, apellidos_completos, nombre_usuario, fecha_nacimiento, genero, numero_telefono, correo, hashedPassword, id_usuario];
            } else {
                query = `
                UPDATE public.usuarios
                SET nombres_completo = $1, apellidos_completos = $2, nombre_usuario = $3, fecha_nacimiento = $4, genero = $5, numero_telefono = $6, correo = $7, fecha_actualizacion = now()
                WHERE id_usuario = $8
                RETURNING nombres_completo, apellidos_completos, nombre_usuario, fecha_nacimiento, genero, numero_telefono, correo, fecha_actualizacion;
            `;
                values = [nombres_completo, apellidos_completos, nombre_usuario, fecha_nacimiento, genero, numero_telefono, correo, id_usuario];
            }

            const result = await this.databaseService.query(query, values);
            const userUpdate = result.rows[0];

            return {
                p_message: 'Usuario actualizado correctamente',
                p_status: true,
                p_data: {
                    nombres: userUpdate.nombres_completo,
                    apellidos: userUpdate.apellidos_completos,
                    usuario: userUpdate.nombre_usuario,
                    fecha_nacimiento: userUpdate.fecha_nacimiento,
                    genero: userUpdate.genero,
                    telefono: userUpdate.numero_telefono,
                    correo: userUpdate.correo,
                    actualizado: userUpdate.fecha_actualizacion
                }
            };
        } catch (error) {
            return {
                p_message: error.message,
                p_data: {}
            };
        }
    }

    async updatePassword(dto: UpdatePasswordDto){
        const { password, nombre_usuario} = dto;

        const hashedPassword = await encrypt(password);

        const query = `UPDATE public.usuarios
                    SET password = $1
                    WHERE nombre_usuario = $2;`;
        const values = [hashedPassword, nombre_usuario];

        try{
            const result = await this.databaseService.query(query, values);
            return{
                p_message: 'Contraseña actualizada correctamente',
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



