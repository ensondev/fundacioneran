//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class UpdateWarehouseDto {
    @ApiProperty({ description: 'Actualizar nombre de la bodega', example: 'bodega2' })
    @IsString()
    nombre_bodega: string;

    @ApiProperty({ description: 'Actualizar ubicación de la bodega', example: 'calle actualizada' })
    @IsString()
    ubicacion: string;

    @ApiProperty({ description: 'ID de la bodega a actualizar', })
    @IsInt()
    id_bodega: number;
}

