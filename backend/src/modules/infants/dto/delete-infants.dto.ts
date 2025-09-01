import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteInfantsDto {
    @ApiProperty({ description: 'ID del infante a eliminar', example: 7 })
    @IsInt()
    id_infante: number;
}
