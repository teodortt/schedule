import { ChangeEvent, useState } from 'react';
import styles from './schedule.module.css';

const Schedule = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dateRange, setDateRange] = useState<number>(0);

  const range = dateRange > 1 ? 'days' : 'day';

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
      setDateRange(diffDays);
    } else {
      setDateRange(0);
    }
  };

  const handleOpenPicker = (event: ChangeEvent<any>) => {
    event.target.showPicker();
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>Create new Schedule</div>
      <div className={styles.startEndDates}>
        <div className={styles.datePicker}>
          <div className={styles.label}>Start-Date</div>
          <input
            type='date'
            value={startDate}
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
          />
        </div>

        {dateRange !== 0 && (
          <div className={styles.range}>{`${dateRange} ${range}`}</div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
