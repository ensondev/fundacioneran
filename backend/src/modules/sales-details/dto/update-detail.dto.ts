//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber } from "class-validator";

export class UpdateDetailDto {
    @ApiProperty({ description: 'Actualizar información de la compra', example: '2' })
    @IsInt()
    id_venta: number;

    @ApiProperty({ description: 'Actualizar el producto vendido', example: '5' })
    @IsInt()
    producto_id: number;

    @ApiProperty({ description: 'Actualizar el precio del producto', example: '20 o 19.99' })
    @IsNumber()
    precio_unitario: number;

    @ApiProperty({ description: 'Actualizar la cantidad de productos comprados', example: '4' })
    @IsInt()
    cantidad: number;

    @ApiProperty({ description: 'ID de la venta a actualizar', example: '8' })
    @IsInt()
    id_detalle: number;
}
