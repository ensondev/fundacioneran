//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumberString, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterUsersDto {
    @ApiProperty({ description: 'Ingresar nombres completos del usuario', example: 'Andres Daniel Sanchez Zambrano' })
    @IsString()
    nombres_completo: string;

    @ApiProperty({ description: 'Ingresar apellidos completos del usuario', example: 'Sanchez Zambrano' })
    @IsString()
    apellidos_completos: string;

    @ApiProperty({ description: 'Ingresar nombre de usuario (6-20 caracteres, solo letras, números y guiones bajos)', example: 'Nombre_1234' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
    @MinLength(6, { message: 'El nombre de usuario debe tener al menos 6 caracteres' })
    @MaxLength(20, { message: 'El nombre de usuario no puede exceder los 20 caracteres' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'El nombre de usuario solo puede contener letras, números y guiones bajos (_)' })
    nombre_usuario: string;

    @ApiProperty({ description: 'Fecha de nacimiento del usuario', example: '2025-12-31' })
    @IsDateString()
    fecha_nacimiento: string;

    @ApiProperty({ description: 'Ingresar genero del usuario', examples: ['Masculino', 'Femenino'] })
    @IsString()
    genero: string;

    @ApiProperty({ description: 'Ingresar telefono del usuario (10 dígitos)', example: '1300000000', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'El telefono debe contener exactamente 10 dígitos.' })
    numero_telefono: string;

    @ApiProperty({ description: 'Ingresar correo del usuario', example: 'holamundo@gmail.com' })
    @IsString()
    correo: string;

    @ApiProperty({ description: 'Ingresar rol del usuario', example: 'Trabajador', enum: ['Administrador', 'Trabajador'] })
    @IsString()
    rol_usuario: string;

    @ApiProperty({ description: 'Ingresar contraseña segura (mínimo 8 caracteres, 1 mayúscula, 1 número)', example: 'Password123' })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/(?=.*[A-Z])(?=.*\d).*$/, { message: 'La contraseña debe contener al menos 1 mayúscula y 1 número' })
    password: string;

    @ApiProperty({ description: 'Estado de la cuenta', default: true, required: false })
    @IsBoolean()
    @IsOptional()
    cuenta_activa?: boolean;
}
