//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteDetailDto {
    @ApiProperty({ description: 'ID de la venta a eliminar', example: '8' })
    @IsInt()
    id_detalle: number;
}
