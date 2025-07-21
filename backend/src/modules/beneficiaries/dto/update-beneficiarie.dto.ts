//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumberString, IsString, Matches } from "class-validator";

export class UpdateBeneficiarieDto {
    @ApiProperty({ description: 'Actualizar nombres del beneficiario', example: 'Camila Renata Vargas Luján', })
    @IsString()
    nombres_beneficiario: string;

    @ApiProperty({ description: 'Actualizar cédula del beneficiario (10 dígitos)', example: '1300000000', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos.' })
    cedula_beneficiario: string;

    @ApiProperty({ description: 'Actualizar dirección del beneficiario', example: 'Avenida Falsa 123', })
    @IsString()
    direccion_beneficiario: string;

    @ApiProperty({ description: 'Actualizar número de teléfono del beneficiario (10 dígitos)', example: '0999999999', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos.' })
    telefono_beneficiario: string;

    @ApiProperty({ description: 'Actualizar ID del beneficiario', example: '1' })
    @IsInt()
    id_beneficiario: number;
}
