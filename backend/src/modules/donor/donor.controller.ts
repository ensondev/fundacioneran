import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Req, Res } from '@nestjs/common';
import { DonorService } from './donor.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsertDonorDto } from './dto/insert-donor.dto';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { UpdateDonorDto } from './dto/update-donor.dto';
import { DeleteDonorDto } from './dto/delete-donor.dto';

@ApiTags('Donador')
@Controller('donor')
export class DonorController {
    constructor(private donorService: DonorService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo donador' })
    @ApiResponse({ status: 201, description: 'Donador registrado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: InsertDonorDto })
    async registerDonor(@Body() dto: InsertDonorDto) {
        return this.donorService.registerDonor(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener todos los donadores' })
    @ApiResponse({ status: 200, description: 'Lista de donadores obtenida correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getDonors(@Res() res) {
        return this.donorService.getDonors(res);
    }

    @Post('cedula')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener donador por numero de identificación' })
    @ApiResponse({ status: 200, description: 'Donador obtenido correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getDonorByCedula(@Req() req, @Res() res) {
        return this.donorService.getDonorByCedula(req, res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar un donador' })
    @ApiResponse({ status: 200, description: 'Donador actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: UpdateDonorDto })
    async updateDonor(@Body() dto: UpdateDonorDto) {
        return this.donorService.updateDonor(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar un donador' })
    @ApiResponse({ status: 200, description: 'Donador eliminado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: DeleteDonorDto })
    async deleteDonor(@Body() dto: DeleteDonorDto) {
        return this.donorService.deleteDonor(dto);
    }
}
