import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { unlink } from 'fs/promises';
import { SuccessStoriesService } from './success-stories.service.js';
import { CreateSuccessStoryDto } from './dto/create-success-story.dto.js';
import { UpdateSuccessStoryDto } from './dto/update-success-story.dto.js';
import { AdminGuard } from '../admin/guards/admin.guard.js';

@Controller('success-stories')
export class SuccessStoriesController {
  constructor(private readonly successStoriesService: SuccessStoriesService) {}

  @Get()
  async findAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.successStoriesService.findAll(Number(page) || 1, Number(limit) || 20);
  }

  @Get('featured')
  async findFeatured() {
    return this.successStoriesService.findFeatured();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.successStoriesService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async create(@Body() dto: CreateSuccessStoryDto) {
    return this.successStoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateSuccessStoryDto) {
    return this.successStoriesService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  async remove(@Param('id') id: string) {
    return this.successStoriesService.remove(id);
  }

  @Post(':id/photo')
  @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/success-stories',
      filename: (req, file, cb) => {
        const storyId = (req as any).params.id;
        const timestamp = Date.now();
        const ext = extname(file.originalname) || '.jpg';
        cb(null, `ss-${storyId}-${timestamp}${ext}`);
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
  async uploadPhoto(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required');
    const existing = await this.successStoriesService.findById(id);
    if (existing.photoUrl?.startsWith('/uploads/success-stories/')) {
      const oldPath = join(process.cwd(), existing.photoUrl);
      try { await unlink(oldPath); } catch {}
    }
    const photoUrl = `/uploads/success-stories/${file.filename}`;
    return this.successStoriesService.update(id, { photoUrl } as UpdateSuccessStoryDto);
  }
}
