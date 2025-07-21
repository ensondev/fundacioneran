import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertDonationDto } from './dto/insert-donation.dto';
import { UpdateDonationDto } from './dto/update-donation.dto';
import { DeleteDonationDto } from './dto/delete-donation.dto';

@ApiTags('Donaciones')
@Controller('donations')
export class DonationsController {
    constructor(private donationsService: DonationsService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar una nueva donación' })
    @ApiResponse({ status: 201, description: 'Donación registrada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertDonationDto })
    async insertDonation(@Body() dto: InsertDonationDto) {
        return this.donationsService.insertDonation(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todas las donaciones' })
    @ApiResponse({ status: 200, description: 'Lista de donaciones obtenidas correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getDonations(@Res() res) {
        return this.donationsService.getDonations(res);
    }

    @Public()
    @Get('with-donors')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todas las donaciones con los donadores' })
    @ApiResponse({ status: 200, description: 'Lista de donadores obtenidas correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getAllDonationsWithDonor(@Res() res) {
        return this.donationsService.getDonationsWithDonors(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar una donación' })
    @ApiResponse({ status: 200, description: 'Donación actualizada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: UpdateDonationDto })
    async updateDonation(@Body() dto: UpdateDonationDto) {
        return this.donationsService.updateDonation(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar una donación' })
    @ApiResponse({ status: 200, description: 'Donación eliminada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteDonationDto })
    async deleteDonation(@Body() dto: DeleteDonationDto) {
        return this.donationsService.deleteDonation(dto);
    }
}
