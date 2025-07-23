import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Req, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BeneficiariesService } from './beneficiaries.service';
import { InsertBeneficiarieDto } from './dto/insert-beneficiarie.dto';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { UpdateBeneficiarieDto } from './dto/update-beneficiarie.dto';
import { DeleteBeneficiarieDto } from './dto/delete-beneficiarie.dto';

@ApiTags('Beneficiarios')
@Controller('beneficiaries')
export class BeneficiariesController {
    constructor(private beneficiariesService: BeneficiariesService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo beneficiario' })
    @ApiResponse({ status: 201, description: 'Beneficiario registrado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: InsertBeneficiarieDto })
    async insertBeneficiarie(@Body() dto: InsertBeneficiarieDto) {
        return this.beneficiariesService.insertBeneficiarie(dto);
    }

    @Post('cedula')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener beneficiario por cédula' })
    @ApiResponse({ status: 200, description: 'Beneficiario obtenido correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getBeneficiarieByCedula(@Req() req, @Res() res) {
        return this.beneficiariesService.getBeneficiarieByCedula(req, res);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todos los beneficiarios' })
    @ApiResponse({ status: 200, description: 'Lista de beneficiarios obtenida correctamente.' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getBeneficiaries(@Res() res) {
        return this.beneficiariesService.getBeneficiaries(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar un beneficiario' })
    @ApiResponse({ status: 200, description: 'Beneficiario actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: UpdateBeneficiarieDto })
    async updateBeneficiarie(@Body() dto: UpdateBeneficiarieDto) {
        return this.beneficiariesService.updateBeneficiarie(dto);
    }


    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar un beneficiario' })
    @ApiResponse({ status: 200, description: 'Beneficiario eliminado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: DeleteBeneficiarieDto })
    async deleteBeneficiarie(@Body() dto: DeleteBeneficiarieDto) {
        return this.beneficiariesService.deleteBeneficiarie(dto);
    }
}
