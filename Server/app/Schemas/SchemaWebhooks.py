from __future__ import annotations
from typing import Any, Optional
from pydantic import BaseModel


class Discount(BaseModel):
    value: int
    limitDate: Any
    dueDateLimitDays: int
    type: str


class Fine(BaseModel):
    value: int
    type: str


class Interest(BaseModel):
    value: int
    type: str


class Payment(BaseModel):
    object: str
    id: str
    dateCreated: str
    customer: str
    paymentLink: Any
    value: int
    netValue: float
    originalValue: Any
    interestValue: Any
    description: str
    billingType: str
    confirmedDate: str
    pixTransaction: str
    pixQrCodeId: str
    status: str
    dueDate: str
    originalDueDate: str
    paymentDate: str
    clientPaymentDate: str
    installmentNumber: Any
    invoiceUrl: str
    invoiceNumber: str
    externalReference: Any
    deleted: bool
    anticipated: bool
    anticipable: bool
    creditDate: str
    estimatedCreditDate: str
    transactionReceiptUrl: str
    nossoNumero: Any
    bankSlipUrl: Any
    lastInvoiceViewedDate: Any
    lastBankSlipViewedDate: Any
    discount: Discount
    fine: Fine
    interest: Interest
    postalService: bool
    custody: Any
    refunds: Any


class PaymentEvent(BaseModel):
    event: str
    payment: Payment