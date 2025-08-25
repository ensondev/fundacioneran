import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class InsertSubjectDto {
    @ApiProperty({ description: 'Ingresar nombre de la materia', example: 'Base de datos' })
    @IsString()
    nombre_materia: string;

    @ApiProperty({ description: 'Ingresar descripción de la materia', example: 'fundamentos, temas, subtemas' })
    @IsString()
    descripcion: string;
}
