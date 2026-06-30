export const withTimeout = <T>(promise: Promise<T>, ms = 15000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Database operation timed out after ${ms}ms`)), ms)
    ),
  ]);
};
