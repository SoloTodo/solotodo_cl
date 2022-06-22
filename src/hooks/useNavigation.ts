import { useContext } from 'react';
import { NavigationContext } from 'src/contexts/NavigationContext';

// ----------------------------------------------------------------------

const useNavigation = () => useContext(NavigationContext);

export default useNavigation;
