//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString, Matches } from "class-validator";

export class InsertBeneficiarieDto {
    @ApiProperty({description: 'Ingresar nombres del beneficiario', example: 'Diego Julián Serrano Bustamante',})
    @IsString()
    nombres_beneficiario: string;

    @ApiProperty({description: 'Ingresar cédula del beneficiario (10 dígitos)', example: '1300000000',})
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos.' })
    cedula_beneficiario: string;

    @ApiProperty({description: 'Ingresar dirección del beneficiario', example: 'Avenida Siempre Viva 123',})
    @IsString()
    direccion_beneficiario: string;

    @ApiProperty({description: 'Ingresar número de teléfono del beneficiario (10 dígitos)', example: '0999999999',})
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos.' })
    telefono_beneficiario: string;
}
