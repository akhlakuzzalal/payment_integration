import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CryptoJS = require('crypto-js');

@Injectable()
export class PaymentService {
  async initiate(body: { amount: number; mobileNumber: number }): Promise<any> {
    // body for phonepe
    const payBody = {
      merchantId: 'MERCHANTUAT',
      merchantTransactionId: 'MT7850590068188104',
      merchantUserId: 'MUID123',
      amount: body.amount,
      redirectUrl: process.env.REDIRECT_URL,
      redirectMode: 'POST',
      callbackUrl: process.env.CALLBACK_URL,
      mobileNumber: body.mobileNumber,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    try {
      const data = await this.callPhonePe(payBody);
      return data;
    } catch (e) {
      // exception handling
      const error = e?.response?.data;
      if (error) {
        throw new HttpException(error.message, error.status);
      } else {
        throw new HttpException(
          'Something went wrong',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  genarateXVarify(body: any): { xVarify: string; encodeBase64: string } {
    const encodeBase64 = Buffer.from(JSON.stringify(body)).toString('base64');
    const apiEndPoint = process.env.PHONEPE_API_ENDPOINT;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = 1;

    const hashString = `${encodeBase64}${apiEndPoint}${saltKey}`;

    // string to sha256 hashing
    const hash = CryptoJS.SHA256(hashString).toString(CryptoJS.enc.Hex);

    const final = `${hash}###${saltIndex}`;

    return { xVarify: final, encodeBase64 };
  }

  async callPhonePe(body: any): Promise<any> {
    const { xVarify, encodeBase64 } = this.genarateXVarify(body);
    const response = await axios.post(
      'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
      { request: encodeBase64 },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': xVarify,
        },
      },
    );

    const data = response.data;
    return data;
  }
}
