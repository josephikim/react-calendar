import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
import { initCalendar, deserializedRbcSelectionSelector } from 'client/store/appSlice';
import { getUserEvents } from 'client/store/eventsSlice';
import ContentWrapper from 'client/components/ContentWrapper';
import RbcWrapper from 'client/components/RbcWrapper';
import CalendarToggleMenu from 'client/components/CalendarToggleMenu';
import CalendarEventForm from 'client/components/CalendarEventForm';

const CalendarPage = () => {
  const dispatch = useDispatch();

  // check for init data
  const shouldInitData = useRef(true);

  useEffect(() => {
    if (shouldInitData.current) {
      dispatch(initCalendar());
      dispatch(getUserEvents());
      shouldInitData.current = false;
    }
  }, []);

  // app state
  const calendars = useSelector((state) => state.calendars.byId);
  const currentSelection = useSelector(deserializedRbcSelectionSelector);

  // derived state
  const isCurrentSelectionSet = currentSelection.slot || currentSelection.event;
  const isDefaultCalLoaded = _.some(calendars, ['userDefault', true]);

  const renderJsx = () => {
    if (isCurrentSelectionSet && isDefaultCalLoaded) {
      return (
        <Row>
          <Col xs={12} lg={2}>
            <CalendarToggleMenu calendars={calendars} />
          </Col>
          <Col xs={12} lg={7}>
            <RbcWrapper calendars={calendars} currentSelection={currentSelection} />
          </Col>
          <Col xs={12} lg={3}>
            <CalendarEventForm currentSelection={currentSelection} />
          </Col>
        </Row>
      );
    } else {
      return <h4>loading calendar...</h4>;
    }
  };

  return <ContentWrapper>{renderJsx()}</ContentWrapper>;
};

export default CalendarPage;
