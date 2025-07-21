import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Post, Put, Res } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { InsertCategorieDto } from './dto/insert-categorie.dto';
import { UpdateCategorieDto } from './dto/update-categorie.dto';
import { DeleteCategorieDto } from './dto/delete-categorie.dto';

@ApiTags('Categorías')
@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) { };

    @Public()
    @Post('insert')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Registrar una nueva categoría' })
    @ApiResponse({ status: 201, description: 'Categoria registrada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: InsertCategorieDto })
    async insertCategorie(@Body() dto: InsertCategorieDto) {
        return this.categoriesService.insertCategorie(dto);
    }

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ description: 'Obtener todas las categorías' })
    @ApiResponse({ status: 200, description: 'Lista de categorias obtenidas correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    async getCategories(@Res() res) {
        return this.categoriesService.getCategories(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar una categoría' })
    @ApiResponse({ status: 200, description: 'Categoria actualizada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: UpdateCategorieDto })
    async updateCategorie(@Body() dto: UpdateCategorieDto) {
        return this.categoriesService.updateCategorie(dto);
    }


    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar una categoria' })
    @ApiResponse({ status: 200, description: 'Categoria eliminada correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
    @ApiBody({ type: DeleteCategorieDto })
    async deleteCategorie(@Body() dto: DeleteCategorieDto) {
        return this.categoriesService.deleteCategorie(dto);
    }
}
