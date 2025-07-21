//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class InsertHeaderDto {
    @ApiProperty({description: 'Ingresar nombres completos del cliente'})
    @IsString()
    nombre_cliente: string;

    @ApiProperty({description: 'Ingresar cedula del cliente'}) 
    @IsString()
    cedula_cliente: string;

    @ApiProperty({description: 'Ingresar total pagado',})
    @IsNumber()
    total: number;

    @ApiProperty({description: 'Ingresar estado de venta'}) 
    @IsString()
    estado_venta: string;
}
