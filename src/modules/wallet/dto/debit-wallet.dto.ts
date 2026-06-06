import {
  IsNumber,
  IsString,
} from 'class-validator';

export class DebitWalletDto {

  @IsString()
  userId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  note!: string;
}