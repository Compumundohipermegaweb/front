import { Payment } from "../add-payment-method/add-payment-method.component";

export interface Sale {
    invoiceType: String;
    client: Client;
    salesmanCode: String;
    branchCode: String;
    details: Item[];
    payment: Payment[];
    total: number;
    discount: Discount;
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

export interface Discount {
    id: number;
    percentage: number;
    amount: number;
    saleId: number;
}
