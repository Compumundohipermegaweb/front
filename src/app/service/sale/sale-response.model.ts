export interface SaleResponse {
    invoice_id: String;
    billing_date: String;
    type: String;
    client: ClientResponse;
    branch_address: String;
    branch_contact: String;
    cuit: String;
    activity_since: String;
    sale_details: SaleDetailsResponse;
    subtotal: number;
    iva_subtotal: number;
    total: number;
  }
  
  export interface ClientResponse {
    document_number: String;
    first_name: String;
    last_name: String;
    state: String;
    credit_limit: number;
    email: String;
    contact_number: String;
    id: number;
  }
  
  export interface SaleDetailsResponse {
    sale_details: ItemResponse[];
  }
  
  export interface ItemResponse {
    id: number;
    description: String;
    quantity: number;
    unit_price: number;
  }