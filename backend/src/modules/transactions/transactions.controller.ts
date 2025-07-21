import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InsertTransactionDto } from './dto/insert-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DeleteTransactionDto } from './dto/delete-transaction.dto';

@ApiTags('Transacción')
@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar una nueva transacción' })
    @ApiResponse({ status: 201, description: 'Transacción registrada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertTransactionDto })
    async insertTransaction(@Body() dto: InsertTransactionDto) {
        return this.transactionsService.insertTransaction(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todas las transacciones' })
    @ApiResponse({ status: 200, description: 'Lista de transacciones obtenidas correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getTransactions(@Res() res) {
        return this.transactionsService.getTransactions(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar una transacción' })
    @ApiResponse({ status: 200, description: 'Transacción actualizada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: UpdateTransactionDto })
    async updateTransactions(@Body() dto: UpdateTransactionDto) {
        return this.transactionsService.updateTransactions(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar una transacción' })
    @ApiResponse({ status: 200, description: 'transacción eliminada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteTransactionDto })
    async deleteTransactions(@Body() dto: DeleteTransactionDto) {
        return this.transactionsService.deleteTransactions(dto);
    }
}
