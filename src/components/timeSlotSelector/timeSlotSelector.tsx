import { useState } from 'react';
import styles from './timeSlotSelector.module.css';
import classnames from 'classnames';

interface TimeSlotSelectorProps {
  schedulerRef: any;
  dateRange: { day: string; date: string; times: string[] }[];
}

const TimeSlotSelector = (props: TimeSlotSelectorProps) => {
  const { schedulerRef, dateRange } = props;

  //   const [dateTimes, setDateTimes] = useState([{}]);
  const [isColumnHovered, setIsColumnHovered] = useState(-1);

  return (
    <div className={styles.scheduler} ref={schedulerRef}>
      {dateRange.map((c, index) => {
        const { date, day } = c;

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
              <div
                className={classnames(styles.hours, {
                  // [styles.hrsDisabled]: 'disabled',
                })}
              >
                9:00
              </div>

              {isColumnHovered === index && (
                <div className={classnames(styles.hours, styles.addTime)}>
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
