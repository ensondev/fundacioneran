import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsString } from "class-validator";

export class InsertCoursesDto {
    @ApiProperty({ description: 'Ingresar ID de la materia', example: 1 })
    @IsInt()
    materia_id: number;

    @ApiProperty({ description: 'Ingresar ID del instructor', example: 7 })
    @IsInt()
    instructor_id: number;

    @ApiProperty({ description: 'Ingresar descripcion del curso', example: 'modulo, temas' })
    @IsString()
    descripcion: string;

    @ApiProperty({ description: 'Fecha incio del curso', example: '2025-05-31' })
    @IsDateString()
    fecha_inicio: string;

    @ApiProperty({ description: 'Fecha fin del curso', example: '2025-16-31' })
    @IsDateString()
    fecha_fin: string;

    @ApiProperty({ description: 'Ingresar cantida de cupos disponibles', example: 50 })
    @IsInt()
    cupo_maximo: number;
}
