
import { LoremIpsum } from "lorem-ipsum";
import chalk from 'chalk';
const lorem = new LoremIpsum();

import {
  actorEd25,
  getRandomActor,
  actorSec256
} from "./identity.js";

import {
  statusEnum, stateKeys, actionTypes, icrc1MDTypes, pagesEnum,
} from "./utils.js"

import {
  flip,
  randomNat,
  nsToJsDate,
  toBaseUnits,
  fromBaseUnits,
  convertExponetialIntoStringWithAllPlaceholderZeros,
  containsDecimalPoint,
  parseAccountBalanceResponse,
  parseTokenCanisterMetadataResponse,
  parseAccountPaymentsResponse,
  parsePayment,
  parseStatus,
  getStatusColor,
  prepareSendPaymentArgs,
  getStatusMessage,
  getDisplayDateStrings,
  isNonTrivialString,
  clientCreatePayment
} from "./utils.js";

function logS(...args) { 
  args.forEach(arg => {
    console.log(arg);
  })
};

async function balances() {
  const edr = await actorEd25.get_account_balance();
  console.log(`ed balance ${JSON.stringify(edr)}`)
  console.log(`ed parsed balance ${parseAccountBalanceResponse(JSON.stringify(edr))}`)
  const secr = await actorSec256.get_account_balance();
  console.log(`sec balance ${JSON.stringify(secr)}`)
  console.log(`sec parsed balance ${parseAccountBalanceResponse(JSON.stringify(secr))}`)
}

//console.log(chalk.blue("balances first call:"));
//await balances();

async function addresses() {
  const { accountAddress: ed25Address } = await actorEd25.get_account_address();
  const { accountAddress: sec256Address } = await actorSec256.get_account_address();
  return {
    ed25Address,
    sec256Address
  }
}

const {
  ed25Address, sec256Address
} = await addresses();


const decimals = 8n;
const createdCount = 0n;
const accountAddress = ed25Address;

const inputs = {
  amountInput: "1.0",
  descriptionInput: "",
  recipientAddressInput: sec256Address
}

const {
  payment: clientPayment,
  args
} = prepareSendPaymentArgs({
  inputs,
  decimals,
  accountAddress,
  createdCount
})


const res = await actorEd25.send_payment(args);


console.log(chalk.red("clientPaymentclientPaymentclientPayment ================================================================================="))


/*
let res = await actorEd25.get_account_payments();

console.log(res.payments[0])


res = parseAccountPaymentsResponse(res);
console.log(chalk.blue("initial get payments call".toUpperCase()) + "\n");
console.log(res)

const {
  ed25Address, sec256Address
} = await addresses();

const inputs = {
  amountInput: 100000,
  descriptionInput: "",
  recipientAddressInput: sec256Address
}


const {
  payment: clientPayment,
  args
} = prepareSendPaymentArgs({
  inputs,
  decimals,
  sourceAddress,
  createdCount
})

console.log(chalk.blue("client made payment".toUpperCase()) + "\n");
console.log(clientPayment)
console.log("\n" + chalk.green("send payment args".toUpperCase()) + "\n");

res = await actorEd25.send_payment(args);
console.log("\n" + chalk.yellow("raw send payment response".toUpperCase()) + "\n");
console.log(res.payment.status.Completed)

*/



//makePayments(sec256Address);
//sendPayment(actorEd25, 1, sec256Address, "this is a failed payment due to value");
//sendPayment(actorEd25, 10000000, "gibberish", "this is a failed payment due to invalid address");

