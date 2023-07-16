import useCanister from "../hooks/useCanister";
import ICRC1CanisterMetadata from "../components/ICRC1CanisterMetadata";
import AccountOverview from "../components/AccountOverview";
import Spinner from "../components/Spinner";

const Home = () => {
  const { createdCount, accountAddress, currentBalanceBaseUnits, canisterMetadata } = useCanister();

  if (!canisterMetadata) {
    return <Spinner />
  };

  return (
    <div className="scrollable">
      <AccountOverview  
        createdCount={createdCount} 
        accountAddress={accountAddress} 
        currentBalanceBaseUnits={currentBalanceBaseUnits} 
        metadata={canisterMetadata} 
      />
      <div className="m-l:h-3 h-2 sm:h-4 lg:h-6 xl:h-8"></div>
      <ICRC1CanisterMetadata metadata={canisterMetadata} />
    </div>
  );
};

export default Home;