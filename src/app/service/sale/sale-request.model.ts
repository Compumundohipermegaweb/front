export interface SaleRequest {
    invoice_type: String;
    client: ClientRequest;
    salesman_id: String;
    branch_id: String;
    sale_details: SaleDetailsRequest;
    category: String
  }
  
  export interface ClientRequest {
    id: number,
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
    discount: DiscountRequest;
  }
  
  export interface ItemRequest {
    id: number;
    description: String;
    quantity: number;
    unit_price: number;
  }
  
  export interface PaymentRequest {
    type: String;
    sub_total: number;
  }

  export interface DiscountRequest {
    percentage: number;
    amount: number;
  }