import { PartialType } from '@nestjs/mapped-types';
import { CreateThreadDto } from './create-thread.dto.js';

export class UpdateThreadDto extends PartialType(CreateThreadDto) {}
