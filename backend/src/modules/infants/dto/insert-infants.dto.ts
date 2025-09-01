import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNumberString, IsString, Matches } from "class-validator";

export class InsertInfantsDto {
    @ApiProperty({ description: 'Ingresar nombre del infante', example: 'Diego Sebastian Serrano Bustamante' })
    @IsString()
    nombres: string;

    @ApiProperty({ description: 'Ingresar cédula del infante (10 dígitos)', example: '1300000000', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos.' })
    cedula: string;

    @ApiProperty({ description: 'Ingresar genero del infante', examples: ['Masculino', 'Femenino'] })
    @IsString()
    genero: string;

    @ApiProperty({ description: 'Fecha de nacimiento', example: '2025-12-31', required: false })
    @IsDateString()
    fecha_nacimiento?: string;

    @ApiProperty({ description: 'Ingresar nombre del acudiente del infante', example: 'Diego Sebastian Serrano Bustamante' })
    @IsString()
    nombre_acudiente: string;

    @ApiProperty({ description: 'Ingresar cédula del acudiente del infante (10 dígitos)', example: '1300000000', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos.' })
    cedula_acudiente: string;

    @ApiProperty({ description: 'Ingresar número de teléfono del acudiente del infante (10 dígitos)', example: '0999999999', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos.' })
    telefono_acudiente: string;

    @ApiProperty({ description: 'Ingresar dirección del infante', example: 'Avenida Siempre Viva 123', })
    @IsString()
    direccion: string;
}
