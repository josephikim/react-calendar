import {combineReducers} from 'redux';

import {configReducer} from './configReducer';
import {eventReducer} from './eventReducer';

const appReducer = combineReducers({
    configReducer,
    eventReducer
});

export default appReducer;