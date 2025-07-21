//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class InsertTransactionDto {
    @ApiProperty({ description: 'Ingresar tipo de transacción', examples: ['Ingreso', 'Egreso'] })
    @IsString()
    tipo_transaccion: string;

    @ApiProperty({ description: 'Ingresar cantidad monetaria', example: 1500 })
    @IsNumber()
    monto: number;

    @ApiProperty({ description: 'Ingresar razon de la transacción', example: 'gastos en la fundación' })
    @IsString()
    razon: string;
}
