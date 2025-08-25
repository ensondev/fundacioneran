import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";


export class DeleteParticipantsDto {
    @ApiProperty({ description: 'ID del participante a eliminar', example: 7 })
    @IsInt()
    id_participante: number;
}
