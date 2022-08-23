import { createContext, ReactNode, useState } from "react";

export type NavigationItemProps = {
  name: string;
  path: string;
  picture: string | null;
  subtitle: string | null;
};

export type NavigationProps = {
  name: string;
  sections: {
    name: string;
    path: string;
    items: NavigationItemProps[];
  }[];
};

type NavigationProviderProps = {
  children: ReactNode;
  initialNavigation: NavigationProps[];
};

const NavigationContext = createContext([] as NavigationProps[]);

function NavigationProvider({
  children,
  initialNavigation = [],
}: NavigationProviderProps) {
  const [navigation, _setNavigation] = useState(initialNavigation);
  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
}

export { NavigationProvider, NavigationContext };
