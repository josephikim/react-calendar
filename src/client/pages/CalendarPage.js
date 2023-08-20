import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';
import { Row, Col } from 'react-bootstrap';
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
      dispatch(getUserEvents());
      shouldInitData.current = false;
    }
  }, []);

  // app state
  const calendars = useSelector((state) => state.calendars.byId);
  const calendarIds = useSelector((state) => state.calendars.allIds);
  const rbcSelection = useSelector((state) => state.app.rbcSelection);

  // derived state
  const isRbcSelectionSet = rbcSelection.slot || rbcSelection.event;
  const isDefaultCalLoaded = _.some(calendars, ['userDefault', true]);
  const defaultCalendarId = calendarIds.find((id) => calendars[id].userDefault === true);

  const renderJsx = () => {
    if (isRbcSelectionSet && isDefaultCalLoaded) {
      return (
        <Row>
          <Col xs={12} lg={2}>
            <CalendarToggleMenu calendars={calendars} />
          </Col>
          <Col xs={12} lg={7}>
            <RbcWrapper calendars={calendars} rbcSelection={rbcSelection} />
          </Col>
          <Col xs={12} lg={3}>
            <CalendarEventForm
              calendars={calendars}
              calendarIds={calendarIds}
              defaultCalendarId={defaultCalendarId}
              rbcSelection={rbcSelection}
            />
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
