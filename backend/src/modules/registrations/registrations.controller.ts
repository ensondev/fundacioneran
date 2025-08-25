import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsertRegistrationsDto } from './dto/insert-registrations.dto';
import { DeleteRegistrationsDto } from './dto/delete-registrations.dto';

@ApiTags('Inscripciones')
@Controller('registrations')
export class RegistrationsController {
    constructor(private registrationsService: RegistrationsService) { };
    
        @Public()
        @Post('insert')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({ summary: 'Registrar una nueva inscripción' })
        @ApiResponse({ status: 201, description: 'Inscripción registrada correctamente' })
        @ApiResponse({ status: 500, description: 'Error interno del servidor' })
        @ApiBody({ type: InsertRegistrationsDto })
        async insertRegistration(@Body() dto: InsertRegistrationsDto) {
            return this.registrationsService.insertRegistration(dto);
        }
    
        @Public()
        @Get('')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({ summary: 'Obtener todas las inscripciones' })
        @ApiResponse({ status: 200, description: 'Lista de inscripciones obtenida correctamente' })
        @ApiResponse({ status: 500, description: 'Error interno del servidor' })
        async getRegistrations(@Res() res) {
            return this.registrationsService.getRegistrations(res);
        }
    
        @Public()
        @Delete('delete')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({ summary: 'Eliminar materia' })
        @ApiResponse({ status: 200, description: 'Materia eliminada correctamente' })
        @ApiResponse({ status: 500, description: 'Error interno del servidor' })
        @ApiBody({ type: DeleteRegistrationsDto })
        async deleteRegistration(@Body() dto: DeleteRegistrationsDto){
            return this.registrationsService.deleteRegistration(dto);
        }
}
