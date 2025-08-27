//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class UpdateInventoryDto {
    @ApiProperty({ description: 'Ingresar ID del producto', example: '5' })
    @IsInt()
    producto_id: number;

    @ApiProperty({ description: 'Ingresar ID de la categoria', example: '5' })
    @IsInt()
    categoria_id: number;

    @ApiProperty({ description: 'Ingresar ID de la bodega', example: '12' })
    @IsInt()
    bodega_id: number;

    @ApiProperty({ description: 'Ingresar cantidad de producto disponible (stock)', example: '100' })
    @IsInt()
    cantidad_disponible: number;

    @ApiProperty({ description: 'ID del inventario a actualizar', example: '5' })
    @IsInt()
    id_inventario: number;
}
