import { createConfigStore, ConfigStore } from 'stores/configStore';
import { useRef, createContext, useContext } from 'react';
import { useStore } from 'zustand';

import type { FC, ReactNode } from 'react';

export type ConfigStoreApi = ReturnType<typeof createConfigStore>;

export const ConfigStoreContext = createContext<ConfigStoreApi | undefined>(
  undefined,
);

export const ConfigProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const configStoreRef = useRef<ConfigStoreApi>();

  if (!configStoreRef.current) {
    configStoreRef.current = createConfigStore();
  }

  return (
    <ConfigStoreContext.Provider value={configStoreRef.current}>
      {children}
    </ConfigStoreContext.Provider>
  );
};

export const useConfigStore = <T,>(selector: (store: ConfigStore) => T): T => {
  const configStoreContext = useContext(ConfigStoreContext);

  if (!configStoreContext) {
    throw new Error(`useConfigStore must be used within ConfigStoreContext`);
  }

  return useStore(configStoreContext, selector);
};
