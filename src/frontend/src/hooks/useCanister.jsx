import { useContext } from 'react';
import { CanisterContext } from '../components/CanisterProvider';

const useCanister = () => useContext(CanisterContext);

export default useCanister;