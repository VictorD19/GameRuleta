from typing import Optional
from pydantic import BaseModel

class Discount(BaseModel):
    value: float
    limitDate: Optional[str]
    dueDateLimitDays: int
    type: str

class Fine(BaseModel):
    value: float
    type: str

class Interest(BaseModel):
    value: float
    type: str

class Payment(BaseModel):
    object: str
    id: str
    dateCreated: str
    customer: str
    paymentLink: Optional[str]
    value: float
    netValue: float
    originalValue: Optional[float]
    interestValue: Optional[float]
    description: str
    billingType: str
    confirmedDate: str
    pixTransaction: Optional[str]
    pixQrCodeId: Optional[str]
    status: str
    dueDate: str
    originalDueDate: str
    paymentDate: str
    clientPaymentDate: str
    installmentNumber: Optional[int]
    invoiceUrl: str
    invoiceNumber: str
    externalReference: Optional[str]
    deleted: bool
    anticipated: bool
    anticipable: bool
    creditDate: str
    estimatedCreditDate: str
    transactionReceiptUrl: str
    nossoNumero: Optional[str]
    bankSlipUrl: Optional[str]
    lastInvoiceViewedDate: Optional[str]
    lastBankSlipViewedDate: Optional[str]
    discount: Discount
    fine: Fine
    interest: Interest
    postalService: bool
    custody: Optional[str]
    refunds: Optional[str]

class PaymentEvent(BaseModel):
    event: str
    payment: Payment