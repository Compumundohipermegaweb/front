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
    firstName: String;
    lastName: String;
    document: String;
}

export interface Item {
    id: String;
    sku: number;
    description: String;
    quantity: number;
    price: number;
}

export interface Payment {
    method: String;
    amount: number;
}