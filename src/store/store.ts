import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import apiResourceObjectsSlice from 'src/frontend-utils/redux/api_resources/apiResources';
import userSlice from 'src/frontend-utils/redux/user';

// THE store VARIABLE EXISTS ONLY TO DETERMINE THE RootState and AppDispatch
// TYPES BELOW IF YOU WANT TO EDIT THE configureStore OF THE APP YOU
// ALSO NEED TO EDIT THE initializeStore FUNCTION IN THE END
const store = configureStore({
    reducer: {
        user: userSlice.reducer,
        apiResourceObjects: apiResourceObjectsSlice.reducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const initializeStore = (preloadedState?: RootState) => {
    return configureStore({
        reducer: {
            user: userSlice.reducer,
            apiResourceObjects: apiResourceObjectsSlice.reducer
        },
        preloadedState: preloadedState
    })
}

const makeStore = () =>
    configureStore({
        reducer: {
            user: userSlice.reducer,
            apiResourceObjects: apiResourceObjectsSlice.reducer
        },
        devTools: true,
    });

export type AppStore = ReturnType<typeof makeStore>;

export const wrapper = createWrapper<AppStore>(makeStore);

const { dispatch } =  store;

export { store, dispatch }
