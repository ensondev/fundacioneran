//HECHO
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class InsertCategorieDto {
    @ApiProperty({description: 'Nombre de la categoría a registrar', example: 'Electrodomésticos'})
    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El nombre solo puede contener letras y espacios.' })
    nombre_categoria: string;
}
