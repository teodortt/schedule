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
): DateRangeProps[] => {
  const timesList = days
    .filter((day) => day.times.length > 0)
    .map((day) => ({ times: day.times, original: true }));

  const result: DateRangeProps[] = Array.from({ length: period }, (_, i) => {
    const currentDate = addDays(days[0].date, i);
    const currentDay = new Date(currentDate).getDay();
    const timesIndex = i % timesList.length;
    const { times, original } = timesList[timesIndex];

    return {
      day: dayNames[currentDay],
      times,
      date: currentDate,
      original: i < timesList.length ? original : false,
      replicationCycle: Math.floor(i / timesList.length),
    };
  });

  return result;
};

const addDays = (date: string, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toLocaleDateString('en-ca').replace(/-/g, '.');
};
