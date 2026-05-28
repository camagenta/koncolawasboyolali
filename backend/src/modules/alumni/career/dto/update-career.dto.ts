import { PartialType } from '@nestjs/mapped-types';
import { CreateCareerDto } from './create-career.dto.js';

export class UpdateCareerDto extends PartialType(CreateCareerDto) {}
