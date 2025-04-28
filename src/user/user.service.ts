import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(private readonly client: PrismaService, private jwt: JwtService) {}
  async register(data: RegisterUserDto) {
    let user = await this.client.user.findMany({
      where: {
        OR: [{ phone: data.phone }, { userName: data.userName }],
      },
    });
    if (user.length) throw new BadRequestException('user alredy exists');
    let hash = bcrypt.hashSync(data.password, 10);
    let newUser = this.client.user.create({
      data: {
        ...data,
        password: hash,
      },
    });
    return newUser;
  }

  async getAll(){
    return await this.client.user.findMany()
  }

  async login(data: LoginUserDto) {
    let user = await this.client.user.findUnique({
      where: {
        phone: data.phone,
      },
    });
    if (!user) throw new BadRequestException('user not exists');
    let match = bcrypt.compareSync(data.password, user.password)
    if (!match) throw new BadRequestException('wrong password');
    let token = this.jwt.sign({id: user.id})
    return {token}
  }
}
