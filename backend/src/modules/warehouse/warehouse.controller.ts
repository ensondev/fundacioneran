import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertWarehouseDto } from './dto/insert-warehouse.dto';
import { WarehouseService } from './warehouse.service';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { DeleteWarehouseDto } from './dto/delete-warehouse.dto';

@ApiTags('Bodegas')
@Controller('warehouse')
export class WarehouseController {
    constructor(private warehouseService: WarehouseService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar una nueva bodega' })
    @ApiResponse({ status: 201, description: 'bodega registrada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: InsertWarehouseDto })
    async createWareHouse(@Body() dto: InsertWarehouseDto) {
        return this.warehouseService.createWareHouse(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todas las bodegas' })
    @ApiResponse({ status: 200, description: 'Lista de bodegas obtenidas correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getWareHouse(@Res() res) {
        return this.warehouseService.getWareHouse(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar una bodega' })
    @ApiResponse({ status: 200, description: 'bodega actualizada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: UpdateWarehouseDto })
    async updateWarehouse(@Body() dto: UpdateWarehouseDto) {
        return this.warehouseService.updateWarehouse(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar una bodega' })
    @ApiResponse({ status: 200, description: 'bodega eliminada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: DeleteWarehouseDto })
    async deleteWarehouse(@Body() dto: DeleteWarehouseDto) {
        return this.warehouseService.deleteWarehouse(dto);
    }
}
