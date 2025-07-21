//HECHO
import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString, Matches } from "class-validator";

export class UpdateDonationDto {
    @ApiProperty({ description: 'Actualizar ID del donador', example: '40', })
    @IsInt()
    id_donante: number;

    @ApiProperty({ description: 'Actualizar tipo de donacion', examples: ['Monetaria', 'Producto'] })
    @IsString()
    @Matches(/^[a-zA-Z]+$/, { message: 'Tipo de donacion solo puede contener letras' })
    tipo_donacion: string;

    @ApiProperty({ description: 'Actualizar valor estimado', example: '500 o 50.50', })
    @IsNumber()
    valor_estimado: number;

    @ApiProperty({ description: 'Actualizar método de pago', examples: ['Efectivo', 'Transferencia'] })
    @IsString()
    metodo_pago: string;

    @ApiProperty({ description: 'Actualizar detalle del producto', example: 'color, marca' })
    @IsString()
    detalle_donacion: string;

    @ApiProperty({ description: 'Actualizar imagen de la donación' })
    @IsString()
    url_image: string;

    @ApiProperty({ description: 'ID de la donación a actualizar', example: '10' })
    @IsInt()
    id_donacion: number;
}
