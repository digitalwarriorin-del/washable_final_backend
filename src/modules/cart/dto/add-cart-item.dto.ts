import {
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

import { Type } from 'class-transformer';

export class AddCartItemDto {

  @IsString()
  serviceId!: string;

  @IsString()
  vendorId!: string;

  @IsString()
  serviceName!: string;

  @IsString()
  pricingTitle!: string;

  @Type(() => Number)
  @IsNumber()
  quantity!: number;

  @Type(() => Number)
  @IsNumber()
  price!: number;

  @IsOptional()
  @IsString()
  image?: string;
}