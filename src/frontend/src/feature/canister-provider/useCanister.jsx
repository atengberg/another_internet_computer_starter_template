import { useContext } from 'react';
import { canisterContextBinding } from './CanisterProvider/';

const useCanister = () => useContext(canisterContextBinding);

export default useCanister;
