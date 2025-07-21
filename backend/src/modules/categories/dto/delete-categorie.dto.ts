//HECHO
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class DeleteCategorieDto {
    @ApiProperty({description: 'ID de la categoría a eliminar',example: '2'})
    @IsInt()
    id_categoria: number;
}
