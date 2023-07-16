import ckbtc from "../../assets/ckbtc.svg";

const copy = {
  title: 'ICRC1 Payment Demo',
  description: 'A 100% on-chain mobile oriented payment client dapp built on the Internet Computer Protocol with React, Tailwind and Motoko to demonstrate how customers at a point of sale could easily make payments using the ICRC1 token standard.',
  shortDescription: 'Fully on-chain decentralized interoperability bringing the power of BTC to a store near you.',
}

const Landing = () => {
 
  return (
    <section className="scrollable">
      <div className="flex h-full w-full flex-col gap-2">
        <div className="flex-1"></div>
        <div className="mb-2 text-center"><span className="landing-title text-shadow-inset-xs">{copy.title}</span></div>
        <div className="mt-2 hidden text-center sm:block sm:px-[10%]">
          <span className="landing-description  text-shadow-inset-xs">{copy.description}</span>
        </div>
        <div className="flex-1"></div>
        <div className="my-4 flex flex-col items-center justify-center sm:flex-row">
          <a target="_blank" rel="noreferrer" 
              className="w-[30%]" 
              href="https://internetcomputer.org/docs/current/developer-docs/integrations/bitcoin/ckbtc" 
              title="Visit the ckBTC developer docs at the Dfinity homepage (opens in a new window)"
              aria-label="Visit the ckBTC developer docs at the Dfinity homepage (opens in a new window)."
              >
              <img src={ckbtc} className="m-s:w-[10rem] m-s:h-[10rem] m-xl:w-[14rem] m-xl:h-[14rem] h-24 w-24 md:h-[18rem] md:w-[18rem]" />
          </a>
          <div className="m-s:h-16 sm:hidden"></div>
          <span className="landing-short-description text-shadow-inset">{copy.shortDescription}</span>
        </div>
        <div className="flex-[3] sm:flex-[2]"></div>
      </div> 
    </section>
  )
};

export default Landing;
