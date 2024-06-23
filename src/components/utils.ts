import { DateRangeProps } from './types';

export const getDatesAndDays = (
  dateRange: number,
  startDate: string
): DateRangeProps[] =>
  Array.from({ length: dateRange }, (_, i) => i + 1).map((_, index) => {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + index);

    const date = currentDate.toLocaleDateString('en-ca').replace(/-/g, '.');

    return { date, day: dayNames[currentDate.getDay()], times: [] };
  });

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const replicateDaysWithTimes = (
  days: DateRangeProps[],
  period: number
) => {
  const daysWithTimes = days.filter((day) => day.times.length > 0);
  const result = [];

  for (let i = 0; i < period; i++) {
    const currentDayOfWeek = i % 7;
    const dayOfWeek = dayNames[currentDayOfWeek];
    const dayWithTimes = daysWithTimes.find((day) => day.day === dayOfWeek) || {
      day: dayOfWeek,
      times: [],
    };
    result.push({ ...dayWithTimes, date: addDays(days[0].date, i) });
  }

  return result;
};

const addDays = (date: string, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split('T')[0];
};
