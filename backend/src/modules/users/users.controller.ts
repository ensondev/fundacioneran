import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Put, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUsersDto } from 'src/modules/users/dto/update-users.dto';
import { Public } from 'src/authentication/auth/guard/auth.guard';
import { DeleteUsersDto } from 'src/modules/users/dto/delete-users.dto';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { };

    @Public()
    @Get('')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener todos los usuarios' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenidos corractamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async getAllUsers(@Res() res) {
        return this.usersService.getAllUsers(res);
    }

    @Public()
    @Put('update')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar un usuario' })
    @ApiResponse({ status: 200, description: 'Usuario actualizado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: UpdateUsersDto })
    async updateUsers(@Body() dto: UpdateUsersDto) {
        return this.usersService.updateUsers(dto);
    }

    @Public()
    @Delete('delete')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiResponse({ status: 200, description: 'Usuario eliminado correctamente' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    @ApiBody({ type: DeleteUsersDto })
    async deleteUser(@Body() dto: DeleteUsersDto) {
        return this.usersService.deleteUser(dto);
    }
}
