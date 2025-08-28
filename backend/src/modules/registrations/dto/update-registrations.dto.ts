import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class UpdateRegistrationsDto {
    @ApiProperty({ description: 'Ingresar ID del participante a actualizar', example: 7 })
    @IsInt()
    participante_id: number;

    @ApiProperty({ description: 'Ingresar ID del curso a actualizar', example: 2 })
    @IsInt()
    curso_id: number;

    @ApiProperty({ description: 'Ingresar ID del curso a actualizar', example: '4' })
    @IsInt()
    id_inscripcion: number;
}
