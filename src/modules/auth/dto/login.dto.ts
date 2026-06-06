import {
  IsMobilePhone,
  IsOptional,
  IsEnum,
} from 'class-validator';

import {
  Role,
} from '../../../common/enums/role.enum';

export class LoginDto {

  @IsMobilePhone('en-IN')
  mobile!: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}