export interface Response<T> {
  succeeded: boolean;
  message: string;
  errors: string;
  data: T;
}

export interface RegisterResponse {
  status: string;
  message: string;
}

export interface LoginResponse {
  token: string;
  expirationDate: Date;
}

export class ImageSnippet {
  constructor(public src: string, public file: File) {}
}
