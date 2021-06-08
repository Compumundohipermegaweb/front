export class User {
  public id: number;
  public name: string;
  public surname: string;
  public email: string;
  public username: string;
  public password?: string;
}

export enum Role {
  VENDEDOR = "VENDEDOR", 
  CAJERO = "CAJERO", 
  SUPERVISOR = "SUPERVISOR", 
  GERENTE = "GERENTE", 
  ADMIN = "ADMIN"
}
