'reach 0.1';

const Params = Object({
  ERC721addr: Contract,
  minBid: UInt,
  lenInBlocks: UInt,
  owner: Address,
  tokenId: UInt,
})

export const main = Reach.App(() => {
    const Creator = Participant('Creator', {
        params: Params,
        callApprove: Fun([Address], Null),
        auctionReady: Fun([], Null),
    });
    const Bidder = API('Bidder', {
        bid: Fun([UInt], Tuple(Address, UInt)),
    });
    const V = View({
      min: UInt,
      nft: Contract,
      currentBid: UInt,
    });
    const E = Events({
      seeBid: [Address, UInt],
      seeOutcome: [Address, UInt],
    });
    const myERC = {
      transferFrom: Fun([Address, Address, UInt256], Null),
      balanceOf: Fun([Address], UInt256),
    };
    init();

    Creator.only(() => {
        const {ERC721addr, minBid, lenInBlocks, owner, tokenId} = declassify(interact.params);
    });
    Creator.publish(ERC721addr, minBid, lenInBlocks, owner, tokenId);
    commit();
    Creator.interact.callApprove(getAddress());
    Creator.publish();
    const amt = 1;
    const ctcSol = remote(ERC721addr, myERC);
    const addr = getAddress();
    ctcSol.transferFrom(owner, addr, UInt256(tokenId));
    //assert(ctcSol.balanceOf(addr) == amt, "balance of NFT is wrong");
    V.min.set(minBid);
    V.nft.set(ERC721addr);
    Creator.interact.auctionReady();
    const end = lastConsensusTime() + lenInBlocks;
    const [
        highestBidder,
        lastPrice,
        isFirstBid,
    ] = parallelReduce([Creator, minBid, true])
        .define(() => {
          V.currentBid.set(lastPrice);
        })
        //.invariant(balance(nftId) == amt)
        .invariant(balance() == (isFirstBid ? 0 : lastPrice))
        .while(lastConsensusTime() <= end)
        .api_(Bidder.bid, (bid) => {
            check(bid > lastPrice, "bid is too low");
            return [ bid, (notify) => {
                const who = this;
                E.seeBid(who, bid);
                notify([highestBidder, lastPrice]);
                if ( ! isFirstBid ) {
                    transfer(lastPrice).to(highestBidder);
                }
                return [who, bid, false];
            }];
        })
    ctcSol.transferFrom(addr, highestBidder, UInt256(tokenId));
    E.seeOutcome(highestBidder, lastPrice);
    if ( ! isFirstBid ) { transfer(lastPrice).to(Creator); }
    commit();
    exit();
});
