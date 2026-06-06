import {
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateCartItemDto {
  @IsString()
  serviceId!: string;

  @IsString()
  vendorId!: string;

  @IsString()
  pricingTitle!: string;

  @IsNumber()
  quantity!: number;
}