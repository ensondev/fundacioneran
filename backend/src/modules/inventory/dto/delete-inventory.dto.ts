//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteInventoryDto {
    @ApiProperty({ description: 'ID del inventario a eliminar', example: '5' })
    @IsInt()
    id_inventario: number;
}