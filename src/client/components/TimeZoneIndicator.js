import React from 'react';
import { useSelector } from 'react-redux';
import { Navbar } from 'react-bootstrap';

const TimeZoneIndicator = () => {
  const tz = useSelector((state) => state.app.timeZone);

  return <Navbar.Text> Current time zone: {tz}</Navbar.Text>;
};

export default TimeZoneIndicator;
