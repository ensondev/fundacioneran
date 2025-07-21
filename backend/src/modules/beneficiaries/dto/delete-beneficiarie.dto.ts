//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteBeneficiarieDto {
    @ApiProperty({ description: 'Eliminar ID del beneficiario', example: '1' })
    @IsInt()
    id_beneficiario: number;
}
