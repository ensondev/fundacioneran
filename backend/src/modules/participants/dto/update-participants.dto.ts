import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsNumberString, IsString, Matches } from "class-validator";

export class UpdateParticipantsDto {
    @ApiProperty({ description: 'Actualizar nombre del participante', example: 'Diego Sebastian Serrano Bustamante' })
    @IsString()
    nombres: string;

    @ApiProperty({ description: 'Actualizar cédula del participante (10 dígitos)', example: '1300000000', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos.' })
    cedula: string;

    @ApiProperty({ description: 'Actualizar número de teléfono del participante (10 dígitos)', example: '0999999999', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos.' })
    telefono: string;

    @ApiProperty({ description: 'Actualizar correo del participante', example: 'correo123@gmail.com', })
    @IsString()
    correo: string;

    @ApiProperty({ description: 'Actualizar dirección del participante', example: 'Avenida Siempre Viva 123', })
    @IsString()
    direccion: string;

    @ApiProperty({ description: 'Actualizar fecha de nacimiento', example: '2025-12-31', required: false })
    @IsDateString()
    fecha_nacimiento?: string;

    @ApiProperty({ description: 'ID del participante a actualizar', example: 7 })
    @IsInt()
    id_participante: number;
}
