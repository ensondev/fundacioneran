//HECHO
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";

export class InsertDonationDto {
    @ApiProperty({ description: 'Ingresar ID del donador', example: 8 })
    @IsInt()
    id_donante: number;

    @ApiProperty({ description: 'Ingresar tipo de donación', examples: ['Monetaria', 'Producto'] })
    @IsString()
    tipo_donacion: string;

    @ApiPropertyOptional({ description: 'Ingresar valor estimado (solo para donaciones monetarias)', example: 1.00 })
    @IsOptional()
    @IsNumber()
    valor_estimado?: number;

    @ApiPropertyOptional({ description: 'Ingresar método de pago (solo para donaciones monetarias)', examples: ['Efectivo', 'Transferencia'] })
    @IsOptional()
    @IsString()
    metodo_pago?: string;

    @ApiPropertyOptional({ description: 'Ingresar detalle del producto (solo para donaciones de producto)', example: 'Color rojo, marca XYZ' })
    @IsOptional()
    @IsString()
    detalle_donacion?: string;

    @ApiProperty({ description: 'Ingresar imagen de la donación' })
    @IsString()
    url_image: string;

    @IsOptional()
    @ApiPropertyOptional({ description: 'Disponible para entregar', default: true })
    disponible?: boolean;

}

