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
import { signer, Posts, Data } from "./main.js";

// INSTATIATING THE CONTRACT ADDRESS FOR BOTH APP SMART CONTRACT AND TOKEN SMART CONTRACT
const AppContractAddress = "0xC160754FFB07B739BD2F7F2fEcB142A66258479B"; // the App Contract Address
const TokenContractAddress = "0xFC2809d091d3ebef9626F818F4c53b08e887207a"; // the token contract address
const VerifiedContractAddress = "0xCf640befc245261Cbe13b1a6888dd7E775b8f6eb"; // the verified contract address

const AppContractABI = appcontractabi;
const TokenContractABI = tokencontractabi;
const VerifiedContractABI = verifiedcontractabi;
const NFTCollectionABI = CollectionABI;
const NFTCollectionByteCode = CollectionByteCode;
const signe = signer;

// INSTATIATING THE NEEDED VARIABLES PROVIDER AND SIGNER
// export these

var currentUser;
var currentId;

async function loadUser() {
    // transition to the new page
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
    const _Posts = await Contract.fetchMyPosts();
    let parent = document.getElementById("userPosts");
    let address = await signer.getAddress();
  
    if(_Posts.length == 0) {
      let htmlstring = `
      <p>You do not have any posts yet</p>
      `;
    }
    else {
      for(let i = _Posts.length - 1; i >= 0; i--) {
        let _post = _Posts[i];
        let post = JSON.parse(_post);
        let content = await fetchIPFS(post.posthash);
        let postContent = content.body;
        let imagehash = content.imageHash;
    
          if (imagehash == null) {
                    let htmlstring = 
            `
            <div class="row justify-content-md-center border border-3 rounded-4 border-primary" onclick="viewPost(${post.id})">
                <div class="row justify-content-md-center">
                    <div class="col-2">
                        <p>${post.author}</p>
                    </div>
                </div>
                <div class="row justify-content-md-start">
                        <div class="col-6">
                            <p>${postContent}</p>
                        </div>
                </div>
                <div class="row justify-content-md-start">
                <div class="col-6">
                <p>Likes ${post.likes}</p>
                    </div>
          </div>
                    <div class="row justify-content-md-center">
                        <div class="col-2">
                            <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                <div class="btn-group me-2" role="group" aria-label="First group">
                                  <button onclick="mintPost(${post.id})" type="button" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#mintPostModal">Mint</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        
            let row = document.createElement("div");
            row.innerHTML = htmlstring;
            parent.appendChild(row);
          } else {
            let imageurl = `https://gateway.moralisipfs.com/ipfs/${imagehash}`;
    
            let htmlstring = 
            `
            <div class="row justify-content-md-center border border-3 rounded-4 border-primary" onclick="viewPost(${post.id})">
            <div class="row justify-content-md-start">
            <div class="col-6">
                <img src="https://gateway.moralisipfs.com/ipfs/${imageurl}" class="rounded" alt="...">
            </div>
        </div>
                <div class="row justify-content-md-start">
                        <div class="col-6">
                            <p>${postContent}</p>
                        </div>
                </div>
                <div class="row justify-content-md-start">
                <div class="col-6">
                <p>Likes ${post.likes}</p>
                    </div>
          </div>
                    <div class="row justify-content-md-center">
                        <div class="col-2">
                            <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                <div class="btn-group me-2" role="group" aria-label="First group">
                                  <button onclick="mintPost(${post.id})" type="button" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#mintPostModal">Mint</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        
            let row = document.createElement("div");
            row.innerHTML = htmlstring;
            parent.appendChild(row);
          }
      }
    }
  
    // secondPage.style.display = "none";
    // thirdPage.style.display = "block";
  
  }
  
  
  function mintPost(id) {
    currentId = id;
  }
  
  async function mint() {
    id = currentId;
    var amount = document.getElementById("mintAmount");
  
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
    const receipt = await Contract.mintPost(amount, id);
    console.log(receipt);
  }
  document.getElementById("mintPost").onclick = mint;

  loadUser();