import { ApiProperty } from "@nestjs/swagger";
import { IsNumberString, IsString, Matches } from "class-validator";

export class InsertInstructorsDto {
    @ApiProperty({ description: 'Ingresar nombre del instructor', example: 'Diego Sebastian Serrano Bustamante' })
    @IsString()
    nombres: string;

    @ApiProperty({ description: 'Ingresar cédula del instructor (10 dígitos)', example: '1300000000', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'La cédula debe contener exactamente 10 dígitos.' })
    cedula: string;

    @ApiProperty({ description: 'Ingresar número de teléfono del instructor (10 dígitos)', example: '0999999999', })
    @IsNumberString()
    @Matches(/^[0-9]{10}$/, { message: 'El teléfono debe contener exactamente 10 dígitos.' })
    telefono: string;

    @ApiProperty({ description: 'Ingresar correo del instructor', example: 'correo123@gmail.com', })
    @IsString()
    correo: string;

    @ApiProperty({ description: 'Ingresar especialidad del instructor', example: 'ingeniero en informatica', })
    @IsString()
    especialidad: string;
}
