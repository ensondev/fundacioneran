import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertCoursesDto } from './dto/insert-courses.dto';
import { DeleteCoursesDto } from './dto/delete-courses.dto';

@ApiTags('Cursos')
@Controller('courses')
export class CoursesController {
    constructor(private coursesService: CoursesService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Registrar un nuevo curso' })
    @ApiResponse({ status: 201, description: 'Curso registrado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertCoursesDto })
    async insertCourse(@Body() dto: InsertCoursesDto) {
        return this.coursesService.insertCourse(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener todos los cursos' })
    @ApiResponse({ status: 200, description: 'Lista de cursos obtenido correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getCourses(@Res() res) {
        return this.coursesService.getCourses(res);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar curso' })
    @ApiResponse({ status: 200, description: 'Curso eliminado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteCoursesDto })
    async DeleteSubjectDto(@Body() dto: DeleteCoursesDto) {
        return this.coursesService.deleteCourses(dto);
    }
}
