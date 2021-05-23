export interface Sale {
    invoiceType: String;
    client: Client;
    salesmanCode: String;
    branchCode: String;
    details: Item[];
    payment: Payment[];
    total: number;
}

export interface Client {
    id: number;
    firstName: String;
    lastName: String;
    document: String;
}

export interface Item {
    id: number;
    sku: number;
    description: String;
    quantity: number;
    price: number;
}

export interface Payment {
  method: PaymentMethod;
  amount: number;
  typeId?: number;
  typeName?: String;
  lastDigits?: number;
  email?: String;
}

export interface PaymentMethod {
  id: number;
  description: String;
  type: String;
}

export interface PaymentType
{
  id: number;
  name: String;
}