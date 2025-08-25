import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteRegistrationsDto {
    @ApiProperty({ description: 'Ingresar ID de la inscripcion a eliminar', example: 2 })
    @IsInt()
    id_inscripcion: number;
}
