//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Matches } from "class-validator";

export class DeleteDonorDto {
    @ApiProperty({description: 'ID del donador a eliminar', example: '52'})
    @IsInt()
    id_donante: number;
}
