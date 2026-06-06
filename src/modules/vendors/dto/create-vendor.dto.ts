import {
  IsString,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateVendorDto {

  @IsString()
  userId!: string;

  @IsString()
  ownerName!: string;

  @IsString()
  shopName!: string;

  @IsString()
  mobile!: string;

  @IsString()
  shopAddress!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsBoolean()
  isActive!: boolean;
}