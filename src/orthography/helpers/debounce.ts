interface DebounceCallback {
  apply: (ctx: any, args: any) => void;
}

const debounce = (callback: DebounceCallback, timeout: number): any => {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.apply(this, args);
    }, timeout);
  };
};

export default debounce;
