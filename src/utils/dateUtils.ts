// Market holidays for 2024 (NYSE)
const MARKET_HOLIDAYS_2024 = [
  '2024-01-01', // New Year's Day
  '2024-01-15', // Martin Luther King Jr. Day
  '2024-02-19', // Presidents Day
  '2024-03-29', // Good Friday
  '2024-05-27', // Memorial Day
  '2024-06-19', // Juneteenth
  '2024-07-04', // Independence Day
  '2024-09-02', // Labor Day
  '2024-11-28', // Thanksgiving Day
  '2024-12-25', // Christmas Day
];

// Market holidays for 2025 (NYSE)
const MARKET_HOLIDAYS_2025 = [
  '2025-01-01', // New Year's Day
  '2025-01-20', // Martin Luther King Jr. Day
  '2025-02-17', // Presidents Day
  '2025-04-18', // Good Friday
  '2025-05-26', // Memorial Day
  '2025-06-19', // Juneteenth
  '2025-07-04', // Independence Day
  '2025-09-01', // Labor Day
  '2025-11-27', // Thanksgiving Day
  '2025-12-25', // Christmas Day
];

const MARKET_HOLIDAYS = [...MARKET_HOLIDAYS_2024, ...MARKET_HOLIDAYS_2025];

// Check if a date is a market holiday
export function isMarketHoliday(date: Date): boolean {
  const dateStr = date.toISOString().split('T')[0];
  return MARKET_HOLIDAYS.includes(dateStr);
}

// Check if a date is a weekend
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
}

// Get the next business day (skipping weekends and holidays)
export function getNextBusinessDay(date: Date): Date {
  const nextDay = new Date(date);
  nextDay.setDate(nextDay.getDate() + 1);
  
  while (isWeekend(nextDay) || isMarketHoliday(nextDay)) {
    nextDay.setDate(nextDay.getDate() + 1);
  }
  
  return nextDay;
}

// Get the previous business day (skipping weekends and holidays)
export function getPreviousBusinessDay(date: Date): Date {
  const prevDay = new Date(date);
  prevDay.setDate(prevDay.getDate() - 1);
  
  while (isWeekend(prevDay) || isMarketHoliday(prevDay)) {
    prevDay.setDate(prevDay.getDate() - 1);
  }
  
  return prevDay;
}

// Adjust a date to the nearest business day
export function adjustToBusinessDay(date: Date): Date {
  if (isWeekend(date) || isMarketHoliday(date)) {
    return getNextBusinessDay(date);
  }
  return date;
}

// Format date in user's timezone
export function formatDateInTimezone(date: Date, timezone: string = 'America/New_York'): string {
  return new Date(date).toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// Convert date to NYSE timezone (America/New_York)
export function toNYSETimezone(date: Date): Date {
  const nyDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return new Date(nyDate.getTime() + nyDate.getTimezoneOffset() * 60000);
}

// Add months to a date, adjusting for business days
export function addMonthsWithBusinessDayAdjustment(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return adjustToBusinessDay(newDate);
}

// Get the ex-dividend date (typically 1-2 business days before the payment date)
export function getExDividendDate(paymentDate: Date): Date {
  const exDate = new Date(paymentDate);
  exDate.setDate(exDate.getDate() - 2); // Start with 2 days before
  return adjustToBusinessDay(exDate);
} 