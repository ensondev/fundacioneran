//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt } from "class-validator";

export class DeleteTransactionDto {
    @ApiProperty({ description: 'Eliminar ID de la transacción', example: 1 })
    @IsInt()
    id_transaccion: number;
}
