import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { MongoServerError } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
I
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(page = 1, limit = 10): Promise<UserResponseDto[]> {
    const skip = (page - 1) * limit;

    const users = await this.userModel
      .find()
      .select('-password') // Remove o campo 'password' da resposta
      .skip(skip)
      .limit(limit)
      .exec();

    return users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    }));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    if (!isValidObjectId(id)) {
      throw new NotFoundException('ID inválido');
    }

    const user = await this.userModel.findById(id).select('-password').exec();

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
