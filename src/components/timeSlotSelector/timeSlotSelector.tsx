import { useEffect, useState } from 'react';
import styles from './timeSlotSelector.module.css';
import classnames from 'classnames';

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

  return (
    <div className={styles.scheduler} ref={schedulerRef}>
      {dateTimes.map((c, index) => {
        const { date, day, times } = c;

        const handleAddTime = () => {
          const updated = dateTimes.map((d) => {
            if (d.date === date && times.length < 4) {
              return { ...d, times: [...times, ''] };
            }
            return d;
          });
          setDateTimes(updated);
        };

        const getRelatedTime = () => {
          switch (times.length) {
            case 0:
              return '9:00';
            case 1:
              return '12:00';
            case 2:
              return '16:00';
            case 3:
              return '20:00';
            default:
              return;
          }
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
              {Array.from({ length: times.length + 1 }, (_, i) => i + 1).map(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (_, index) => {
                  return (
                    <div
                      className={classnames(styles.hours, {
                        // [styles.hrsDisabled]: 'disabled',
                      })}
                    >
                      {getRelatedTime()}
                    </div>
                  );
                }
              )}

              {isColumnHovered === index && (
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
