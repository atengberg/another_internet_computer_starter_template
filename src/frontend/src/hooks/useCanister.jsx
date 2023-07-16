import { useContext } from 'react';
import { useCanisterCanisterBinding } from '../components/CanisterProvider';

const useCanister = () => useContext(useCanisterCanisterBinding);

export default useCanister;
