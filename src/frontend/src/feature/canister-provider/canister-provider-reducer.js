import { actionTypes } from "../../utils/enums";

const initReducerState = {
  initialized: { 
    canisterMetadata: false, 
    accountStateSync: false,
  },
  canisterMetadata: null,
  accountAddress: null,
  currentBalanceBaseUnits: null,
  createdCount: null,
  payments: null,
};

const reducer = (state, { type, key, payload }) => {
  console.log(`CanisterProvider reducer dispatch called with ${JSON.stringify({ type, payload, key})}`);
  switch (type) {
    case actionTypes.INITIALIZED: {
      const { initialized } = state;
      initialized[key] = payload;
      return {
        ...state,
        initialized
      };
    }
    case actionTypes.VALUE: {
      return {
        ...state,
        ...payload
      };
    }
    case actionTypes.UPDATE: {
      const { payment } = payload;
      let { payments = [] } = state;
      if (payload?.fromClient) {
        payments.unshift(payment);
      } else {
        payments = payments.map(p => (payment.clientPaymentId === p.clientPaymentId) ? payment : p);
      }
      return {
        ...state,
        payments
      };
    }
    case actionTypes.ERROR: {
      // Todo 
      return {
        ...state,
      };
    }
    case actionTypes.RESET: {
      return initReducerState;
    }
    default:
      throw new Error(`CanisterProvider's reducer was dispatched an event with no action type!`);
  }
};

export default reducer;
export { initReducerState };