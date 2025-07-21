//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class InsertDeliverieDto {
    @ApiProperty({ description: 'Ingresar ID del beneficiario que recibe la donación', example: '10' })
    @IsInt()
    beneficiario_id: number;

    @ApiProperty({ description: 'Ingresar ID de la donación que se entrega', example: '2' })
    @IsInt()
    donacion_id: number;
}
