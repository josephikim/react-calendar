import {combineReducers} from 'redux';

import {configReducer} from './configReducer';
import {calendarReducer} from './calendarReducer';

const appReducer = combineReducers({
    config: configReducer,
    calendar: calendarReducer
});

export default appReducer;