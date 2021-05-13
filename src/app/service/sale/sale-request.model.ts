export interface SaleRequest {
    invoice_type: String;
    client: ClientRequest;
    salesman_id: String;
    branch_id: String;
    sale_details: SaleDetailsRequest;
  }
  
  export interface ClientRequest {
    document_number: String;
    first_name: String;
    last_name: String;
    state: String;
    category: String;
    email: String;
    contact_number: String;
  }
  
  export interface SaleDetailsRequest {
    details: ItemRequest[];
    payments: PaymentRequest[];
  }
  
  export interface ItemRequest {
    id: String;
    description: String;
    quantity: number;
    unit_price: number;
  }
  
  export interface PaymentRequest {
    type: String;
    sub_total: number;
  }