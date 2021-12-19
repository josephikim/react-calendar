import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { loadState, saveState } from "./localStorage";
import throttle from "lodash/throttle";
import appReducer from "../reducers";

const middleware = [thunk];

// Set initial calendar slot
let start = new Date();
let end = new Date();
start.setHours(start.getHours() + 1, 0, 0, 0);
end.setHours(end.getHours() + 2, 0, 0, 0);

const initialSlot = {
  action: "click",
  start: start.toISOString(),
  end: end.toISOString(),
};

// Set initial state
const initialState = {
  auth: {
    accessToken: "",
    refreshToken: "",
    id: "",
    username: "",
  },
  user: {
    events: [],
    selectedSlot: initialSlot,
    selectedEvent: {},
    calendars: [],
  },
};

const doCreateStore = () => {
  const persistedState = loadState();

  if (persistedState) {
    persistedState.user.selectedSlot = initialState.user.selectedSlot;
    persistedState.user.selectedEvent = initialState.user.selectedEvent;
  }

  const composeEnhancers = composeWithDevTools({});

  const store = createStore(
    appReducer,
    persistedState ? persistedState : initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );

  store.subscribe(
    throttle(() => {
      saveState(store.getState());
    }, 1000)
  );

  return store;
};

export default doCreateStore();
