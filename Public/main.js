// REQUIRE THE NEEDED PACKAGES
// IMPORTING MORALIS
const serverUrl = "https://lt8arbueic10.usemoralis.com:2053/server";
const appId = "9YxPMIsYLJDvwX1opTxQ6YTAaGgTzAAXaypxdKba";
Moralis.start({ serverUrl, appId });
// IMPORTING ETHERS.JS
const ethers = Moralis.web3Library;
// IMPORTING THE CONTRACT ABI
import { appcontractabi } from "./SmartContractABI.js";
import { tokencontractabi } from "./TokenCntractABI.js";
import { verifiedcontractabi } from "./VerifiedContractABI.js";
import { CollectionABI } from "./NFTCollectionContractABI.js";
import { CollectionByteCode } from "./NFTCollectionContractBC.js";

// INSTATIATING THE CONTRACT ADDRESS FOR BOTH APP SMART CONTRACT AND TOKEN SMART CONTRACT
const AppContractAddress = "0xC160754FFB07B739BD2F7F2fEcB142A66258479B"; // the App Contract Address
const TokenContractAddress = "0xFC2809d091d3ebef9626F818F4c53b08e887207a"; // the token contract address
const VerifiedContractAddress = "0xCf640befc245261Cbe13b1a6888dd7E775b8f6eb"; // the verified contract address

const AppContractABI = appcontractabi;
const TokenContractABI = tokencontractabi;
const VerifiedContractABI = verifiedcontractabi;
const NFTCollectionABI = CollectionABI;
const NFTCollectionByteCode = CollectionByteCode;

// INSTATIATING THE NEEDED VARIABLES PROVIDER AND SIGNER
// export these
var web3provider;
var signer;
var currentUser;
var currentId;

var Posts;
var Data;

export {signer, Posts, Data};

const firstPage = document.getElementById("firstPage");
const secondPage = document.getElementById("secondPage");
const thirdPage = document.getElementById("thirdPage");

// CONNECT WALET FUNCTION (walletConnect)
async function walletconnect() {
    web3provider = await Moralis.enableWeb3({ provider: "walletconnect"});
    await web3provider.send("eth_requestAccounts", []);
    signer = web3provider.getSigner();
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
    Posts = await Contract.fetchPosts();
    Data = await Contract.getUserProfile();
    signer = web3provider.getSigner();
    alert("You now connected to DaSocia");
    window.location.href = "HomePage.html";
  }

// CONNECT WALET FUNCTION (metamask)
async function metamask() {
  web3provider = await Moralis.enableWeb3({ provider: "metamask"});
  await web3provider.send("eth_requestAccounts", []);
  signer = web3provider.getSigner();
  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
  Posts = await Contract.fetchPosts();
  Data = await Contract.getUserProfile();
  signer = web3provider.getSigner();
  alert("You now connected to DaSocia");
  window.location.href = "HomePage.html";
}

// DISPLAY HOMEPAGE FUNCTION



async function fetchIPFS(hash) {
  const url = `https://gateway.moralisipfs.com/ipfs/${hash}`;
  const response = await fetch(url);
  return await response.json();
}


document.getElementById("metamaskbutton").onclick = metamask;
document.getElementById("walletconnectbutton").onclick = walletconnect;


