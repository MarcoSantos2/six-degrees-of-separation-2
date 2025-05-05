// Rate limiting logic
const REQUESTS_PER_SECOND = 3;
let requestsThisSecond = 0;
let lastRequestTime = Date.now();

export const rateLimitRequest = async <T>(requestFn: () => Promise<T>): Promise<T> => {
  const now = Date.now();
  if (now - lastRequestTime > 1000) {
    // Reset if more than a second has passed
    requestsThisSecond = 0;
    lastRequestTime = now;
  }

  if (requestsThisSecond >= REQUESTS_PER_SECOND) {
    const delay = 1000 - (now - lastRequestTime);
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    requestsThisSecond = 0;
    lastRequestTime = Date.now();
  }

  requestsThisSecond++;
  return requestFn();
}; 