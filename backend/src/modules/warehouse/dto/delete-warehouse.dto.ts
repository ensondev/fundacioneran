//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteWarehouseDto {
    @ApiProperty({ description: 'ID de la bodega a eliminar', })
    @IsInt()
    id_bodega: number;
}
