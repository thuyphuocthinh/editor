export const debounce = (func, delay) => {
  let timeoutId;
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    func();
  }, delay);
};

export const throttle = (func, limit) => {
  let inThrottle;
  if (!inThrottle) {
    func();
    inThrottle = true;
    setTimeout(() => (inThrottle = false), limit);
  }
};
