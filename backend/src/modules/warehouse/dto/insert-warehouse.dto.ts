//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class InsertWarehouseDto {
    @ApiProperty({ description: 'Insertar nombre de la bodega', example: 'bodega1' })
    @IsString()
    nombre_bodega: string;

    @ApiProperty({ description: 'Insertar ubicación de la bodega', example: 'calle falsa 3' })
    @IsString()
    ubicacion: string;
}
