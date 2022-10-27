export class CustomError extends Error {
  code: number;

  constructor(props) {
    super(props);
  }

  public static new(message: string, code: number = -1) {
    const error = new CustomError(message);
    error.code = code;
    return error;
  }

  public static noAuthority(message?: string) {
    const error = new CustomError(message || "没有操作权限");
    error.code = 403;
    return error;
  }

  public static notImplemented() {
    const error = new CustomError("功能暂未实现");
    error.code = 501;
    return error;
  }
}
