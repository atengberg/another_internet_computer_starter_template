import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum();

const random = (min, max) => (Math.random() * (max - min)) + min;
const randomInt = (min, max) => Math.floor(random(min, max));

const randomLengthAddress = () => {
  const r = Math.random();
  if (r > 0.75) {
    return "k2t6j-2nvnp-4zjm3-25dtz-6xhaa-c7boj-5gayf-oj3xs-i43lp-teztq-6ae";
  } else if (r > .50) {
    return "k2t6j-2nvnp-4zjm3-25dtz-6xhaa-c7boj-5gayf-oj3xs-i43lp-teztq-6ae-dfxgiyy.1"
  } else if (r > .25) {
    return "k2t6j-2nvnp-4zjm3-25dtz-6xhaa-c7boj-5gayf-oj3xs-i43lp-teztq-6ae-dfxgiyy.123456789";
  } else {
    return "k2t6j-2nvnp-4zjm3-25dtz-6xhaa-c7boj-5gayf-oj3xs-i43lp-teztq-6ae-dfxgiyy.102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20";
  }
}



const randomDate = () => {
  const start = new Date(2021, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


const getRandomStatus = (createTime) => {
  if (Math.random() > .25) {
    const confirmedTime = new Date(createTime);
    confirmedTime.setSeconds(Math.floor(Math.random() * 30) + 2);
    return { 
      isComplete: true,
      confirmationTime: confirmedTime.getTime()
    }
  } else {
    return {
      isComplete: false,
      retryCount: Math.floor((Math.random() * 10) + 1) 
    }
  }
}

const getARandomAmount = (includeDecimal = true) => {

  const r = Math.random();
  if (r > .95) {
    return 23.3;
  } else if (r > .9) {
    return 93;
  } else if (r > .85) {
    return 100.1;
  } else if (r > .8) {
    return 1000.1; 
  } else if (r > .75) {
    return 0.00001;
  } else if (r > .7) {
    return 744422.2;
  } else if (r > .5) {
    return 101.4552;
  } else if (r > .4) {
    return 92.22225 
  } else if (r > .3) {
    return 99933.2 
  } else if (r > .2) {
    return 882.0002
  } else {
    return 28945.38;
  }
}

const getMockPayments = (count = Math.floor(Math.random() * 20)) => {
  const mockPayments = [];
  for (let i = 0; i < count; ++i) {

    const lotsOfWords = Math.random() > .5;


    const createTime = randomDate();
    mockPayments[i] = {
      id: `${i}`,
      creationTimestampMs: createTime.getTime(),
      recipientAddress: randomLengthAddress(),
      tokenSymbol: "icp",
      amount: `${getARandomAmount()}`,
      description: Math.random() < .5 ? undefined : lorem.generateWords(randomInt(lotsOfWords ? randomInt(8,14) : 1, 20)),
      status: getRandomStatus(createTime)
    }
  }
  return mockPayments;
}

export default getMockPayments;