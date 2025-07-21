//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString, Matches } from "class-validator";

export class InsertDonorDto {
    @ApiProperty({
        description: 'Ingresar nombre del donador a registrar',
        examples: ['Persona: Mateo Elías Fernández Cordero', 'Empresa: Distribuciones Comerciales Arvensa']
    })
    @IsString()
    nombres: string;

    @ApiProperty({ description: 'Número de identificación del donador o empresa', example: '1300000000' })
    @IsNumberString()
    numero_identificacion: string;

    @ApiProperty({ description: 'Número de teléfono del donador o empresa', example: '0999999999' }) 
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos.' })
    telefono: string;
}
