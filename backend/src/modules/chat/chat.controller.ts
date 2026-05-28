import { Controller, Get, Post, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service.js';
import { CreateGroupDto } from './dto/create-group.dto.js';
import { AddMemberDto } from './dto/add-member.dto.js';
import { QueryMessagesDto } from './dto/query-messages.dto.js';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('groups')
  async getGroups(@Req() req) {
    return this.chatService.findUserGroups(req.user.id);
  }

  @Post('groups')
  async createGroup(@Body() dto: CreateGroupDto, @Req() req) {
    return this.chatService.createGroup(dto, req.user.id);
  }

  @Get('groups/:id')
  async getGroup(@Param('id') id: string, @Req() req) {
    return this.chatService.findGroup(id, req.user.id);
  }

  @Post('groups/:id/members')
  async addMember(@Param('id') id: string, @Body() dto: AddMemberDto, @Req() req) {
    return this.chatService.addMember(id, dto.userId, req.user.id);
  }

  @Delete('groups/:id/members/:userId')
  async removeMember(@Param('id') id: string, @Param('userId') userId: string, @Req() req) {
    return this.chatService.removeMember(id, userId, req.user.id);
  }

  @Get('messages')
  async getMessages(@Query() query: QueryMessagesDto, @Req() req) {
    return this.chatService.findMessages(query, req.user.id);
  }
}
