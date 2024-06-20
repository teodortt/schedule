import { ChangeEvent, useRef, useState } from 'react';
import styles from './schedule.module.css';
import Arrow from '../../assets/arrow.svg?react';
import classnames from 'classnames';
import TimeSlotSelector from '../timeSlotSelector/timeSlotSelector';
import { getDatesAndDays } from '../utils';

const today = new Date().toLocaleDateString('en-CA');

const Schedule = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dateRange, setDateRange] = useState<number>(0);
  const schedulerRef = useRef<any>();

  const range = dateRange > 1 ? 'days' : 'day';

  const disabledActions = !startDate || !endDate;

  const handleDateChange = (
    e: ChangeEvent<HTMLInputElement>,
    isEndDate?: boolean
  ) => {
    const date = new Date(e.target.value).toLocaleDateString('en-CA');
    if (isEndDate) {
      setEndDate(date);
      calculateRange(startDate, date);
    } else {
      setStartDate(date);
      calculateRange(date, endDate);
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
              [styles.disabled]: 'isFirst',
            })}
          />
          <Arrow
            onMouseDown={() => handleScroll(1212)}
            className={classnames(styles.arrowRight, {
              [styles.disabled]: 'isLast',
            })}
          />
        </div>
      </div>

      {dateRange !== 0 && (
        <TimeSlotSelector
          dateRange={getDatesAndDays(dateRange, startDate)}
          schedulerRef={schedulerRef}
        />
      )}

      <div className={styles.actionButtons}>
        <button className={styles.reset} disabled={disabledActions}>
          Reset
        </button>
        <button className={styles.autocomplete} disabled={disabledActions}>
          Autocomplete
        </button>
        <button className={styles.upload} disabled={disabledActions}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default Schedule;
