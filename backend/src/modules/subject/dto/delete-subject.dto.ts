import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteSubjectDto {
    @ApiProperty({ description: 'ID de la materia a eliminar', example: 5 })
    @IsInt()
    id_materia: number;
}
