import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class InsertRegistrationsDto {
    @ApiProperty({ description: 'Ingresar ID del participante', example: 7 })
    @IsInt()
    participante_id: number;

    @ApiProperty({ description: 'Ingresar ID del curso', example: 2 })
    @IsInt()
    curso_id: number;
}
