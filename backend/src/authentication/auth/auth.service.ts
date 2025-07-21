import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { encrypt } from './libs/bcrypt';
import { compare } from 'bcrypt';
import { RegisterUsersDto } from './dto/register-users.dto';
import { LoginUsersDto } from './dto/login-users.dto';

@Injectable()
export class AuthService {
    constructor(
        private databaseService: DatabaseService,
        private jwtService: JwtService,
    ) { };

    async register(dto: RegisterUsersDto) {
        const { nombre_usuario, rol_usuario, password } = dto;
        const hashedPassword = await encrypt(password);
        const query = `INSERT INTO public.usuarios (nombre_usuario, rol_usuario, password, cuenta_activa, fecha_creacion, fecha_actualizacion)
                    VALUES ($1, $2, $3, $4, now(), now())
                    RETURNING id_usuario, nombre_usuario, rol_usuario, cuenta_activa, fecha_creacion, fecha_actualizacion;`;
        const values = [nombre_usuario, rol_usuario, hashedPassword, true];
        try {
            const result = await this.databaseService.query(query, values);
            const newUser = result.rows[0];
            
            const payload = {
                sub: newUser.id_usuario,
                usuario: newUser.nombre_usuario,
                rol: newUser.rol_usuario,
                activo: newUser.cuenta_activa,
                creado: newUser.fecha_creacion,
                actualizado: newUser.fecha_actualizacion
            }

            const access_token = await this.jwtService.signAsync(payload);

            return {
                p_message: 'Usuario registrado correctamente',
                p_status: true,
                p_data: {
                    usuario: newUser.nombre_usuario,
                    rol: newUser.rol_usuario,
                    creado: newUser.fecha_creacion,
                    access_token: access_token
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

    async login(dto: LoginUsersDto) {
        const { nombre_usuario, password } = dto;
        const userQuery = `SELECT id_usuario, nombre_usuario, rol_usuario, password, fecha_creacion, fecha_actualizacion FROM public.usuarios 
                        WHERE nombre_usuario = $1`;
        const valueValues = [nombre_usuario];
        try {
            const userResult = await this.databaseService.query(userQuery, valueValues);
            const errorMessage = 'Usuario o contraseña incorrecta';

            if (userResult.rows.length === 0 || !await compare(password, userResult.rows[0].password)) {
                return {
                    p_message: errorMessage,
                    p_status: false,
                    p_data: {}
                }
            }

            const user = userResult.rows[0];

            const payload = {
                sub: user.id_usuario,
                usuario: user.nombre_usuario,
                rol: user.rol_usuario,
                creado: user.fecha_creacion,
                actualizado: user.fecha_actualizacion
            }

            const access_token = await this.jwtService.signAsync(payload);

            return {
                p_message: 'Inicio de sesión exitoso',
                p_status: true,
                p_data: {
                    usuario: user.nombre_usuario,
                    rol: user.rol_usuario,
                    token: access_token
                }
            }
        } catch (error) {
            console.error('Error al hacer login:', error);
            return {
                p_message: `Error interno del servidor ${error.message}`,
                p_data: {}
            }
        }
    }
}



