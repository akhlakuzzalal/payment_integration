import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { PaymentDto } from './dto/payment.dto';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() body: PaymentDto) {
    try {
      return this.paymentService.initiate(body);
    } catch (e) {
      throw new HttpException('Something went wrong', 500);
    }
  }
}
