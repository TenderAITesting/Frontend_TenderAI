import { createContext, useContext, useState, ReactNode } from 'react';

interface Ctx { slot: ReactNode; setSlot: (n: ReactNode) => void; }
const TopBarContext = createContext<Ctx>({ slot: null, setSlot: () => {} });

export function TopBarProvider({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<ReactNode>(null);
  return <TopBarContext.Provider value={{ slot, setSlot }}>{children}</TopBarContext.Provider>;
}

export function useTopBar() { return useContext(TopBarContext); }
