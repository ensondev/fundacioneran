import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsInt } from "class-validator";

export class UpdateAvailabilityCoursesDto {
    @ApiProperty({ description: 'Actualizar activo del curso', examples: [true, false] })
    @IsBoolean()
    activo: boolean;

    @ApiProperty({ description: 'Ingresar ID del curso a actualizar', example: 50 })
    @IsInt()
    id_curso: number;
}
