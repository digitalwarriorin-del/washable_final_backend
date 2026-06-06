import {
  IsMobilePhone,
  IsString,
  Length,
  IsOptional,
  IsEnum,
} from 'class-validator';

import {
  Role,
} from '../../../common/enums/role.enum';

export class VerifyOtpDto {

  @IsMobilePhone('en-IN')
  mobile!: string;

  @IsString()
  @Length(6, 6)
  otp!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}