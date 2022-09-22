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

var _Posts = Posts;
var _Data = Data;

async function GetHomePage() {
    const hash = _Data[0];
    console.log(_Data, _Posts);
    const parent = document.getElementById("homePosts");
  
  
    // firstPage.style.display = "none";
    // secondPage.style.display = "block";
    if(_Posts.length == 0) {
      let htmlstring = `
      <p>No Posts created yet</p>
      `;
      let row = document.createElement("div");
      row.innerHTML = htmlstring;
      parent.appendChild(row);
    }
    else {
      for(let i = _Posts.length - 1; i >= 0; i--) {
        let _post = _Posts[i];
        let post = JSON.parse(_post);
        let content = await fetchIPFS(post.posthash);
        let postContent = content.body;
        let imagehash = content.imageHash;
    
        // INSERT _Data INTO THE POST COMPONENT
        // IF THE POST IS LOCKED
        if (post.locked == true) {
          if (imagehash == null) {
            let content = "You need to unlock this post to view it";
            let htmlstring = 
            `
            <div class="row justify-content-md-center border border-3 rounded-4 border-primary" onclick="viewUnlockedPost(${post.id})">
                <div class="row justify-content-md-center">
                    <div class="col-2">
                        <p>${post.author}</p>
                    </div>
                </div>
                <div class="row justify-content-md-start">
                        <div class="col-6">
                            <p>${content}</p>
                        </div>
                </div>
                <div class="row justify-content-md-start">
                    <div class="col-6">
                    <p>Likes ${post.likes}</p>
                        </div>
              </div>
                    <div class="row justify-content-md-start">
                        <div class="col-6">
                            <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                <div class="btn-group" role="group" aria-label="Third group">
                                  <button onclick="unlockPost(${post.id})" type="button" class="btn btn-success">unlock</button>
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
            let lockedImage = "https://cloudfour.com/wp-content/uploads/2019/02/see-no-evil-1.png";
            let content = "You need to unlock this post to view it";
            let htmlstring = 
            `
            <div class="row justify-content-md-center border border-3 rounded-4 border-primary" onclick="viewUnlockedPost(${post.id})">
                <div class="row justify-content-md-center">
                    <div class="col-2">
                        <p>${post.author}</p>
                    </div>
                </div>
                <div class="row justify-content-md-start">
                <div class="col-6">
                    <img src="https://gateway.moralisipfs.com/ipfs/${lockedImage}" class="rounded" alt="...">
                </div>
            </div>
                <div class="row justify-content-md-start">
                        <div class="col-6">
                            <p>${content}</p>
                        </div>
                </div>
                <div class="row justify-content-md-start">
                    <div class="col-6">
                    <p>Likes ${post.likes}</p>
                        </div>
              </div>
                    <div class="row justify-content-md-start">
                        <div class="col-6">
                            <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                <div class="btn-group" role="group" aria-label="First group">
                                  <button onclick="unlockPost(${post.id})" type="button" class="btn btn-success">unlock</button>
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
        } else {
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
                    <div class="row justify-content-md-start">
                        <div class="col-6">
                            <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                <div class="btn-group me-2" role="group" aria-label="First group">
                                  <button onclick="likePost(${post.id})" type="button" class="btn btn-primary">like</button>
                                </div>
                                <div class="btn-group me-2" role="group" aria-label="Second group">
                                  <button onclick="makeComment(${post.id})" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#commentModal">comment</button>
                                </div>
                                <div class="btn-group" role="group" aria-label="Third group">
                                  <button onclick="tipPost(${post.id})" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#tipModal">tip</button>
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
                    <img src="https://gateway.moralisipfs.com/ipfs/${imagehash}" class="rounded" alt="...">
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
                    <div class="row justify-content-md-start">
                        <div class="col-6">
                            <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                <div class="btn-group me-2" role="group" aria-label="First group">
                                  <button onclick="likePost(${post.id})" type="button" class="btn btn-primary">like</button>
                                </div>
                                <div class="btn-group me-2" role="group" aria-label="Second group">
                                  <button onclick="makeComment(${post.id})" type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#commentModal">comment</button>
                                </div>
                                <div class="btn-group" role="group" aria-label="Third group">
                                  <button onclick="tipPost(${post.id})" type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#tipModal">tip</button>
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
    }
    await displayLeftPanel(hash);
  
  
  }
  
  async function displayLeftPanel(hash) {
    const leftSec = document.getElementById("leftPanel");
    let address = await signe.getAddress();
    if (hash == null || hash == "") {
      let leftPanel = `
      <div class="row justify-content-start">
          <p>You have not signed up, You do not have a profile</p>
      </div>
        <div class="row justify-content-start">
              <button type="button" class="btn btn-success" id="signupButton" data-bs-toggle="modal" data-bs-target="#signupModal">Sign Up</button>
        </div>
      `;
      let left = document.createElement("div");
      left.innerHTML = leftPanel;
      leftSec.appendChild(left);
    } else {
      const Profile = await fetchIPFS(hash);
      const userName = Profile.username;
      const profilePic = Profile.pic;
      const picURL = `https://gateway.moralisipfs.com/ipfs/${profilePic}`;
      const postCount = _Data[1];
      const followerCount = _Data[2];
      let leftPanel = `
      <div class="row justify-content-md-start">
      <div class="col-6">
          <img src="https://gateway.moralisipfs.com/ipfs/${picURL}" class="rounded" alt="...">
            </div>
        </div>
          <div class="row justify-content-start">
          <p>${address}</p>
          </div>
          <hr/>
          <div class="row justify-content-start">
              <p>${userName}</p>
          </div>
          <hr/>
          <div class="row justify-content-start">
          <p>Total Posts: ${postCount}</p>
      </div>
      <hr/>
          <div class="row justify-content-start">
          <p>${followerCount} followers</p>
      </div>
      <hr/>
      <div class="row justify-content-md-start">
      <div class="col-4">
          <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
              <div class="btn-group me-2" role="group" aria-label="First group">
              <button type="button" class="btn btn-success" id="addPost" data-bs-toggle="modal" data-bs-target="#addPostModal">Make Post</button>
              </div>
              <div class="btn-group me-2" role="group" aria-label="Second group">
              <button type="button" class="btn btn-success" id="addLockedPost" data-bs-toggle="modal" data-bs-target="#addLockedPostModal">Make Locked Post</button>
              </div>
              <div class="btn-group me-2" role="group" aria-label="Third group">
              <button type="button" class="btn btn-primary" id="deploy" onclick="deployCollectionContract()">Deploy contract for collection</button>
              </div>
              <div class="btn-group me-2" role="group" aria-label="group">
              <button type="button" class="btn btn-secondary" id="getUserPosts" onclick="loadUser">View All Posts</button>
              </div>
              </div>
            </div>
          </div>
      `;
      let left = document.createElement("div");
      left.innerHTML = leftPanel;
      leftSec.appendChild(left);
    }
  }
  
  async function loadUser() {
    window.location.href = "UserPosts.html";
  }

  async function signUp() {
    const name = document.getElementById("UserName").value;
    const file = document.getElementById("profilePic").files[0];
    const pic = new Moralis.File(file.name, file);
    await pic.saveIPFS();
    const picHash = pic.hash();
  
    const profileObject = {
      username: name,
      pic: picHash
    };
  
    const profile = new Moralis.File("profile.json", {
      base64: Buffer.from(JSON.stringify(profileObject), 'base64'),
    });
  
    await profile.saveIPFS();
    const profileHash = profile.hash();
  
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
    const signUp = await Contract.signUp(profileHash);
  
    const receipt = await signUp.wait();
    alert("You have succesfully signed up to DaSocia");
    console.log(receipt.transactionHash);
  }
  
  async function makePost() {
    const postText = document.getElementById("postText").value;
    const file = document.getElementById("postPic").files[0];
  
    if (file == null) {
      const postObject = {
        body: postText
      };
    
      const post = new Moralis.File("post.json", {
        base64: Buffer.from(JSON.stringify(postObject), 'base64'),
      });
    
      await post.saveIPFS();
      const postHash = post.hash();
    
      const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
      const createPost = await Contract.createPost(postHash);
    
      const receipt = await createPost.wait();
      alert("Post uploaded successfully");
      console.log(receipt.transactionHash);
  
    } else {
      const pic = new Moralis.File(file.name, file);
      await pic.saveIPFS();
      const picHash = pic.hash();
  
      const postObject = {
        body: postText,
        imageHash: picHash
      };
    
      const post = new Moralis.File("post.json", {
        base64: Buffer.from(JSON.stringify(postObject), 'base64'),
      });
    
      await post.saveIPFS();
      const postHash = post.hash();
    
      const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
      const createPost = await Contract.createPost(postHash);
    
      const receipt = await createPost.wait();
      alert("Post uploaded successfully");
      console.log(receipt.transactionHash);
    }
  }
  
  function makeComment(id) {
    currentId = id;
  }
  
  async function Comment() {
    const commentText = document.getElementById("commentText").value;
    const commentObject = {
      comment: commentText
    };
  
    const comment = new Moralis.File("comment.json", {
      base64: Buffer.from(JSON.stringify(commentObject), 'base64'),
    });
  
    await comment.saveIPFS();
    const postHash = post.hash();
  
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
    const commentPost = await Contract.commentPost(currentId, postHash);
  
    const receipt = await commentPost.wait();
    alert("comment uploaded successfully");
    console.log(receipt.transactionHash);
  }
  
  
  async function likePost(id) {
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
    const likePost = await Contract.likePost(id);
  
    const receipt = await likePost.wait();
    // get like animation and insert or toggle like and not liked
    console.log(receipt.transactionHash);
  }
  
  async function dislikePost(id) {
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
    const dislikePost = await Contract.dislikePost(id);
  
    const receipt = await dislikePost.wait();
    // get like animation and insert or toggle like and not liked
    console.log(receipt.transactionHash);
  }
  
  function tipPost(id) {
    currentId = id;
  }
  
  async function approveTip() {
    // get the price from the user
    const amount = document.getElementById("tipAmount").value;
    const tipAmount = amount * (10 ** 18);
  
    const TokenContract = new ethers.Contract(TokenContractAddress, TokenContractABI, signe);
    await TokenContract.approve(AppContractAddress, tipAmount);
  
  }
  
  async function tip() {
    let id = currentId;
    // get the price from the user
    const amount = document.getElementById("tipAmount").value;
    const tipAmount = amount * (10 ** 18);
  
    // send 
    const Contract = new ethers.Contract(AppContractAddress, TokenContractABI, signe);
    const Send = await Contract.tipPost(id, tipAmount);
  
    const receipt = await Send.wait();
    alert("You just tipped this post");
    console.log(receipt.transactionHash);
  }
  
  async function unlockPost(id) {
    const Contract = new ethers.Contract(AppContractAddress, TokenContractABI, signe);
    const price = await Contract.getPrice(id);
  
    // approve
    const TokenContract = new ethers.Contract(TokenContractAddress, TokenContractABI, signe);
    await TokenContract.approve(AppContractAddress, price);
    // send
    const Send = await Contract.unlockPost(id);
  
    const receipt = await Send.wait();
    alert("You just unlocked this post");
    console.log(receipt.transactionHash);
  }
  
  async function viewUnlockedPost(id) {
    const Contract = new ethers.Contract(AppContractAddress, TokenContractABI, signe);
    const _post = await Contract.viewLockedPost(id);
    let post = JSON.parse(_post);
    let content = await fetchIPFS(post.posthash);
    let postContent = content.body;
    let imagehash = content.imageHash;
  
    if (image == null) {
      // THEN PUT IT IN A TEXT ONLY
    } else {
      let imageurl = `https://gateway.moralisipfs.com/ipfs/${imagehash}`;
    }
  }
  
  async function viewPost(id) {
    const Contract = new ethers.Contract(AppContractAddress, TokenContractABI, signe);
    const _post = await Contract.viewPost(id);
    let post = JSON.parse(_post);
    let content = await fetchIPFS(post.posthash);
    let postContent = content.body;
    let imagehash = content.imageHash;
  
      if (image == null) {
        // THEN PUT IT IN A TEXT ONLY
      } else {
        let imageurl = `https://gateway.moralisipfs.com/ipfs/${imagehash}`;
      }
  
  }
  
  async function mintVerified() {
    const Contract = new ethers.Contract(VerifiedContractAddress, VerifiedContractABI, signe);
    const Mint = await Contract.mint();
  
    const receipt = await Mint.wait();
    alert("Yay, You are now verified");
    console.log(receipt.transactionHash);
  }
  
  async function makeLockedPost() {
    const postText = document.getElementById("lockedPostText").value;
    const file = document.getElementById("lockedPostPic").files[0];
    const unlockPrice = document.getElementById("price");
    const price = unlockPrice * (10 ** 18);
  
    if (file == null) {
      const postObject = {
        body: postText
      };
    
      const post = new Moralis.File("post.json", {
        base64: Buffer.from(JSON.stringify(postObject), 'base64'),
      });
    
      await post.saveIPFS();
      const postHash = post.hash();
    
      const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
      const createPost = await Contract.createLockedPost(postHash, price);
    
      const receipt = await createPost.wait();
      alert("Post uploaded successfully");
      console.log(receipt.transactionHash);
  
    } else {
      const pic = new Moralis.File(file.name, file);
      await pic.saveIPFS();
      const picHash = pic.hash();
  
      const postObject = {
        body: postText,
        imageHash: picHash
      };
    
      const post = new Moralis.File("post.json", {
        base64: Buffer.from(JSON.stringify(postObject), 'base64'),
      });
    
      await post.saveIPFS();
      const postHash = post.hash();
    
      const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
      const createPost = await Contract.createLockedPost(postHash, price);
    
      const receipt = await createPost.wait();
      alert("Post uploaded successfully");
      console.log(receipt.transactionHash);
    }
  }
  
  async function followUser(user) {
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
    const follow = await Contract.followUser(user);
  
    const receipt = await follow.wait();
    alert("You just tipped this post"); // get hug/handshake annimation
    console.log(receipt.transactionHash);
  
  }
  
  async function deployCollectionContract() {
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signe);
  
    const factory = new ContractFactory(NFTCollectionABI, NFTCollectionByteCode, signe);
    const NFTContract = await factory.deploy();
  
    const CollectionAddress = NFTContract.address;
    alert("Here's your collection contract address" + CollectionAddress);
  
    const deployCon = await NFTContract.deployTransaction.wait();
    const receipt = await Contract.setCollection(CollectionAddress).wait();
    console.log(deployCon, receipt);
  
  }
  async function fetchIPFS(hash) {
    const url = `https://gateway.moralisipfs.com/ipfs/${hash}`;
    const response = await fetch(url);
    return await response.json();
  }

document.getElementById("submitSignup").onclick = signUp;
document.getElementById("submitPost").onclick = makePost;
document.getElementById("submitLockedPost").onclick = makeLockedPost;
document.getElementById("submitComment").onclick = Comment;
document.getElementById("approveTip").onclick = approveTip;
document.getElementById("sendTip").onclick = tip;

GetHomePage();
