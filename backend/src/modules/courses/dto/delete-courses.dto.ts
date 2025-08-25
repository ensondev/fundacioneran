import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteCoursesDto {
    @ApiProperty({ description: 'Ingresar ID del curso a eliminar', example: 7 })
    @IsInt()
    id_curso: number;
}
