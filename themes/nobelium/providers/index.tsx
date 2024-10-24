import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';

import { type NobeliumStore, createNobeliumStore } from '../stores';

export type NobeliumStoreApi = ReturnType<typeof createNobeliumStore>;

export const NobeliumStoreContext = createContext<NobeliumStoreApi | undefined>(
  undefined,
);

export interface NobeliumStoreProviderProps {
  children: ReactNode;
}

export const NobeliumStoreProvider = ({
  children,
}: NobeliumStoreProviderProps) => {
  const storeRef = useRef<NobeliumStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createNobeliumStore();
  }

  return (
    <NobeliumStoreContext.Provider value={storeRef.current}>
      {children}
    </NobeliumStoreContext.Provider>
  );
};

export const useNobeliumStore = <T,>(
  selector: (store: NobeliumStore) => T,
): T => {
  const nobeliumStoreContext = useContext(NobeliumStoreContext);

  if (!nobeliumStoreContext) {
    throw new Error(
      `useNobeliumStore must be used within NobeliumStoreProvider`,
    );
  }

  return useStore(nobeliumStoreContext, selector);
};
