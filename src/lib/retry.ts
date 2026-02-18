/**
 * 지수 백오프를 적용한 재시도 유틸리티
 */

interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

/**
 * 지정된 시간만큼 대기
 */
const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 지수 백오프 딜레이 계산
 */
const getExponentialDelay = (
  attempt: number,
  baseDelay: number,
  maxDelay: number
): number => {
  const delay = baseDelay * Math.pow(2, attempt);
  return Math.min(delay, maxDelay);
};

/**
 * 함수를 지수 백오프로 재시도
 * @param fn 실행할 함수
 * @param options 재시도 옵션
 * @returns 함수 실행 결과
 * @throws 모든 재시도 실패 시 마지막 에러
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  const { maxRetries, baseDelayMs, maxDelayMs } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < maxRetries) {
        const delay = getExponentialDelay(attempt, baseDelayMs, maxDelayMs);
        console.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} failed. Retrying in ${delay}ms...`
        );
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

/**
 * 재시도 가능한 함수 래퍼 생성
 */
export function createRetryable<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options?: RetryOptions
): (...args: T) => Promise<R> {
  return (...args: T) => withRetry(() => fn(...args), options);
}
