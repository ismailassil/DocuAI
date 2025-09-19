export interface JWT_PAYLOAD {
  sub: number;
  username: string;
}

export interface EXTRACTED_JWT_PAYLOAD {
  sub: number;
  username: string;
  exp: number;
  iat: number;
}
