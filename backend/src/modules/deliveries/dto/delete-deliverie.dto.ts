//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteDeliverieDto {
    @ApiProperty({ description: 'Eliminar ID de la entrega', example: '6' })
    @IsInt()
    id_entrega: number;
}
