// REQUIRE THE NEEDED PACKAGES
// IMPORTING MORALIS
const serverUrl = "serverURL";
const appId = "appId";
Moralis.start({ serverUrl, appId });
// IMPORTING ETHERS.JS
const ethers = Moralis.web3Library;
// IMPORTING WEB3.STORAGE
// IMPORTING THE CONTRACT ABI

// INSTATIATING THE CONTRACT ADDRESS FOR BOTH APP SMART CONTRACT AND TOKEN SMART CONTRACT
const AppContractAddress = ""; // the App Contract Address
const TokenContractAddress = ""; // the token contract address

// INSTATIATING THE NEEDED VARIABLES PROVIDER AND SIGNER
const AppContractABI = appcontractabi;
const TokenContractABI = tokencontractabi;

var web3provider;

var signer;
// DISPLAY OPTIONS/MODULE
async function walletOptions() {
    var x = document.getElementById("connectWalletOptions");
    x.style.display = "block";
  }

// CONNECT WALET FUNCTION (walletConnect)
async function walletconnect() {
    web3provider = await Moralis.enableWeb3({ provider: "walletconnect"});
    
    await web3provider.send("eth_requestAccounts", [])
    .catch((function (error) {
        alert("For some reason you could not connect your wallet to DaSocia");
      }));
    signer = web3provider.getSigner();
    alert("You now connected to DaSocia");
  }

// CONNECT WALET FUNCTION (metamask)
async function metamask() {
    web3provider = await Moralis.enableWeb3({ provider: "metamask"});
    
    await web3provider.send("eth_requestAccounts", [])
    .catch((function (error) {
        alert("For some reason you could not connect your wallet to DaSocia");
      }));
    signer = web3provider.getSigner();
    alert("You now connected to DaSocia");
  }

// DISPLAY HOMEPAGE FUNCTION

