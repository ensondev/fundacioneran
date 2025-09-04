import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Res } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertCoursesDto } from './dto/insert-courses.dto';
import { DeleteCoursesDto } from './dto/delete-courses.dto';
import { UpdateCoursesDto } from './dto/update-courses.dto';
import { UpdateAvailabilityCoursesDto } from './dto/update-availability-courses.dto';

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
    @Get('by-materia')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener cursos por materia (filtro)' })
    @ApiResponse({ status: 200, description: 'Cursos filtrados por materia' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getCoursesByMateria(@Query('materia_id') materia_id: number, @Res() res) {
        return this.coursesService.getCoursesByMateria(materia_id, res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar curso' })
    @ApiResponse({ status: 200, description: 'Curso actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: UpdateCoursesDto })
    async UpdateCourses(@Body() dto: UpdateCoursesDto) {
        return this.coursesService.updateCourses(dto);
    }

    @Public()
    @Put('update-availability')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar activo del curso' })
    @ApiResponse({ status: 200, description: 'Activo del curso actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: UpdateAvailabilityCoursesDto })
    async updateAvailabilityCourse(@Body() dto: UpdateAvailabilityCoursesDto) {
        return this.coursesService.updateAvailabilityCourse(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar curso' })
    @ApiResponse({ status: 200, description: 'Curso eliminado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteCoursesDto })
    async DeleteCourses(@Body() dto: DeleteCoursesDto) {
        return this.coursesService.deleteCourses(dto);
    }
}
