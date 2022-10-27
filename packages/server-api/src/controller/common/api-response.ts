export class ApiResponse<T> {
  private data: T;
  private code: number;
  private message: string;

  constructor(code?: number, message?: string, data?: T) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  static newInstance<T>(code = 200, message?: string, data?: T) {
    return new ApiResponse<T>(code, message, data);
  }

  public setData(data: T): ApiResponse<T> {
    this.data = data;
    return this;
  }
}
