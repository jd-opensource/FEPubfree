declare var USE_V_CONSOLE: boolean;
declare var SERVER_URL: string;
declare var DOMAIN_SUFFIX: string;

console.log("--- loading global constants ---");
console.log(`SERVER_URL: ${SERVER_URL}`);
console.log(`USE_V_CONSOLE: ${USE_V_CONSOLE}`);
console.log(`DOMAIN_SUFFIX: ${DOMAIN_SUFFIX}`);

export const DefineProperty = {
  UseVConsole: USE_V_CONSOLE,
  ServerUrl: SERVER_URL,
  DomainSuffix: DOMAIN_SUFFIX,
};
