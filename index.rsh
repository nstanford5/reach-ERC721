/**
 * Almost done!
 * 
 * -- After the auction is complete, the Reach contract still owns the token
 */

'reach 0.1';

const Params = Object({
  nftId: Contract,
  minBid: UInt,
  lenInBlocks: UInt,
  owner: Address,
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
      nft: Address,
      currentBid: UInt,
    });
    const E = Events({
      seeBid: [Address, UInt],
      seeOutcome: [Address, UInt],
    });
    const myERC = {
      // The Reach contract cannot approve itself, only the token owner can do this
      //approve: Fun([Address, UInt256], Null),
      transferFrom: Fun([Address, Address, UInt256], Null),
      //transferFrom(address from, address to, uint256 tokenId)
    };
    init();

    Creator.only(() => {
        const {nftId, minBid, lenInBlocks, owner} = declassify(interact.params);
    });
    Creator.publish(nftId, minBid, lenInBlocks, owner);
    commit();
    Creator.interact.callApprove(getAddress());
    Creator.publish();
    const amt = 1;
    const ctcSol = remote(nftId, myERC);
    ctcSol.transferFrom(owner, getAddress(), UInt256(13));
    //assert(balance(nftId) == amt, "balance of NFT is wrong");
    // V.min.set(minBid);
    // V.nft.set(nftId);
    //commit();
    //Creator.publish();
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
                notify([highestBidder, lastPrice]);
                if ( ! isFirstBid ) {
                    transfer(lastPrice).to(highestBidder);
                }
                const who = this;
                return [who, bid, false];
            }];
        })
    ctcSol.transferFrom(getAddress(), highestBidder, UInt256(13));
    if ( ! isFirstBid ) { transfer(lastPrice).to(Creator); }
    commit();
    exit();
});
