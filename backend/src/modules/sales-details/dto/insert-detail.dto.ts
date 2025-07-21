//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber } from "class-validator";

export class InsertDetailDto {
    @ApiProperty({ description: 'Ingresar detalle de la venta cliente', example: '2' })
    @IsInt()
    id_venta: number;

    @ApiProperty({ description: 'Ingresar producto a vender', example: '6' })
    @IsInt()
    producto_id: number;

    @ApiProperty({ description: 'Ingresar el precio del producto', example: '12 o 11.99' })
    @IsNumber()
    precio_unitario: number;

    @ApiProperty({description: 'Ingresar la cantidad de productos a vender', example:'5'})
    @IsInt()
    cantidad: number;
}
