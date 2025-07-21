//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteDonationDto {
    @ApiProperty({ description: 'ID de la donación a eliminar', example: '4' })
    @IsInt()
    id_donacion: number;
}
