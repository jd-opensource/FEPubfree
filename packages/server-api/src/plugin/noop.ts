export const noop = (noopInstance: string) =>
  new Proxy(
    {},
    {
      get: function (obj, prop) {
        console.log(`Noop function: ${noopInstance}.${String(prop)}`);
        return () => null;
      },
    }
  );
