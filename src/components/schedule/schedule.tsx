import { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './schedule.module.css';
import Arrow from '../../assets/arrow.svg?react';
import classnames from 'classnames';
import TimeSlotSelector from '../timeSlotSelector/timeSlotSelector';
import {
  getDatesAndDays,
  isIncrementing,
  replicateDaysWithTimes,
} from '../utils';
import { DateRangeProps } from '../types';

const today = new Date().toLocaleDateString('en-CA');

const Schedule = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dateRange, setDateRange] = useState<number>(0);
  const [dateTimes, setDateTimes] = useState<DateRangeProps[]>([]);
  const schedulerRef = useRef<any>();
  const [areDuplicated, setAreDuplicated] = useState(false);
  const [templateShown, setTemplateShown] = useState(false);

  const areAllIncrementing = dateTimes.every((t) => isIncrementing(t.times));

  const range = dateRange > 1 ? 'days' : 'day';
  const disabledAutoComplete =
    dateTimes.every((t) => !t.times.length) || areDuplicated;
  const disabledUpload =
    dateTimes.length === 0 ||
    dateTimes.some((t) => !t.times.length) ||
    !areAllIncrementing;

  const visualizedSlots = templateShown
    ? replicateDaysWithTimes(dateTimes, dateRange)
    : dateTimes;

  useEffect(() => {
    const rangeArr = getDatesAndDays(dateRange, startDate);
    const withExistingTimes = rangeArr.map((d) => {
      const matchingDate = dateTimes.find((dt) => dt.date === d.date);
      if (matchingDate && matchingDate.times.length > 0) {
        return { ...d, times: matchingDate.times };
      }
      return d;
    });

    setDateTimes(withExistingTimes);
  }, [startDate, endDate]);

  const handleDateChange = (
    e: ChangeEvent<HTMLInputElement>,
    isEndDate?: boolean
  ) => {
    const date = new Date(e.target.value);
    const dateStr = date.toLocaleDateString('en-CA');

    if (isEndDate) {
      setEndDate(dateStr);
      calculateRange(startDate, dateStr);
    } else {
      if (endDate) {
        const calcEndDate = date;
        calcEndDate.setDate(date.getDate() + (dateRange - 1));
        const endDateStr = calcEndDate.toLocaleDateString('en-CA');
        setStartDate(dateStr);
        setEndDate(endDateStr);
        calculateRange(dateStr, endDateStr);
      } else {
        setStartDate(dateStr);
        calculateRange(dateStr, endDate);
      }
    }
  };

  const calculateRange = (start: string, end: string) => {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();

    if (start && end) {
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDateRange(diffDays + 1);
    } else {
      setDateRange(0);
    }
  };

  const handleOpenPicker = (event: ChangeEvent<any>) => {
    event.target.showPicker();
  };

  const handleScroll = (scrollOffset: number) => {
    schedulerRef.current.scrollLeft += scrollOffset;
  };

  const handleReset = () => {
    const clearedDateTimes = dateTimes.map((d) => ({
      ...d,
      times: [],
      original: false,
    }));
    setDateTimes(clearedDateTimes);
    setAreDuplicated(false);
  };

  const handleCopyTemplate = () => {
    const replicatedDays = replicateDaysWithTimes(dateTimes, dateRange);

    setDateTimes(replicatedDays);
    setAreDuplicated(true);
    setTemplateShown(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Create new Schedule</div>
      <div className={styles.pickers}>
        <div className={styles.startEndDates}>
          <div className={styles.datePicker}>
            <div className={styles.label}>Start-Date</div>
            <input
              type='date'
              value={startDate}
              min={today}
              max={endDate}
              onClick={handleOpenPicker}
              onChange={(e) => handleDateChange(e)}
              className={styles.input}
            />
          </div>
          <div className={styles.datePicker}>
            <div className={styles.label}>End-Date</div>
            <input
              type='date'
              value={endDate}
              min={startDate}
              onClick={handleOpenPicker}
              onChange={(e) => handleDateChange(e, true)}
              className={styles.input}
              disabled={!startDate}
            />
          </div>

          {dateRange !== 0 && (
            <div className={styles.range}>{`${dateRange} ${range}`}</div>
          )}
        </div>
        <div className={styles.arrows}>
          <Arrow
            onMouseDown={() => handleScroll(-1212)}
            className={classnames(styles.arrowLeft, {
              [styles.disabled]: false,
            })}
          />
          <Arrow
            onMouseDown={() => handleScroll(1212)}
            className={classnames(styles.arrowRight, {
              [styles.disabled]: false,
            })}
          />
        </div>
      </div>

      {areDuplicated && !areAllIncrementing && (
        <div style={{ color: 'red' }}>Some time slots are not arranged!</div>
      )}

      <TimeSlotSelector
        dateTimes={visualizedSlots}
        setDateTimes={setDateTimes}
        schedulerRef={schedulerRef}
      />

      <div className={styles.actionButtons}>
        <button
          onClick={handleReset}
          className={styles.reset}
          disabled={dateTimes.every((d) => !d.times.length)}
        >
          Reset
        </button>
        <button
          onClick={handleCopyTemplate}
          onMouseEnter={() => setTemplateShown(true)}
          onMouseLeave={() => setTemplateShown(false)}
          className={styles.autocomplete}
          disabled={disabledAutoComplete}
        >
          Autocomplete
        </button>
        <button className={styles.upload} disabled={disabledUpload}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default Schedule;
