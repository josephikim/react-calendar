import React, { useRef, useState, useEffect } from 'react';
import { format, isValid, parse } from 'date-fns';
import FocusTrap from 'focus-trap-react';
import { DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';
import styles from 'client/styles/DatePickerDialog.module.css';

const DatePickerDialog = ({ inputId, date, isDisabled, dateFormat, onDateSelect }) => {
  const popperRef = useRef(null);
  const buttonRef = useRef(null);

  // stores Date objects
  const [inputValue, setInputValue] = useState(date);

  // stores booleans
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  // stores focus trap container ref
  const [popperElement, setPopperElement] = useState(null);

  // Hook to update input value based on prop change
  useEffect(() => {
    setInputValue(date);
  }, [date]);

  // Initialize popper
  const popper = usePopper(popperRef.current, popperElement, {
    placement: 'top-start',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8]
        }
      }
    ]
  });

  const closePopper = () => {
    setIsPopperOpen(false);
    buttonRef?.current?.focus();
  };

  const handleInputChange = (e) => {
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, dateFormat, new Date());

    if (isValid(date)) {
      updateEventFormDates(date);
    }
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const handleSelect = (selected) => {
    if (selected instanceof Date && !isNaN(selected)) {
      setInputValue(selected);

      selected.setHours(date.getHours(), date.getMinutes());
      // function passed through props from parent
      onDateSelect(inputId, selected);

      closePopper();
    }
  };

  return (
    <div>
      <div className={styles.inputContainer} ref={popperRef}>
        <input
          id={inputId}
          type="text"
          disabled={isDisabled}
          placeholder={format(new Date(), dateFormat)}
          value={format(inputValue, dateFormat)}
          onChange={handleInputChange}
          className={`${styles.input} input-reset`}
          onClick={handleButtonClick}
        />
        <button
          ref={buttonRef}
          type="button"
          disabled={isDisabled}
          className={`${styles.button} bg-white ba`}
          aria-label="Pick a date"
          onClick={handleButtonClick}
        >
          <span className={styles.calendarIcon} role="img" aria-label="calendar icon">
            📅
          </span>
        </button>
      </div>

      {isPopperOpen && (
        <FocusTrap
          active
          focusTrapOptions={{
            fallbackFocus: buttonRef.current,
            clickOutsideDeactivates: (e) => {
              closePopper();
              return true;
            },
            returnFocusOnDeactivate: true
          }}
        >
          <div
            tabIndex={-1}
            style={popper.styles.popper}
            className={styles.dialogSheet}
            {...popper.attributes.popper}
            ref={setPopperElement}
            role="dialog"
            aria-label="DayPicker calendar"
          >
            <DayPicker
              initialFocus={isPopperOpen}
              mode="single"
              defaultMonth={inputValue}
              selected={inputValue}
              onSelect={handleSelect}
            />
          </div>
        </FocusTrap>
      )}
    </div>
  );
};

export default DatePickerDialog;
