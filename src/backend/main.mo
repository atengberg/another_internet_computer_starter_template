actor {
  var pingCount : Nat = 0;

  public func ping() : async Nat {
    pingCount += 1;
    pingCount;
  };

  public query func getPingCount() : async Nat { pingCount };
};
