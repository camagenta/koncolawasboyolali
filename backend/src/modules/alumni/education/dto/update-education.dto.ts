import { PartialType } from '@nestjs/mapped-types';
import { CreateEducationDto } from './create-education.dto.js';

export class UpdateEducationDto extends PartialType(CreateEducationDto) {}
