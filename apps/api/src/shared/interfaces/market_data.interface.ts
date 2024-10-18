export interface IMarketData<F extends string, T extends string> {
  rates: {
    [key in F]: {
      prices: {
        [key in T]: number;
      };
      diff_24h: {
        [key in T]: string;
      };
      diff_7d: {
        [key in T]: string;
      };
      diff_30d: {
        [key in T]: string;
      };
    };
  };
}
