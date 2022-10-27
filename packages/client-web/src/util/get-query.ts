import { isArray, isNil } from "lodash-es";

/**
 * 获取当前 query 中的参数
 * @param name 参数名
 * @param url 查询字符串，默认为当前页面路由
 */
export const getQuery = (name, url?) => {
  if (isNil(url)) {
    url = window.location.href;
  }

  url = decodeURIComponent(url);
  const reg = new RegExp(`(^|[&?])${name}=([^&#]*)`);
  const result = url.match(reg);

  if (isArray(result)) {
    return result[2];
  } else {
    return null;
  }
};
