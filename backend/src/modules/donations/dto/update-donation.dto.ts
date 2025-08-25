import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class UpdateDonationDto {
    @ApiProperty({ description: 'ID de la donación a actualizar', example: 10 })
    @IsInt()
    id_donacion: number;

    @ApiProperty({ description: 'Actualizar ID del donador', example: 40 })
    @IsInt()
    id_donante: number;

    @ApiProperty({ description: 'Actualizar tipo de donación', examples: ['Monetaria', 'Producto'] })
    @IsString()
    @Matches(/^[a-zA-Z]+$/, { message: 'Tipo de donación solo puede contener letras' })
    tipo_donacion: string;

    @ApiPropertyOptional({ description: 'Actualizar valor estimado', example: 500 })
    @IsOptional()
    @IsNumber()
    valor_estimado?: number;

    @ApiPropertyOptional({ description: 'Actualizar método de pago', examples: ['Efectivo', 'Transferencia'] })
    @IsOptional()
    @IsString()
    metodo_pago?: string;

    @ApiProperty({ description: 'Actualizar detalle del producto', example: 'Color, marca' })
    @IsOptional()
    @IsString()
    detalle_donacion?: string;

    @ApiProperty({ description: 'Actualizar imagen de la donación', example: 'https://example.com/image.jpg' })
    @IsString()
    url_image: string;

    @IsOptional()
    @ApiPropertyOptional({ description: 'Disponible para entregar', default: true })
    disponible?: boolean;
}
