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
