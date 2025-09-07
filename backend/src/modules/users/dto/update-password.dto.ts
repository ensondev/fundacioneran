import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({ description: 'Ingresar contraseña segura (mínimo 8 caracteres, 1 mayúscula, 1 número)', example: 'Password123' })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/(?=.*[A-Z])(?=.*\d).*$/, { message: 'La contraseña debe contener al menos 1 mayúscula y 1 número' })
    password: string;

    @ApiProperty({ description: 'Actualizar nombre de usuario (6-20 caracteres, solo letras, números y guiones bajos)', example: 'Nombre_1234' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
    @MinLength(6, { message: 'El nombre de usuario debe tener al menos 6 caracteres' })
    @MaxLength(20, { message: 'El nombre de usuario no puede exceder los 20 caracteres' })
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'El nombre de usuario solo puede contener letras, números y guiones bajos (_)' })
    nombre_usuario: string;
}
