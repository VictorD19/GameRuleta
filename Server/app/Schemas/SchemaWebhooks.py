from typing import List, Optional
from pydantic import BaseModel

class CreditCard(BaseModel):
    creditCardNumber: str
    creditCardBrand: str
    creditCardToken: str

class Split(BaseModel):
    walletId: str
    fixedValue: Optional[int]
    percentualValue: Optional[int]
    status: str
    refusalReason: Optional[str]

class Discount(BaseModel):
    value: float
    dueDateLimitDays: int
    limitedDate: Optional[str]
    type: str

class Fine(BaseModel):
    value: float
    type: str

class Interest(BaseModel):
    value: float
    type: str

class Chargeback(BaseModel):
    status: str
    reason: str

class Refunds(BaseModel):
    # Define the structure for Refunds if needed
    pass

class Payment(BaseModel):
    object: str
    id: str
    dateCreated: str
    customer: str
    subscription: Optional[str]
    installment: Optional[str]
    paymentLink: str
    dueDate: str
    originalDueDate: str
    value: float
    netValue: float
    originalValue: Optional[float]
    interestValue: Optional[float]
    nossoNumero: Optional[str]
    description: str
    externalReference: str
    billingType: str
    status: str
    pixTransaction: Optional[dict]
    confirmedDate: str
    paymentDate: str
    clientPaymentDate: str
    installmentNumber: Optional[int]
    creditDate: str
    custody: Optional[dict]
    estimatedCreditDate: str
    invoiceUrl: str
    bankSlipUrl: Optional[str]
    transactionReceiptUrl: str
    invoiceNumber: str
    deleted: bool
    anticipated: bool
    anticipable: bool
    lastInvoiceViewedDate: str
    lastBankSlipViewedDate: Optional[str]
    postalService: bool
    creditCard: CreditCard
    discount: Discount
    fine: Fine
    interest: Interest
    split: List[Split]
    chargeback: Chargeback
    refunds: Optional[Refunds]

class EventPaymentReceived(BaseModel):
    event: str
    payment: Payment
