import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { SalesHeaderService } from './sales-header.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertHeaderDto } from './dto/insert-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';
import { DeleteHeaderDto } from './dto/delete-header.dto';

@ApiTags('Cliente Venta')
@Controller('sales-header')
export class SalesHeaderController {
    constructor(private salesHeaderService: SalesHeaderService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo cliente venta' })
    @ApiResponse({ status: 201, description: 'cliente venta registrada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertHeaderDto })
    async insertSalesHeader(@Body() dto: InsertHeaderDto) {
        return this.salesHeaderService.insertSalesHeader(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todos los clientes venta' })
    @ApiResponse({ status: 200, description: 'lista de clientes venta obtenidas correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getSalesHeader(@Res() res) {
        return this.salesHeaderService.getSalesHeader(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar un cliente venta' })
    @ApiResponse({ status: 200, description: 'cliente venta actualizada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: UpdateHeaderDto })
    async updateSalesHeader(@Body() dto: UpdateHeaderDto) {
        return this.salesHeaderService.updateSalesHeader(dto);
    }


    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar un cliente venta' })
    @ApiResponse({ status: 200, description: 'cliente venta eliminada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteHeaderDto })
    async deleteSalesHeader(@Body() dto: DeleteHeaderDto) {
        return this.salesHeaderService.deleteSalesHeader(dto);
    }
}
