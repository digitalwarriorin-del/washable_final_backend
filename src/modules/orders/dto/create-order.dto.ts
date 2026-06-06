import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {

  @IsString()
  checkoutId: string;

  @IsString()
  cartId: string;

  @IsString()
  addressId: string;

  @IsString()
  paymentId: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsArray()
  selectedServiceIds?: string[];
}