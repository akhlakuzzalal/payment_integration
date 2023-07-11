/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';
export class PaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
  @IsNotEmpty()
  @IsNumber()
  mobileNumber: number;
}
