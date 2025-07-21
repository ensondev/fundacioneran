//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumberString, IsString, Matches } from "class-validator";

export class UpdateDonorDto {
    @ApiProperty({
        description: 'Actualizar nombre del donador registrado',
        examples: ['Persona: Mateo Elías Fernández Cordero', 'Empresa: Distribuciones Comerciales Arvensa']
    })
    @IsString()
    nombres: string;

    @ApiProperty({ description: 'Actualizar número de identificación del donador o empresa', example: '1300000000' })
    @IsNumberString()
    numero_identificacion: string;

    @ApiProperty({ description: 'Actualizar número de teléfono del donador o empresa', example: '0999999999' }) 
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos.' })
    telefono: string;

    @ApiProperty({ description: 'ID del donador a actualizar', example: '2' })
    @IsInt()
    id_donante: number;
}
