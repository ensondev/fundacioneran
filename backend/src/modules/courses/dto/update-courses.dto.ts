import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsString } from "class-validator";

export class UpdateCoursesDto {
    @ApiProperty({ description: 'Ingresar ID de la materia a actualizar', example: 1 })
    @IsInt()
    materia_id: number;

    @ApiProperty({ description: 'Ingresar ID del instructor a actualizar', example: 7 })
    @IsInt()
    instructor_id: number;

    @ApiProperty({ description: 'Actualizar descripcion del curso', example: 'modulo, temas' })
    @IsString()
    descripcion: string;

    @ApiProperty({ description: 'Actualizar Fecha incio del curso', example: '2025-05-31' })
    @IsDateString()
    fecha_inicio: string;

    @ApiProperty({ description: 'Actualizar Fecha fin del curso', example: '2025-16-31' })
    @IsDateString()
    fecha_fin: string;

    @ApiProperty({ description: 'Actualizar cantida de cupos disponibles', example: 50 })
    @IsInt()
    cupo_maximo: number;

    @ApiProperty({ description: 'Ingresar ID del curso a actualizar', example: 50 })
    @IsInt()
    id_curso: number;
}
