import { useEffect, useState } from 'react';
import styles from './timeSlotSelector.module.css';
import classnames from 'classnames';
import Delete from '../../assets/delete.svg?react';

interface TimeSlotSelectorProps {
  schedulerRef: any;
  dateRange: { day: string; date: string; times: string[] }[];
}

const TimeSlotSelector = (props: TimeSlotSelectorProps) => {
  const { schedulerRef, dateRange } = props;

  const [dateTimes, setDateTimes] = useState(dateRange);
  const [isColumnHovered, setIsColumnHovered] = useState(-1);

  useEffect(() => {
    setDateTimes(dateRange);
    console.log('UPDATED');
  }, [dateRange]);

  const possibleTimes = ['9:00', '12:00', '16:00', '20:00'];

  return (
    <div className={styles.scheduler} ref={schedulerRef}>
      {dateTimes.map((c, index) => {
        const { date, day, times } = c;

        const handleAddTime = () => {
          if (times.length < 4) {
            const newTime = possibleTimes[times.length];
            const updated = dateTimes.map((d) => {
              if (d.date === date) {
                return { ...d, times: [...times, newTime] };
              }
              return d;
            });
            setDateTimes(updated);
          }
        };

        const handleRemoveTime = (timeToRemove: string) => {
          const updated = dateTimes.map((d) => {
            if (d.date === date) {
              return {
                ...d,
                times: times.filter((time) => time !== timeToRemove),
              };
            }
            return d;
          });
          setDateTimes(updated);
        };

        const onColumnHover = () => {
          setIsColumnHovered(index);
        };
        const onColumnHoverOut = () => {
          setIsColumnHovered(-1);
        };

        return (
          <div className={styles.column} key={date}>
            <div className={styles.day}>
              <div className={styles.dTitle}>{day}</div>
              <div>{date}</div>
            </div>
            <div
              className={styles.hoursContainer}
              onMouseEnter={onColumnHover}
              onMouseLeave={onColumnHoverOut}
            >
              {times.map((time) => {
                return (
                  <div
                    className={classnames(styles.hours, {
                      // [styles.hrsDisabled]: 'disabled',
                    })}
                  >
                    {time}
                    <Delete
                      onClick={() => handleRemoveTime(time)}
                      className={styles.deleteBtn}
                    />
                  </div>
                );
              })}

              {times.length < 4 && isColumnHovered === index && (
                <div
                  onClick={handleAddTime}
                  className={classnames(styles.hours, styles.addTime)}
                >
                  Add Time
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlotSelector;
