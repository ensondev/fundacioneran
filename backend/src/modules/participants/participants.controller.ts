import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { ParticipantsService } from './participants.service';
import { InsertParticipantsDto } from './dto/insert-participants.dto';
import { DeleteParticipantsDto } from './dto/delete-participants.dto';

@ApiTags('Participantes')
@Controller('participants')
export class ParticipantsController {
    constructor(private participantsService: ParticipantsService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Registrar un nuevo participante' })
    @ApiResponse({ status: 201, description: 'Participante registrado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertParticipantsDto })
    async insertParticipants(@Body() dto: InsertParticipantsDto) {
        return this.participantsService.insertParticipant(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener todos los participantes' })
    @ApiResponse({ status: 200, description: 'Lista de participantes obtenida correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getParticipants(@Res() res) {
        return this.participantsService.getParticipants(res)
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar participante' })
    @ApiResponse({ status: 200, description: 'Participante eliminado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteParticipantsDto })
    async DeleteParticipant(@Body() dto: DeleteParticipantsDto) {
        return this.participantsService.deleteParticipant(dto);
    }
}
