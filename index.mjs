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
console.log(`Connecting Reach Telos EVM testnet...`);
stdlib.setWalletFallback(stdlib.walletFallback({
  providerEnv: {
    ETH_NODE_URI: 'https://testnet.telos.net/evm',
  }
}));
console.log(`Setting constants...`);
const nftId = '0x24D04D4eeB36d4CfD118F3929210dA885D7a2C89';
let provider = ethers.getDefaultProvider('https://testnet.telos.net/evm');

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
const minBid = stdlib.parseCurrency(0.1);
const lenInBlocks = 100;
const owner = '0x175fCe4733A90b231954796E836C42956772d514';
const params = {
  nftId,
  minBid,
  lenInBlocks,
  owner,
};
const GAS_LIMIT = 5000000;
const sbal = stdlib.parseCurrency(7);
let bid = minBid;
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

const ownerOf = await myERC.ownerOf(9);
console.log(`This is the ownerOf(9): ${ownerOf}`);

const getTok = (x) => {
  if (stdlib.connector === 'ALGO') {
    return stdlib.bigNumberToNumber(x);
  } else {
    return stdlib.formatAddress(x);
  }
};

console.log(`Deploying  Reach contract...`);
const ctcCreator = accCreator.contract(backend);

const startAuction = async () => {
  console.log(`Creating API caller account...`);
  const acc1 = await stdlib.createAccount();
  await stdlib.transfer(accCreator, acc1, sbal);
  acc1.setGasLimit(GAS_LIMIT);
  //await stdlib.transfer(accCreator, acc1, sbal);
  const ctc1 = acc1.contract(backend, ctcCreator.getInfo());
  console.log(`acc1 is ready to submit a bid`);
  bid = stdlib.parseCurrency(1.1);
  const [hb1, lp1] = await ctc1.apis.Bidder.bid(bid);
  console.log(`acc1 has successfully submitted their bid`);
};

ctcCreator.e.seeBid.monitor((evt) => {
  const {when, what: [ who_ ]} = evt;
  const who = stdlib.formatAddress(who_);
  console.log(`${stdlib.formatAddress(accCreator)} sees that ${who} bid`);
});

ctcCreator.e.seeOutcome.monitor((evt) => {
  const {when, what: [who_]} = evt;
  const who = stdlib.formatAddress(who_);
  console.log(`${stdlib.formatAddress(accCreator)} sees that ${who} won the auction`);
})

const ctcinfo = await stdlib.withDisconnect(() => ctcCreator.p.Creator({
  params,
  callApprove: async (c) => {
    console.log(`Contract Address: ${c}`);
    await myERC.approve(c, 13);
    console.log(`Approve call complete`);
  },
  auctionReady: stdlib.disconnect, 
}));

await startAuction();

console.log(`Auction complete!`);
