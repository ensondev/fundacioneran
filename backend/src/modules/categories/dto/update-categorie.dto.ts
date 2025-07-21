//HECHO
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Matches } from 'class-validator';

export class UpdateCategorieDto {
    @ApiProperty({description: 'ID de la categoría a actualizar', example: '1'})
    @IsInt()
    id_categoria: number;

    @ApiProperty({description: 'Actualizar el nombre de la categoría', example: 'Tecnología'})
    @IsString()
    @Matches(/^[a-zA-Z\s]+$/, { message: 'El nombre solo puede contener letras y espacios.' })
    nombre_categoria: string;
}
