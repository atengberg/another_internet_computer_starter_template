import { useContext } from 'react';
import { useCanisterBinding } from '../components/CanisterProvider';

const useCanister = () => useContext(useCanisterBinding);
export default useCanister;