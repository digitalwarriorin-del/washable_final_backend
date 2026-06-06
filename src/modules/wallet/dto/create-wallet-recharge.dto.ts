import {
  IsNumber,
} from 'class-validator';

export class CreateWalletRechargeDto {

  @IsNumber()
  amount!: number;
}