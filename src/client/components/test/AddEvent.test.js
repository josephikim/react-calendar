import React from 'react'
import Enzyme, { shallow, mount, render } from 'enzyme'
import AddEvent from '../AddEvent'

describe('<AddEvent />', () => {
  test('renders a single <form> tag', () => {
    const wrapper = shallow(<AddEvent />);
    expect(wrapper.find('form')).toHaveLength(1);
  });
})