import { Controller, Get, Post, Put, Param, Query, Body, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import { Public } from '../../../common/decorators/public.decorator.js';
import { ProfilesService } from './profiles.service.js';
import { CreateProfileDto } from './dto/create-profile.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Controller('alumni/profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  async findAll(
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('tahunMasuk') tahunMasuk?: string,
    @Query('jurusan') jurusan?: string,
    @Query('statusUtama') statusUtama?: string,
    @Query('kotaDomisili') kotaDomisili?: string,
  ) {
    return this.profilesService.findAll({ q, page, limit, sortBy, sortOrder, tahunMasuk, jurusan, statusUtama, kotaDomisili });
  }

  @Public()
  @Get(':id/public')
  async findPublicProfile(@Param('id') id: string) {
    return this.profilesService.findPublicProfile(id);
  }

  @Get('me')
  async getMe(@Req() req) {
    return this.profilesService.findByUserId(req.user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.profilesService.findById(id);
  }

  @Post('me')
  async create(@Req() req, @Body() dto: CreateProfileDto) {
    return this.profilesService.create(req.user.id, dto);
  }

  @Put('me')
  async update(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.profilesService.update(req.user.id, dto);
  }

  @Post('me/photo')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profiles',
      filename: (req, file, cb) => {
        const userId = (req as any).user.id;
        const timestamp = Date.now();
        const ext = file.originalname.split('.').pop() || 'jpg';
        cb(null, `${userId}-${timestamp}.${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
        cb(new BadRequestException('File must be an image (jpeg, png, or webp)'), false);
        return;
      }
      cb(null, true);
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async uploadPhoto(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const existing = await this.profilesService.findByUserId(req.user.id);
    if (existing.fotoProfil) {
      const oldPath = join(process.cwd(), existing.fotoProfil);
      try { await unlink(oldPath); } catch {}
    }
    const photoUrl = `/uploads/profiles/${file.filename}`;
    return this.profilesService.updatePhoto(req.user.id, photoUrl);
  }
}
