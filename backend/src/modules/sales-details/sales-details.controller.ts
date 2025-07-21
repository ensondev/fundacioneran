import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SalesDetailsService } from './sales-details.service';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertDetailDto } from './dto/insert-detail.dto';
import { UpdateDetailDto } from './dto/update-detail.dto';
import { DeleteDetailDto } from './dto/delete-detail.dto';

@ApiTags('Detalle de la venta')
@Controller('sales-details')
export class SalesDetailsController {
    constructor(private salesDetailsService: SalesDetailsService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'insertar nuevo detalle de la venta' })
    @ApiResponse({ status: 201, description: 'detalle de la venta registrada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertDetailDto })
    async insertSalesDetail(@Body() dto: InsertDetailDto) {
        return this.salesDetailsService.insertSalesDetail(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todos los detalles de las ventas' })
    @ApiResponse({ status: 200, description: 'lista de detalles de las ventas obtenidas correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getSalesDetail(@Res() res) {
        return this.salesDetailsService.getSalesDetail(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'actualizar detalles de las ventas' })
    @ApiResponse({ status: 200, description: 'detalles de las ventas actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: UpdateDetailDto })
    async updateSalesDetail(@Body() dto: UpdateDetailDto) {
        return this.salesDetailsService.updateSalesDetail(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar detalles de la venta' })
    @ApiResponse({ status: 200, description: 'detalles de la venta eliminado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteDetailDto })
    async deleteSalesDetail(@Body() dto: DeleteDetailDto) {
        return this.salesDetailsService.deleteSalesDetail(dto);
    }
}
