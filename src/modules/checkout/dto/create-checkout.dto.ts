import { IsString, IsArray } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  cartId!: string;

  @IsString()
  addressId!: string;

  @IsArray()
  selectedServiceIds!: string[];
}