import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteInstructorsDto {
    @ApiProperty({ description: 'ID del instructor a eliminar', example: 2 })
    @IsInt()
    id_instructor: number;
}
