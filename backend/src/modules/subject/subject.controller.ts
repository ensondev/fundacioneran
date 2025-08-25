import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { ApiBadGatewayResponse, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertSubjectDto } from './dto/insert-subject.dto';
import { runInThisContext } from 'vm';
import { DeleteSubjectDto } from './dto/delete-subject.dto';

@ApiTags('Materias')
@Controller('subject')
export class SubjectController {
    constructor(private subjectService: SubjectService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Registrar una nueva materia' })
    @ApiResponse({ status: 201, description: 'Materia registrada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertSubjectDto })
    async insertSubject(@Body() dto: InsertSubjectDto) {
        return this.subjectService.insertSubjet(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener todas las materias' })
    @ApiResponse({ status: 200, description: 'Lista de materias obtenida correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getSubject(@Res() res) {
        return this.subjectService.getSubject(res);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar materia' })
    @ApiResponse({ status: 200, description: 'Materia eliminada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteSubjectDto })
    async DeleteSubjectDto(@Body() dto: DeleteSubjectDto){
        return this.subjectService.deleteSubject(dto);
    }
}
