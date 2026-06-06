import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAddressDto {

  @IsString()
  label!: string;

  @IsString()
  fullName!: string;

  @IsString()
  mobile!: string;

  @IsString()
  addressLine1!: string;

  @IsString()
  addressLine2!: string;

  @IsString()
  city!: string;

  @IsString()
  state!: string;

  @IsString()
  pincode!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}