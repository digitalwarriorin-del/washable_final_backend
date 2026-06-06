import {
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import {
  ServiceCategory,
} from '../../../database/schemas/service.schema';

class PricingDto {

  @IsString()
  title!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  estimatedHours!: number;
}

export class CreateServiceDto {


  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsEnum(ServiceCategory)
  category!: ServiceCategory;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => PricingDto)
  pricing!: PricingDto[];
}