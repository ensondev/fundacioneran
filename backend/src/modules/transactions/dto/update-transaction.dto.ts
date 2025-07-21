//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString } from "class-validator";

export class UpdateTransactionDto {
    @ApiProperty({ description: 'Actualizar el tipo de transacción', examples: ['Ingreso', 'Egreso'] })
    @IsString()
    tipo_transaccion: string;

    @ApiProperty({ description: 'Actualizar la cantidad monetaria', example: 1500 })
    @IsNumber()
    monto: number;

    @ApiProperty({ description: 'Actualizar la razon de la transacción', example: 'gastos en la fundación' })
    @IsString()
    razon: string;

    @ApiProperty({ description: 'Actualizar ID de la transacción', example: 1 })
    @IsInt()
    id_transaccion: number;
}
