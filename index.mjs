/**
 * Subscription payment system on Ethereum
 * Smart Contract
 * Approve functionality -- gives a contract address the ability to spend the token
 * You give access to the subscription contract for about a year
 * Then the smart contract limits how much a merchant can pull from it
 * The smart contract controls how many tokens can be pulled and spit from it
 * subscription costs 1 ETH for the year, give access to the 1 ETH in my wallet, the smart contract knows
 * when the start date is and determines when the contract can send out tokens
 */

import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();
if (stdlib.connector === 'ALGO') { process.exit(0); }
const {ethers} = stdlib;
const telos = 'https://testnet.telos.net/evm';
console.log(`Connecting Reach to Telos EVM testnet...`);
stdlib.setWalletFallback(stdlib.walletFallback({
  providerEnv: {
    ETH_NODE_URI: telos,
  }
}));
console.log(`Setting constants...`);
const nftId = '0xf72a6B8bc6348d3171D87d3814172ed4bC770747';
let provider = ethers.getDefaultProvider(telos);

const abi = [
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
      "indexed": true,
      "internalType": "address",
      "name": "approved",
      "type": "address"
    }, {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "owner", "type": "address"}, {
      "indexed": true,
      "internalType": "address",
      "name": "operator",
      "type": "address"
    }, {"indexed": false, "internalType": "bool", "name": "approved", "type": "bool"}],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [{"indexed": true, "internalType": "address", "name": "from", "type": "address"}, {
      "indexed": true,
      "internalType": "address",
      "name": "to",
      "type": "address"
    }, {"indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "address", "name": "to", "type": "address"}, {
      "internalType": "uint256",
      "name": "tokenId",
      "type": "uint256"
    }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "balance", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "getApproved",
    "outputs": [{"internalType": "address", "name": "operator", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}, {
      "internalType": "address",
      "name": "operator",
      "type": "address"
    }],
    "name": "isApprovedForAll",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {
      "internalType": "address",
      "name": "to",
      "type": "address"
    },
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}, {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "operator", "type": "address"}, {
      "internalType": "bool",
      "name": "_approved",
      "type": "bool"
    }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes4", "name": "interfaceId", "type": "bytes4"}],
    "name": "supportsInterface",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "from", "type": "address"}, {
      "internalType": "address",
      "name": "to",
      "type": "address"
    }, {"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
const minBid = 0.1;
const tokenId = 14;
console.log(`Minimum bid: ${minBid}`);
const lenInBlocks = 20;
const owner = '0x175fCe4733A90b231954796E836C42956772d514';
const params = {
  nftId,
  minBid: stdlib.parseCurrency(minBid),
  lenInBlocks,
  owner,
  tokenId, 
};
const GAS_LIMIT = 5000000;
const sbal = stdlib.parseCurrency(5);
console.log(`Importing creator account from MetaMask`);
const accCreator = await stdlib.newAccountFromMnemonic('gas festival emerge olive topic blue zoo trouble chimney supply young anchor');
console.log(`This is the creator account: ${accCreator.getAddress()}`);
accCreator.setGasLimit(GAS_LIMIT);
accCreator.setDebugLabel('Creator');

const signer = new ethers.Wallet('38053b2bd389c315ed89a5fdd25eea38a0b3edca91e678a60097904df6015e6f', provider)
console.log(`This is the signer: ${signer.address}`);

const myERC = new ethers.Contract(nftId, abi, signer);
const myERCname = await myERC.name();
console.log(`This is the ERC721 name: ${myERCname}`);

const ownerOf = await myERC.ownerOf(tokenId);
console.log(`This is the ownerOf(${tokenId}): ${ownerOf}`);

console.log(`Deploying Reach contract...`);
const ctcCreator = accCreator.contract(backend);
const ctcinfo = ctcCreator.getInfo();

const startAuction = async () => {
  const runUser = async (who, amt) => {
    const bid = stdlib.parseCurrency(amt);
    console.log(`Creating API caller account`);
    const acc = await stdlib.createAccount();
    console.log(`${who} address: ${acc.getAddress()}`);
    await stdlib.transfer(accCreator, acc, sbal);
    acc.setGasLimit(GAS_LIMIT);
    const ctc = acc.contract(backend, ctcinfo);
    console.log(`${who} is ready to submit a bid`);
    try{
      const [hb, lp] = await ctc.apis.Bidder.bid(bid);
      console.log(`${who} has submitted a bid of ${stdlib.formatCurrency(bid)}.
      Sees highest bidder is ${stdlib.formatAddress(hb)}.
      Sees last price: ${stdlib.formatCurrency(lp)}`);
    } catch (e) {
      console.log(`Reach contract errored with: ${e}`);
    }
    await stdlib.wait(10);
  };

  await runUser('Bob1', 0.5);
  await runUser('Bob2', 0.6);
  // await runUser('Bob3');
  // await runUser('Bob4');
};

// ctcCreator.e.seeBid.monitor((evt) => {
//   console.log(`seeBid monitor input triggered: ${evt}`);
//   const {when, what: [ who_ ]} = evt;
//   const who = stdlib.formatAddress(who_);
//   console.log(`${stdlib.formatAddress(accCreator)} sees that ${who} bid`);
// });

// ctcCreator.e.seeOutcome.monitor((evt) => {
//   console.log(`seeOutcome monitor input triggered: ${evt}`);
//   const {when, what: [who_]} = evt;
//   const who = stdlib.formatAddress(who_);
//   console.log(`${stdlib.formatAddress(accCreator)} sees that ${who} won the auction`);
// })

const ctcDis = await stdlib.withDisconnect(() => ctcCreator.p.Creator({
  params,
  callApprove: async (c) => {
    console.log(`Contract Address: ${c}`);
    await myERC.approve(c, tokenId);
    console.log(`Approve call to myERC contract complete`);
  },
  auctionReady: stdlib.disconnect
}));

await startAuction();

console.log(`Auction complete!`);
