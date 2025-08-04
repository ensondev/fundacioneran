import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertProductDto } from './dto/insert-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DeleteProductDto } from './dto/delete-product.dto';

@ApiTags('productos')
@Controller('products')
export class ProductsController {
    constructor(private productsService: ProductsService) { };

    @Public()
    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar un nuevo producto' })
    @ApiResponse({ status: 201, description: 'Producto registrado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: InsertProductDto })
    async registerProduct(@Body() dto: InsertProductDto) {
        return this.productsService.registerProduct(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todos los productos' })
    @ApiResponse({ status: 200, description: 'Lista de productos obtenidos correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getProducts(@Res() res) {
        return this.productsService.getProducts(res);
    }

    @Public()
    @Get('with-categorie')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todos los productos con sus categorias' })
    @ApiResponse({ status: 200, description: 'Lista de productos con categorias obtenidos correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getProductsWithCategories(@Res() res) {
        return this.productsService.getProductsWithCategories(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar un producto' })
    @ApiResponse({ status: 200, description: 'Producto actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: UpdateProductDto })
    async updateProduct(@Body() dto: UpdateProductDto) {
        return this.productsService.updateProduct(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar un producto' })
    @ApiResponse({ status: 200, description: 'producto eliminado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: DeleteProductDto })
    async deleteProduct(@Body() dto: DeleteProductDto) {
        return this.productsService.deleteProduct(dto);
    }
}
