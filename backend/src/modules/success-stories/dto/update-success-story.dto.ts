import { PartialType } from '@nestjs/mapped-types';
import { CreateSuccessStoryDto } from './create-success-story.dto.js';

export class UpdateSuccessStoryDto extends PartialType(CreateSuccessStoryDto) {}
