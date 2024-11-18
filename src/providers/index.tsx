import React, {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from 'react';
import { useStore } from 'zustand';

import { type GlobalStore, createGlobalStore } from '../stores';

export type GlobalStoreApi = ReturnType<typeof createGlobalStore>;

export const GlobalStoreContext = createContext<GlobalStoreApi | undefined>(
  undefined,
);

export interface GlobalStoreProviderProps {
  children: ReactNode;
}

export const GlobalStoreProvider = ({ children }: GlobalStoreProviderProps) => {
  const storeRef = useRef<GlobalStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createGlobalStore();
  }

  return (
    <GlobalStoreContext.Provider value={storeRef.current}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

export const useGlobalStore = <T,>(selector: (store: GlobalStore) => T): T => {
  const globalStoreContext = useContext(GlobalStoreContext);

  if (!globalStoreContext) {
    throw new Error(`useGlobalStore must be used within GlobalStoreProvider`);
  }

  return useStore(globalStoreContext, selector);
};

export const ContextWrapper = <P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> => {
  const WrappedComponent: React.FC<P> = (props) => (
    <GlobalStoreProvider>
      <Component {...props} />
    </GlobalStoreProvider>
  );

  return WrappedComponent;
};
