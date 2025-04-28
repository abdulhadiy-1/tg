import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(AuthGuard)
  createGr(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    return this.groupService.createGr(createGroupDto, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiQuery({
    name: "name",
    required: false
  })
  findAll(@Query("name") name: string) {
    return this.groupService.findGrs(name);
  }
}

