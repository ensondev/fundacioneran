import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Query, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InstructorsService } from './instructors.service';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertInstructorsDto } from './dto/insert-instructors.dto';
import { DeleteInstructorsDto } from './dto/delete-instructors.dto';
import { UpdateInstructorsDto } from './dto/update-instructors.dto';

@ApiTags('Instructores')
@Controller('instructors')
export class InstructorsController {
    constructor(private instructorsService: InstructorsService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Registrar un nuevo instructor' })
    @ApiResponse({ status: 201, description: 'Instructor registrado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertInstructorsDto })
    async insertParticipants(@Body() dto: InsertInstructorsDto) {
        return this.instructorsService.insertInstructor(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener todos los instructores' })
    @ApiResponse({ status: 200, description: 'Lista de instructores obtenida correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getParticipants(@Res() res) {
        return this.instructorsService.getInstructors(res)
    }

    @Public()
    @Get('params')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener instructores por parámetros (filtro)' })
    @ApiResponse({ status: 200, description: 'Instructores obtenidos correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getInstructorsParams(@Query() query, @Res() res) {
        return this.instructorsService.getInstructorsParams(query, res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar instructor' })
    @ApiResponse({ status: 200, description: 'Instructor actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: UpdateInstructorsDto })
    async UpdateInstructor(@Body() dto: UpdateInstructorsDto) {
        return this.instructorsService.updateInstructor(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar participante' })
    @ApiResponse({ status: 200, description: 'Participante eliminado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteInstructorsDto })
    async DeleteParticipant(@Body() dto: DeleteInstructorsDto) {
        return this.instructorsService.deleteInstructor(dto);
    }
}
