export const RATE_LIMIT_KEY = 'vylab_ai_rate_limit';
export const MAX_AI_CALLS_PER_DAY = 5;

export interface RateLimitData {
  date: string; // YYYY-MM-DD
  count: number;
}

export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getRateLimitData(): RateLimitData {
  try {
    const data = localStorage.getItem(RATE_LIMIT_KEY);
    const todayStr = getTodayString();
    
    if (data) {
      const parsed = JSON.parse(data) as RateLimitData;
      // If the date matches today, return the saved data
      if (parsed.date === todayStr) {
        return parsed;
      }
    }
    
    // If no data or date mismatch (new day), reset count
    return { date: todayStr, count: 0 };
  } catch (e) {
    // Fallback in case of JSON parse error or localStorage not available
    return { date: getTodayString(), count: 0 };
  }
}

export function saveRateLimitData(data: RateLimitData): void {
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save AI rate limit data to localStorage', e);
  }
}

/**
 * Checks if the user is allowed to make an AI call.
 */
export function canUseAI(): boolean {
  const data = getRateLimitData();
  return data.count < MAX_AI_CALLS_PER_DAY;
}

/**
 * Increments the AI usage count for today.
 */
export function incrementAIUsage(): void {
  const data = getRateLimitData();
  data.count += 1;
  saveRateLimitData(data);
}

/**
 * Gets the number of AI requests remaining for today.
 */
export function getRemainingAIUsage(): number {
  const data = getRateLimitData();
  return Math.max(0, MAX_AI_CALLS_PER_DAY - data.count);
}
