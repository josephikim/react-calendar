import React, { useRef, useState, useEffect } from 'react';
import { format, isValid, parse } from 'date-fns';
import FocusTrap from 'focus-trap-react';
import { DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';
import './CalendarDatePickerDialog.css';

const CalendarDatePickerDialog = (props) => {
  const { isDisabled, value } = props;
  const popperRef = useRef(null);
  const buttonRef = useRef(null);

  // stores Date objects
  const [inputValue, setInputValue] = useState(props.value);

  // stores booleans
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  // stores focus trap container ref
  const [popperElement, setPopperElement] = useState(null);

  // Hook to update input value based on prop change
  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

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

  // Updates CalendarEventForm start/end dates (date portion only)
  const updateEventFormDates = (date) => {
    date.setHours(value.getHours(), value.getMinutes());

    if (props.inputId === 'startDate') {
      props.setStart(date);
    }

    if (props.inputId === 'endDate') {
      props.setEnd(date);
    }

    return;
  };

  const handleInputChange = (e) => {
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, props.dateFormat, new Date());

    if (isValid(date)) {
      updateEventFormDates(date);
    }
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const handleDaySelect = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setInputValue(date);
      updateEventFormDates(date);
      closePopper();
    }
  };

  return (
    <div className="CalendarDatePickerDialog">
      <div className="inputContainer" ref={popperRef}>
        <input
          id={props.inputId}
          type="text"
          disabled={isDisabled}
          placeholder={format(new Date(), props.dateFormat)}
          value={format(inputValue, props.dateFormat)}
          onChange={handleInputChange}
          className="input-reset"
          onClick={handleButtonClick}
        />
        <button
          ref={buttonRef}
          type="button"
          disabled={isDisabled}
          className="pa2 bg-white button-reset ba"
          aria-label="Pick a date"
          onClick={handleButtonClick}
        >
          <span role="img" aria-label="calendar icon">
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
            className="dialog-sheet"
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
              onSelect={handleDaySelect}
            />
          </div>
        </FocusTrap>
      )}
    </div>
  );
};

export default CalendarDatePickerDialog;
