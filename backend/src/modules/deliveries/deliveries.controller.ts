import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsertDeliverieDto } from './dto/insert-deliverie.dto';
import { UpdateDeliverieDto } from './dto/update-deliverie.dto';
import { DeleteDeliverieDto } from './dto/delete-deliverie.dto';

@ApiTags('Entregas')
@Controller('deliveries')
export class DeliveriesController {
    constructor(private deliveriesService: DeliveriesService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar una nueva entrega' })
    @ApiResponse({ status: 201, description: 'Entrega registrada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertDeliverieDto })
    async insertDeliverie(@Body() dto: InsertDeliverieDto) {
        return this.deliveriesService.insertDeliverie(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todas las entregas' })
    @ApiResponse({ status: 200, description: 'Lista de entregas obtenidas correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getDeliveries(@Res() res) {
        return this.deliveriesService.getDeliveries(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar una entrega' })
    @ApiResponse({ status: 200, description: 'Entrega actualizada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: UpdateDeliverieDto })
    async updateDeliverie(@Body() dto: UpdateDeliverieDto) {
        return this.deliveriesService.updateDeliverie(dto);
    }


    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar una entrega' })
    @ApiResponse({ status: 200, description: 'Entrega eliminada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteDeliverieDto })
    async deleteDeliverie(@Body() dto: DeleteDeliverieDto) {
        return this.deliveriesService.deleteDeliverie(dto);
    }
}
