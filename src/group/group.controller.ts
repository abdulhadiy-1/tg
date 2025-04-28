import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import { text } from 'stream/consumers';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard)
  createGr(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    return this.groupService.createGr(createGroupDto, req);
  }

  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
  })
  findAll(@Query('name') name: string) {
    return this.groupService.findGrs(name);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.groupService.findGrById(id);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  updateGr(
    @Param('id') id: string,
    @Body() data: UpdateGroupDto,
    @Req() req: Request,
  ) {
    return this.groupService.updateGr(id, data, req);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteGr(@Param('id') id: string, @Req() req: Request) {
    return this.groupService.deleteGr(id, req);
  }


  @UseGuards(AuthGuard)
  @Post('message/:groupId')
  createMessage(
    @Param('groupId') id: string,
    @Body() text: CreateMessageDto,
    @Req() req: Request,
  ) {
    return this.groupService.createMessage(id, text, req);
  }

  @Get('message/:groupId')
  getMessages(@Param('groupId') id: string) {
    return this.groupService.getMessages(id);
  }

  @Get('message/:id')
  getMessage(@Param('id') id: string) {
    return this.groupService.getMessage(id);
  }
  @UseGuards(AuthGuard)
  @Patch('message/:id')
  updateMessage(
    @Param('id') id: string,
    @Body() text: string,
    @Req() req: Request,
  ) {
    return this.groupService.updateMessage(id, text, req);
  }
  @UseGuards(AuthGuard)
  @Delete('message/:id')
  deleteMessage(@Param('id') id: string, @Req() req: Request) {
    return this.groupService.deleteMessage(id, req);
  }
}
