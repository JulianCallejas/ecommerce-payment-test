import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { catchError, firstValueFrom } from 'rxjs';
import { Transaction } from 'src/core/entities/transaction.entity';

import { WompiGatewayServicePort } from 'src/core/ports/services/wompi-gateway.service.port';
import {
  //   CreatePaymentSourceParams,
  //   PaymentSourceResponse,
  CreateTransactionParams,
  CreateTransactionResponse,
  GetTransactionStatusResponse,
  TokenizeCardParams,
  TokenizeCardResponse
} from 'src/core/ports/services/wompi-gateway.types';

@Injectable()
export class WompiGatewayService implements WompiGatewayServicePort {
  private readonly apiBaseUrl: string;
  private readonly apiKeyPublic: string;
  private readonly apiKeySecret: string;
  private readonly integrityKey: string;
  private readonly logger = new Logger("Wompi-Service");

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiBaseUrl =
      this.configService.get<string>('WOMPI_URL') ||
      'https://api-sandbox.co.uat.wompi.dev/v1';
    this.apiKeyPublic =
      this.configService.get<string>('WOMPI_PUBLIC_KEY') || 'test_api_key';
    this.apiKeySecret =
      this.configService.get<string>('WOMPI_PRIVATE_KEY') || 'test_api_key';
    this.integrityKey =
      this.configService.get<string>('WOMPI_INTEGRITY_KEY') ||
      'test_integrity_key';
  }

  async tokenizeCard(
    tokenizeCardParams: TokenizeCardParams
  ): Promise<TokenizeCardResponse> {
    const body = {
      number: tokenizeCardParams.number,
      cvc: tokenizeCardParams.cvc,
      exp_month: tokenizeCardParams.expMonth,
      exp_year: tokenizeCardParams.expYear,
      card_holder: tokenizeCardParams.cardHolder
    };
    const headers = {
      Authorization: `Bearer ${this.apiKeyPublic}`,
      'Content-Type': 'application/json'
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.apiBaseUrl}/tokens/cards`, body, { headers })
          .pipe(
            catchError((error) => {
              this.logger.error(`[Card-Token] - ${error.response.data.error.messages}`);
              throw `Payment rejected ${error.response}`;
            })
          )
      );
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async createTransaction(
    createTransactionParams: CreateTransactionParams
  ): Promise<CreateTransactionResponse> {
    const { customerData, shippingAddress } = createTransactionParams;
    const body = {
      acceptance_token: createTransactionParams.acceptanceToken,
      amount_in_cents: createTransactionParams.amountInCents,
      currency: createTransactionParams.currency,
      signature: createTransactionParams.signature,
      customer_email: createTransactionParams.customerEmail,
      payment_method: {
        type: 'CARD',
        token: createTransactionParams.token,
        installments: createTransactionParams.installments
      },
      //   payment_source_id: createTransactionParams.paymentSourceId,
      reference: createTransactionParams.reference,
      expiration_time: createTransactionParams.expiresAt,
      customer_data: {
        phone_number: shippingAddress.phoneNumber,
        full_name: customerData.fullname,
        legal_id: customerData.customerId.slice(2),
        legal_id_type: customerData.customerId.slice(0, 2)
      },
      shipping_address: {
        address_line_1: shippingAddress.addressLine1,
        address_line_2: shippingAddress.addressLine2.trim() || "0000",
        country: 'CO',
        region: shippingAddress.region,
        city: shippingAddress.city,
        name: shippingAddress.contactName || customerData.fullname || "",
        phone_number: shippingAddress.phoneNumber,
        postal_code: shippingAddress.postalCode || "000000"
      }
    };
    const headers = {
      Authorization: `Bearer ${this.apiKeySecret}`,
      'Content-Type': 'application/json'
    };
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post(`${this.apiBaseUrl}/transactions`, body, { headers })
          .pipe(
            catchError((error) => {
              this.logger.error(`[Create-Transaction] - ${error.response.data.error.messages}`);
              throw `Payment rejected ${error.response}`;
            })
          )
      );
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTransactionStatus(
    transaction: Transaction
  ): Promise<GetTransactionStatusResponse> {
    const headers = {
      'Content-Type': 'application/json'
    };
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get(`${this.apiBaseUrl}/transactions/${transaction.externalId}`, {
            headers
          })
          .pipe(
            catchError((error) => {
              this.logger.error(`[Get-Transaction] - ${error.response.data.error.messages}`);
              throw `Transaction not found ${error.response}`;
            })
          )
      );
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  generateSignature(
    transactionId: string,
    amountInCents: number,
    currency: string,
    expiresAt: Date
  ): string {
    const signatureData = `${transactionId}${amountInCents}${currency}${expiresAt.toISOString()}${this.integrityKey}`;
    return crypto.createHash('sha256').update(signatureData).digest('hex');
  }
}



//   async createPaymentSource(
  //     createPaymentSourceParams: CreatePaymentSourceParams
  //   ): Promise<PaymentSourceResponse> {
  //     const body = {
  //       type: 'CARD',
  //       token: createPaymentSourceParams.token,
  //       customer_email: createPaymentSourceParams.customerEmail,
  //       acceptance_token: createPaymentSourceParams.acceptanceToken,
  //       accept_personal_auth: createPaymentSourceParams.acceptPersonalAuth
  //     };
  //     const headers = {
  //       Authorization: `Bearer ${this.apiKeySecret}`,
  //       'Content-Type': 'application/json'
  //     };

  //     try {
  //       const { data } = await firstValueFrom(
  //         this.httpService
  //           .post(`${this.apiBaseUrl}/payment_sources`, body, { headers })
  //           .pipe(
  //             catchError((error) => {
  //               throw `Payment rejected ${error.response}`;
  //             })
  //           )
  //       );

  //       return data;
  //     } catch (error) {
  //       throw new Error(error);
  //     }
  //   }
