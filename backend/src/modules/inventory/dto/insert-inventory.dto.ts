//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class InsertInventoryDto {
    @ApiProperty({ description: 'Ingresar ID del producto', example: '5' })
    @IsInt()
    producto_id: number;

    @ApiProperty({ description: 'Ingresar ID de la categoria', example: '6' })
    @IsInt()
    categoria_id: number;

    @ApiProperty({ description: 'Ingresar ID de la bodega', example: '12' })
    @IsInt()
    bodega_id: number;

    @ApiProperty({ description: 'Ingresar cantidad de producto disponible (stock)', example: '100' })
    @IsInt()
    cantidad_disponible: number;
}