//console.log(parseAccountPaymentsCallResponse(response));
/*

const response = await actorEd25.get_account_payments();


function parseAccountPaymentsCallResponse(response) {
  const { timestampNs, payments: ps, createdCount } = response;
  return {
    ok: {
      timestamp: nsToJsDate(timestampNs),
      payments: ps.map(p => parsePayment(p)),
      createdCount
    }
  }
};

// acount balance
    atTimeNs : Time.Time;
    accountAddress : ICRC1Address;
    currentBalance : Nat;


// payments
    atTimeNs : Time.Time;
    payments : [Payment];
    createdCount : Nat;


// send payment
    clientPaymentId : Text;
    description : ?Text;
    amount : Nat;
    recipientAddress : Text;

        #Pending;
    #Completed : { confirmedAt : Time.Time };
    #Failed : { failedAt : Time.Time; kind : PaymentError };
  };

  public type PaymentError = {
    #InvalidRecipientAddress;
    #ICRC1TokenCanisterTransferErr : ICRC1.TransferError;
    #InterCanisterCallCaughtError : Text;
  };

  public type Payment = {
    createdAtNs : Time.Time;
    amount : Nat;
    description : ?Text;
    // Could be canister generated UUID or ULID; but currently just number concatenated with clientPaymentId:
    id : Text;
    // Naive id or payment creation count for this user, displayed to the user:
    number : Nat;
    // In more developed version, would serve as payment's idempotent key for reliable processing:
    clientPaymentId : Text;
    // In (future) case where a single user's account can have multiple
    // subaccounts, store the specific address funds are sourced from:
    sourceAddress : ICRC1Address;
    recipientAddress : ICRC1Address;
    status : PaymentStatus;


    const invalid = await actorEd25.get("invalid_address");
console.log(`invalid\n\n ${JSON.stringify(invalid)}\n\n`)
console.log(parseStatus(invalid));



const caught_error = await actorEd25.get("caught_error");
console.log(`caught_error\n\n ${JSON.stringify(caught_error)}\n\n`)
console.log(parseStatus(caught_error));




const transfer_error = await actorEd25.get("transfer_error");
console.log(`transfer_error \n\n${JSON.stringify(transfer_error)}\n\n`)
console.log(parseStatus(transfer_error));







const makePayments = (recipientAddress) => {
  const amounts = [
    100001,
    100002,
    100003,
    100004,
    0.0005,
  ]
  amounts.forEach(amount => {
    const description = flip() ? lorem.generateWords(randomNat(3, 8)) : null;
    sendPayment(actorEd25, amount, recipientAddress, description);
  })
}







const a = await getRandomActor();


const inputs = {
  amountInput: 10000000000,
  descriptionInput: "",
  recipientAddressInput: sec256Address
}

const decimals = 8;
const createdCount = 0;
const sourceAddress = ed25Address;

const {
  payment: clientPayment,
  args
} = prepareSendPaymentArgs({
  inputs,
  decimals,
  sourceAddress,
  createdCount
})






async function sendPayment(actor, amount, recipientAddress, description) {
  const decimals = 8;

  const args = prepareSendPaymentArgs({
    amount,
    description,
    recipientAddress,
    decimals
  })

  let response = await actor.send_payment(args)
  response = parseSendPaymentResponse(response);
  console.log(res)
  console.log(response);
}


let res = await actorEd25.get_account_payments();
res = parseAccountPaymentsResponse(res);
console.log(res)
const { ok: { payments } } = res;

const p = payments[1];

console.log(p.status)




*/











/*

const { account_address: ed25_account_address } = await actorEd25.get_account_address();
const { account_address: sec256_account_address }  = await actorSec256.get_account_address();
logS({ed25_account_address, sec256_account_address});

let ed25_balance = await actorEd25.get_account_balance();
let sec256_balance = await actorSec256.get_account_balance();
logS("balance", ed25_balance, sec256_balance);

let paymentResult = await actorEd25.send_payment({ recipientAddress: sec256_account_address, amount: 10000, description: [], clientPaymentId: "first-1" })
logS("\n\t\tPAYMENTRESULT", paymentResult);

ed25_balance = await actorEd25.get_account_balance();
sec256_balance = await actorSec256.get_account_balance();
logS("balance after", ed25_balance, sec256_balance);
*/


//await addresses();

//console.log(paymentResult)


