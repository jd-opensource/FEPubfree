export const reqHostname = (host: string): string => {
  const offset = host[0] === "[" ? host.indexOf("]") + 1 : 0;
  const index = host.indexOf(":", offset);
  return index !== -1 ? host.substring(0, index) : host;
};
