export type GOOGLE_AUTH_KEYS =
  | 'redirect_uri'
  | 'client_id'
  | 'access_type'
  | 'response_type'
  | 'prompt'
  | 'scope'
  | 'state';

export type GOOGLE_TOKEN_KEYS =
  | 'code'
  | 'client_id'
  | 'client_secret'
  | 'redirect_uri'
  | 'grant_type';

export type GOOGLE_USER_INFO_KEYS = 'alt' | 'access_token';

export interface GOOGLE_RESPONSE_TOKEN {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  id_token: string;
}

export interface GOOGLE_RESPONSE_USER_INFO {
  id: string;
  email: string;
  verified_email: boolean;
  given_name: string;
  name: string;
  family_name: string;
  picture: string;
}
