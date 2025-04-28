import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupService {
  constructor(private readonly client: PrismaService) {}
  async createGr(createGroupDto: CreateGroupDto, req: Request) {
    let group = await this.client.group.findUnique({
      where: { groupName: createGroupDto.groupName },
    });
    if (group) throw new BadRequestException('group alredy exists');
    let ownerId = req['user'];
    let newGr = await this.client.group.create({
      data: { ...createGroupDto, ownerId },
      include: { owner: true },
    });
    return newGr;
  }

  async findGrs(query: string) {
    let where: any = {};
    if (query) {
      where.name = query;
    }
    let groups = await this.client.group.findMany({
      where,
    });
    return groups;
  }

  async findGrById(id: string) {
    let group = await this.client.group.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!group) throw new NotFoundException('group not found');
    return group;
  }

  async updateGr(id: string, data: UpdateGroupDto, req: Request){
    let myId = req["user"]
    let group = await this.client.group.findFirst({
      where: { id, ownerId: myId},
    });
    if (!group) throw new NotFoundException('group not found');
    let newGr = await this.client.group.update({where: {id}, data})
    return newGr
  }

  async deleteGr(id: string, req: Request){
    let myId = req["user"]
    let group = await this.client.group.findFirst({
      where: { id, ownerId: myId},
    });
    if (!group) throw new NotFoundException('group not found');
    await this.client.group.delete({where: {id}})
    return {message: "group deleted", id}
  }

  
}
