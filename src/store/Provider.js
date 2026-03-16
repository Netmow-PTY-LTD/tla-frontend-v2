'use client';
import { Provider } from 'react-redux';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      {/* ✅ PersistGate prevents rendering until Redux-Persist has rehydrated from localStorage.
          Without this, token is null for a brief moment on load → middleware redirects to /login */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
