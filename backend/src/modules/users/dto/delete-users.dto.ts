//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteUsersDto {
    @ApiProperty({ description: 'ID del usuario a eliminar', example: 8 })
    @IsInt()
    id_usuario: number;
}
