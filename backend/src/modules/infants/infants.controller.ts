import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { InfantsService } from './infants.service';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsertInfantsDto } from './dto/insert-infants.dto';
import { UpdateInfantsDto } from './dto/update-infants.dto';
import { DeleteInfantsDto } from './dto/delete-infants.dto';

ApiTags('Infantes')
@Controller('infants')
export class InfantsController {
    constructor(private infantsService: InfantsService) { };
    
        @Public()
        @Post('insert')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({ summary: 'Registrar un nuevo infante' })
        @ApiResponse({ status: 201, description: 'Infante registrado correctamente' })
        @ApiResponse({ status: 500, description: 'Error interno del servidor' })
        @ApiBody({ type: InsertInfantsDto })
        async insertInfant(@Body() dto: InsertInfantsDto) {
            return this.infantsService.insertInfant(dto);
        }
    
        @Public()
        @Get('')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({ summary: 'Obtener todos los infantes' })
        @ApiResponse({ status: 200, description: 'Lista de infantes obtenida correctamente' })
        @ApiResponse({ status: 500, description: 'Error interno del servidor' })
        async getInfants(@Res() res) {
            return this.infantsService.getInfants(res)
        }
    
        @Public()
        @Put('update')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({ summary: 'Actualizar infante' })
        @ApiResponse({ status: 200, description: 'Infante actualizado correctamente' })
        @ApiResponse({ status: 500, description: 'Error interno del servidor' })
        @ApiBody({ type: UpdateInfantsDto })
        async updateInfant(@Body() dto: UpdateInfantsDto) {
            return this.infantsService.updateInfant(dto);
        }
    
        @Public()
        @Delete('delete')
        @HttpCode(HttpStatus.OK)
        @ApiOperation({ summary: 'Eliminar infante' })
        @ApiResponse({ status: 200, description: 'Infante eliminado correctamente' })
        @ApiResponse({ status: 500, description: 'Error interno del servidor' })
        @ApiBody({ type: DeleteInfantsDto })
        async deleteInfant(@Body() dto: DeleteInfantsDto) {
            return this.infantsService.deleteInfant(dto);
        }
}
