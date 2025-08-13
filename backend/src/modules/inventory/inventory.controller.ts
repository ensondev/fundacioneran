import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertInventoryDto } from './dto/insert-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { DeleteInventoryDto } from './dto/delete-inventory.dto';

@ApiTags('Inventario')
@Controller('inventory')
export class InventoryController {
    constructor(private inventoryService: InventoryService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Ingresar nuevo producto al inventario' })
    @ApiResponse({ status: 201, description: 'Producto ingresado al inventario correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: InsertInventoryDto })
    async insertProductInventory(@Body() dto: InsertInventoryDto) {
        return this.inventoryService.insertProductInventory(dto);
    }

    @Post('update-stock')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Actualizar stock del producto' })
    @ApiResponse({ status: 201, description: 'Stock actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    updateStock(@Body() dto: { id_inventario: number, cantidadVendida: number }) {
        return this.inventoryService.updateStock(dto.id_inventario, dto.cantidadVendida);
    }


    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todos productos del inventario' })
    @ApiResponse({ status: 200, description: 'Lista de productos obtenidos del inventario correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getProductInventory(@Res() res) {
        return this.inventoryService.getProductsInventory(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar un producto del inventario' })
    @ApiResponse({ status: 200, description: 'Producto del inventario actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: UpdateInventoryDto })
    async updateProductInventory(@Body() dto: UpdateInventoryDto) {
        return this.inventoryService.updateProductInventory(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar un producto del inventario' })
    @ApiResponse({ status: 200, description: 'Producto eliminado del inventario correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: DeleteInventoryDto })
    async deleteProductInventory(@Body() dto: DeleteInventoryDto) {
        return this.inventoryService.deleteProductInventory(dto);
    }
}
