export class Session {
  public token: Token;
  public user: String;
}

export interface Token {
  code: String;
  role: String;
}
