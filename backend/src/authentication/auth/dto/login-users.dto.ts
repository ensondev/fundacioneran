//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginUsersDto {
    @ApiProperty({ description: 'Ingresar nombre de usuario (6-20 caracteres)', example: 'usuario_123' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario no puede estar vacío' })
   /*  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'El nombre de usuario solo puede contener letras, números y guiones bajos (_)' }) */
    nombre_usuario: string;

    @ApiProperty({ description: 'Ingresar contraseña (mínimo 8 caracteres)', example: 'Password123' })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
    /* @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/(?=.*[A-Z])(?=.*\d).*$/, { message: 'La contraseña debe contener al menos 1 mayúscula y 1 número' }) */
    password: string;
}
