import { useState } from 'react';
import styles from './timeSlotSelector.module.css';
import classnames from 'classnames';
import Delete from '../../assets/delete.svg?react';
import { DateRangeProps } from '../types';

interface TimeSlotSelectorProps {
  schedulerRef: any;
  dateTimes: DateRangeProps[];
  setDateTimes: (range: DateRangeProps[]) => void;
}

const TimeSlotSelector = (props: TimeSlotSelectorProps) => {
  const { schedulerRef, dateTimes, setDateTimes } = props;

  const [isColumnHovered, setIsColumnHovered] = useState(-1);

  const possibleTimes = ['9:00', '12:00', '16:00', '20:00'];
  const isReplicated = dateTimes.some((d) => d.original);

  return (
    <div className={styles.scheduler} ref={schedulerRef}>
      {dateTimes.map((c, index) => {
        const { date, day, times, original, replicationCycle } = c;

        const isSameCycle =
          index > 0 &&
          !original &&
          dateTimes[index - 1].replicationCycle === replicationCycle;
        const isDisabled = isReplicated && !original;

        const handleAddTime = () => {
          if (times.length < 4) {
            const newTime =
              possibleTimes.find((time) => !times.includes(time)) || '';

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
                    key={time}
                    className={classnames(styles.hours, {
                      [styles.hrsDisabled]: isDisabled,
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
            {isReplicated && (
              <>
                {isDisabled ? (
                  <div className={styles.variant}>{!isSameCycle && 'Copy'}</div>
                ) : (
                  <div className={styles.variant}>{'Template'}</div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TimeSlotSelector;
