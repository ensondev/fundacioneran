import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumberString, IsString, Matches, ValidateIf } from "class-validator";

export class InsertParticipantsDto {
    @ApiProperty({ description: 'Ingresar nombre del participante', example: 'Diego Sebastian Serrano Bustamante' })
    @IsString()
    nombres: string;

    @ApiProperty({ description: 'Ingresar cédula del participante (10 dígitos)', example: '1300000000', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos.' })
    cedula: string;

    @ApiProperty({ description: 'Ingresar número de teléfono del participante (10 dígitos)', example: '0999999999', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos.' })
    telefono: string;

    @ApiProperty({ description: 'Ingresar correo del participante', example: 'correo123@gmail.com', })
    @IsString()
    correo: string;

    @ApiProperty({ description: 'Ingresar dirección del participante', example: 'Avenida Siempre Viva 123', })
    @IsString()
    direccion: string;

    @ApiProperty({ description: 'Fecha de nacimiento', example: '2025-12-31', required: false })
    @IsDateString()
    fecha_nacimiento?: string;
}
