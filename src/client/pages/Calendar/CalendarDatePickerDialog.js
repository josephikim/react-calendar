import React, { useRef, useState, useEffect } from 'react';
import { format, isValid, parse } from 'date-fns';
import FocusTrap from 'focus-trap-react';
import { DayPicker } from 'react-day-picker';
import { usePopper } from 'react-popper';
import './CalendarDatePickerDialog.css';

const CalendarDatePickerDialog = (props) => {
  const [inputValue, setInputValue] = useState(props.value);
  const [isPopperOpen, setIsPopperOpen] = useState(false);

  const popperRef = useRef(null);
  const buttonRef = useRef(null);
  const [popperElement, setPopperElement] = useState(null);

  // Update state based on props update
  useEffect(() => {
    setInputValue(props.value);
  }, [props.value]);

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

  const setSelections = (date) => {
    if (props.inputId === 'startDate') {
      props.setStart(date);

      // update end date if start date is after end date
      if (date.valueOf() >= props.end.valueOf()) {
        props.setEnd(date);
      }
    }

    if (props.inputId === 'endDate') {
      props.setEnd(date);

      // update start date if end date is before start date
      if (date.valueOf() <= props.start.valueOf()) {
        props.setStart(date);
      }
    }

    return;
  };

  const handleInputChange = (e) => {
    setInputValue(e.currentTarget.value);
    const date = parse(e.currentTarget.value, props.dateFormat, new Date());
    if (isValid(date)) {
      setSelections(date);
    } else {
      setSelections(undefined);
    }
  };

  const handleButtonClick = () => {
    setIsPopperOpen(true);
  };

  const handleDaySelect = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setInputValue(date);
      setSelections(date);
      closePopper();
    }
  };

  return (
    <div className="CalendarDatePickerDialog">
      <div ref={popperRef}>
        <input
          id={props.inputId}
          type="text"
          placeholder={format(new Date(), props.dateFormat)}
          value={format(inputValue, props.dateFormat)}
          onChange={handleInputChange}
          className="input-reset"
          onClick={handleButtonClick}
        />
        <button
          ref={buttonRef}
          type="button"
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
