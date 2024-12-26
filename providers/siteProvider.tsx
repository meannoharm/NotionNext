import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type SiteStore, createSiteStore } from '../stores/siteStore';

export type SiteStoreApi = ReturnType<typeof createSiteStore>;

export const SiteStoreContext = createContext<SiteStoreApi | undefined>(
  undefined,
);

export interface SiteStoreProviderProps {
  children: ReactNode;
}

export const SiteStoreProvider = ({ children }: SiteStoreProviderProps) => {
  const storeRef = useRef<SiteStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createSiteStore();
  }

  return (
    <SiteStoreContext.Provider value={storeRef.current}>
      {children}
    </SiteStoreContext.Provider>
  );
};
export const useSiteStore = <T,>(selector: (store: SiteStore) => T): T => {
  const siteStoreContext = useContext(SiteStoreContext);

  if (!siteStoreContext) {
    throw new Error(`useSiteStore must be used within SiteStoreContext`);
  }

  return useStore(siteStoreContext, selector);
};
