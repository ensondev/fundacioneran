//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class UpdateDeliverieDto {
    @ApiProperty({ description: 'Actualizar ID del beneficiario que recibe la donación', example: '5' })
    @IsInt()
    beneficiario_id: number;

    @ApiProperty({ description: 'Actualizar ID de la donación que se entrega', example: '8' })
    @IsInt()
    donacion_id: number;

    @ApiProperty({ description: 'Actualizar ID de la entrega', example: '6' })
    @IsInt()
    id_entrega: number;
}
