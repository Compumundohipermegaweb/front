export interface SaleResponse {
    id: number;
    billingDate: String;
    type: String;
    client: ClientResponse;
    branchAddress: String;
    branchContact: String;
    cuit: String;
    activitySince: String;
    saleDetails: SaleDetailsResponse;
    subTotal: number;
    ivaSubTotal: number;
    total: number;
  }
  
  export interface ClientResponse {
    document_number: String;
    first_name: String;
    last_name: String;
    sur_name: String;
    category: String;
    email: String;
    contact_number: String;
  }
  
  export interface SaleDetailsResponse {
    sale_details: ItemResponse[];
  }
  
  export interface ItemResponse {
    id: String;
    desscription: String;
    quantity: number;
    unit_price: number;
  }