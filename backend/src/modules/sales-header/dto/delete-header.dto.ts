//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class DeleteHeaderDto {
    @ApiProperty({
        description: 'Eliminar header',
    }) @IsNumber()
    id_venta: number;
}
