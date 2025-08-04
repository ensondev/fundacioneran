//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsInt, IsNumber, IsString, ValidateIf } from "class-validator";

export class UpdateProductDto {
    @ApiProperty({ description: 'Indica si el producto es caducible', example: true })
    @IsBoolean()
    es_caducible: boolean;

    @ApiProperty({ description: 'Actualizar nombre del producto', example: 'Pan integral' })
    @IsString()
    nombre_producto: string;

    @ApiProperty({ description: 'Actualizar detalle del producto', example: 'Información nutricional' })
    @IsString()
    detalle_producto: string;

    @ApiProperty({ description: 'Actualizar ID de la categoria del producto', example: '4' })
    @IsInt()
    categoria_id: number;

    @ApiProperty({ description: 'Actualizar fecha de caducidad (solo si es caducible)', example: '2025-12-31', required: false })
    @ValidateIf(o => o.es_caducible)
    @IsDateString()
    fecha_caducidad?: string;

    @ApiProperty({ description: 'Actualizar precio del producto', example: 49.99 })
    @IsNumber()
    precio_venta: number;

    @ApiProperty({ description: 'ID del producto a actualizar', example: '1' })
    @IsInt()
    id_producto: number;
}
