//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString } from "class-validator";

export class UpdateHeaderDto {
    @ApiProperty({ description: 'Actualizar nombres completos del cliente' })
    @IsString()
    nombre_cliente: string;

    @ApiProperty({ description: 'Actualizar cedula del cliente' })
    @IsString()
    cedula_cliente: string;

    @ApiProperty({ description: 'Actualizar total pagado' })
    @IsNumber()
    total: number;

    @ApiProperty({ description: 'Actualizar estado de venta' })
    @IsString()
    estado_venta: string;

    @ApiProperty({ description: 'Ingresar ID del cliente a actualizar' })
    @IsInt()
    id_venta: number;
}
