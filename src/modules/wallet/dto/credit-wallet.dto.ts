import {
  IsNumber,
  IsString,
} from 'class-validator';

export class CreditWalletDto {

  @IsString()
  userId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  note!: string;
}