import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt } from "class-validator";

export class UpdateAvailabilityDto {
    @ApiProperty({ description: 'Nueva disponibilidad', example: true })
    @IsBoolean()
    disponible: boolean;

    @ApiProperty({ description: 'ID de la donación a actualizar', example: 10 })
    @IsInt()
    id_donacion: number;
}
