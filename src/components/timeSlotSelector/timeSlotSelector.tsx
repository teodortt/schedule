import { useState } from 'react';
import styles from './timeSlotSelector.module.css';
import classnames from 'classnames';

interface TimeSlotSelectorProps {
  schedulerRef: any;
  dateRange: number;
  startDate: string;
}

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const TimeSlotSelector = (props: TimeSlotSelectorProps) => {
  const { schedulerRef, dateRange, startDate } = props;
  const [isColumnHovered, setIsColumnHovered] = useState(-1);

  return (
    <div className={styles.scheduler} ref={schedulerRef}>
      {Array.from({ length: dateRange }, (_, i) => i + 1).map((c, index) => {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + index);

        const day = currentDate.toLocaleDateString('en-ca').replace(/-/g, '.');

        const onColumnHover = () => {
          setIsColumnHovered(index);
        };
        const onColumnHoverOut = () => {
          setIsColumnHovered(-1);
        };

        return (
          <div className={styles.column} key={c}>
            <div className={styles.day}>
              <div className={styles.dTitle}>
                {dayNames[currentDate.getDay()]}
              </div>
              <div>{day}</div>
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
