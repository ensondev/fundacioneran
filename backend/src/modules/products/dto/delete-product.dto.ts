//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteProductDto {
    @ApiProperty({ description: 'ID del producto a eliminar', example: '1' })
    @IsInt()
    id_producto: number;
}