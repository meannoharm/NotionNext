import { createStyleStore, StyleStore } from '@/stores/styleStore';
import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';

export type StyleStoreApi = ReturnType<typeof createStyleStore>;

export const StyleStoreContext = createContext<StyleStoreApi | undefined>(
  undefined,
);

export const StyleProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StyleStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createStyleStore();
  }

  return (
    <StyleStoreContext.Provider value={storeRef.current}>
      {children}
    </StyleStoreContext.Provider>
  );
};

export const useStyleStore = <T,>(selector: (store: StyleStore) => T): T => {
  const styleStoreContext = useContext(StyleStoreContext);
  if (!styleStoreContext) {
    throw new Error(`useStyleStore must be used within StyleProvider`);
  }
  return useStore(styleStoreContext, selector);
};
