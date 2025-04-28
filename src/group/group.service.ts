import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';

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
      where.name = {
        contains: query,
        mode: 'insensitive',
      };
    }
    let groups = await this.client.group.findMany({
      where,
    });
    return groups;
  }

  async findGrById(id: string) {
    let group = await this.client.group.findUnique({
      where: { id },
      include: { owner: true, GroupMessage: true },
    });
    if (!group) throw new NotFoundException('group not found');
    return group;
  }

  async updateGr(id: string, data: UpdateGroupDto, req: Request) {
    const myId = req['user'];

    const group = await this.client.group.findFirst({
      where: { id, ownerId: myId },
    });

    if (!group) throw new NotFoundException('Group not found');

    if (!Object.keys(data).length) {
      return group;
    }

    if (data.groupName && data.groupName !== group.groupName) {
      const match = await this.client.group.findFirst({
        where: { groupName: data.groupName },
      });
      if (match) {
        throw new BadRequestException(
          'Group with this groupName already exists',
        );
      }
    }

    const updatedGroup = await this.client.group.update({
      where: { id },
      data,
    });

    return updatedGroup;
  }

  async deleteGr(id: string, req: Request) {
    let myId = req['user'];
    let group = await this.client.group.findFirst({
      where: { id, ownerId: myId },
    });
    if (!group) throw new NotFoundException('group not found');
    await this.client.group.delete({ where: { id } });
    return { message: 'group deleted', id };
  }

  async createMessage(id: string, text: CreateMessageDto, req: Request) {
    let myId = req['user'];
    let group = await this.client.group.findUnique({
      where: { id },
    });
    if (!group) throw new NotFoundException('group not found');
    let message = await this.client.groupMessage.create({
      data: { fromId: myId, text: text.text, groupId: id },
    });
    return message;
  }

  async getMessages(grId: string) {
    let messages = await this.client.groupMessage.findMany({
      where: { groupId: grId },
    });

    return messages;
  }

  async getMessage(id: string) {
    let message = await this.client.groupMessage.findUnique({
      where: { id },
    });
    if (!message) throw new NotFoundException('message not found');
    return message;
  }

  async updateMessage(id: string, text: string, req: Request) {
    const myId = req['user'];
  
    const message = await this.client.groupMessage.findUnique({
      where: { id },
    });
  
    if (!message || message.fromId !== myId) {
      throw new NotFoundException('Message not found');
    }
  
    if (!text) return message;
  
    const newMessage = await this.client.groupMessage.update({
      where: { id },
      data: { text },
    });
  
    return newMessage;
  }
  
  async deleteMessage(id: string, req: Request) {
    const myId = req['user'];

    const message = await this.client.groupMessage.findUnique({
      where: { id },
    });

    if (!message || message.fromId !== myId) {
      throw new NotFoundException('Message not found');
    }

    await this.client.groupMessage.delete({ where: { id } });

    return { message: 'Message deleted' };
  }
}
