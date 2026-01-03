// services/payment.service.ts - UPDATED
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval, switchMap, takeWhile } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UpiPaymentRequest {
  orderNumber: string; 
  transactionId: string;
  amount: number;
  upiId?: string;
  customerPhone?: string;
  orderDetails?: any;
}

export interface AutoVerifyRequest {
  orderNumber: string;
  amount: number;
  upiId?: string;
  customerPhone?: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  isPaid: boolean;
  payment?: any;
  orderStatus?: string;
  message?: string;
}

export interface AutoVerifyResponse {
  success: boolean;
  isPaid: boolean;
  message: string;
  data?: {
    orderId: number;
    orderNumber: string;
    transactionId: string;
    status: string;
    paymentDate: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiBaseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auto-verify payment without transaction ID
  autoVerifyPayment(request: AutoVerifyRequest): Observable<AutoVerifyResponse> {
    return this.http.post<AutoVerifyResponse>(
      `${this.apiBaseUrl}/payments/auto-verify`,
      request
    );
  }

  // Check payment status
  checkPaymentStatus(orderNumber: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(
      `${this.apiBaseUrl}/payments/check-payment/${orderNumber}`
    );
  }

  // Start auto verification polling
  startAutoVerification(orderNumber: string, amount: number, customerPhone?: string) {
    const request: AutoVerifyRequest = {
      orderNumber,
      amount,
      upiId: environment.restaurantUPI,
      customerPhone
    };

    // Poll every 10 seconds for 5 minutes (30 attempts)
    return interval(10000).pipe(
      switchMap(() => this.autoVerifyPayment(request)),
      takeWhile(response => !response.isPaid, true), // Stop when paid
      takeWhile((_, index) => index < 30, true) // Max 30 attempts (5 minutes)
    );
  }

  // Original process payment (keep for manual entry)
  processUpiPayment(paymentRequest: UpiPaymentRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiBaseUrl}/payments/upi`,
      paymentRequest
    );
  }

  // Generate QR code
  generateUpiQrCode(orderId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiBaseUrl}/payments/upi-qr/${orderId}`
    );
  }

  // Check WhatsApp service status
  checkWhatsAppStatus(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiBaseUrl}/admin/whatsapp/queue-status`
    );
  }

  // Send test WhatsApp message
  sendTestWhatsApp(phone: string, message: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiBaseUrl}/admin/whatsapp/send-test`,
      { phone, message }
    );
  }
}