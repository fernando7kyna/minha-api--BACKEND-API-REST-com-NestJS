import { Controller, Get, Post, Body, HttpStatus, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUsersDto } from '../dto/create-users.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() users: CreateUserDto[]) {
    try {
      // Verifica se o body é um array
      if (!Array.isArray(users)) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'O corpo da requisição deve ser um array de usuários'
        };
      }

      // Verifica se há e-mails duplicados
      const emails = users.map(user => user.email);
      const existingEmails = await this.userService.findByEmails(emails);

      if (existingEmails.length > 0) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Alguns emails já estão cadastrados',
          existingEmails
        };
      }

      // Insere os usuários
      const newUsers = await this.userService.createMany(users);
      
      return {
        status: HttpStatus.CREATED,
        message: 'Usuários cadastrados com sucesso',
        users: newUsers
      };

    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro ao cadastrar usuários',
        error
      };
    }
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Post('batch')
  async createMany(@Body() createUsersDto: CreateUsersDto) {
    return this.userService.createMany(createUsersDto.users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.findById(id);

      if (!user) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Usuário não encontrado'
        };
      }

      return user;
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro ao buscar usuário',
        error
      };
    }
  }
} 