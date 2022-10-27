import { ApiResponse } from "./api-response";

export class WebUtil {
  static result<T>(data: T) {
    return ApiResponse.newInstance<T>(200).setData(data);
  }

  static success() {
    return ApiResponse.newInstance<any>(200, "success");
  }

  static warning(code: number, message: string) {
    return ApiResponse.newInstance<any>(code, message);
  }

  static error(message?: string) {
    return ApiResponse.newInstance<any>(-1, message || "Internal Server Error");
  }

  static userNoLogin() {
    return ApiResponse.newInstance<any>(401, "Unauthorized");
  }

  static userNoAuthority() {
    return ApiResponse.newInstance<any>(403, "Unauthorized");
  }

  static notImplemented() {
    return this.warning(-1, "NotImplemented");
  }
}
