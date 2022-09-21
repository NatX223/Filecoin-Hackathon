// REQUIRE THE NEEDED PACKAGES
// IMPORTING MORALIS
const serverUrl = "serverURL";
const appId = "appId";
Moralis.start({ serverUrl, appId });
// IMPORTING ETHERS.JS
const ethers = Moralis.web3Library;
// IMPORTING THE CONTRACT ABI
import { appcontractabi } from "./SmartContractABI";
import { tokencontractabi } from "./TokenCntractABI";
import { verifiedcontractabi } from "./VerifiedContractABI";
import { CollectionABI } from "./NFTCollectionContractABI";
import { CollectionByteCode } from "./NFTCollectionContractBC";

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

export default signer;

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
async function GetHomePage() {

  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
  const Posts = await Contract.fetchPosts();
  const Data = await Contract.getUserProfile();
  const hash = Data[0];

  const Profile = fetchIPFS(hash);
  const userName = Profile.username;
  const profilePic = Profile.pic;
  const picURL = `https://gateway.moralisipfs.com/ipfs/${profilePic}`;
  const postCount = Data[1];
  const followerCount = Data[2];

  // TODO
  for(let i = Posts.length - 1; i >= 0; i--) {
    let _post = Posts[i];
    let post = JSON.parse(_post);
    let content = fetchIPFS(post.posthash);
    let postContent = content.body;
    let imagehash = content.imageHash;

    // INSERT DATA INTO THE POST COMPONENT
    // IF THE POST IS LOCKED
    if (post.locked == true) {
      if (imagehash == null) {
        
      } else {
        let imageurl = `https://gateway.moralisipfs.com/ipfs/${imagehash}`;
      }
    } else {
      if (imagehash == null) {
        
      } else {
        let imageurl = `https://gateway.moralisipfs.com/ipfs/${imagehash}`;
      }
    }
  }

  // INSERT the profile the details into the component

}

async function signUp() {
  const name = document.getElementById("Username").value;
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

  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
  const signUp = await Contract.signUp(profileHash);

  const receipt = await signUp.wait();
  alert("You have succesfully signed up to DaSocia");
  console.log(receipt.transactionHash);
}

async function makePost() {
  const postText = document.getElementById("postText").value;
  const file = document.getElementById("profilePic").files[0];

  if (file == null) {
    const postObject = {
      body: postText
    };
  
    const post = new Moralis.File("post.json", {
      base64: Buffer.from(JSON.stringify(postObject), 'base64'),
    });
  
    await post.saveIPFS();
    const postHash = post.hash();
  
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
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
  
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
    const createPost = await Contract.createPost(postHash);
  
    const receipt = await createPost.wait();
    alert("Post uploaded successfully");
    console.log(receipt.transactionHash);
  }
}

async function makeComment(id) {
  const commentText = document.getElementById("postText").value;
  const commentObject = {
    comment: commentText
  };

  const comment = new Moralis.File("comment.json", {
    base64: Buffer.from(JSON.stringify(commentObject), 'base64'),
  });

  await comment.saveIPFS();
  const postHash = post.hash();

  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
  const commentPost = await Contract.createPost(id, postHash);

  const receipt = await commentPost.wait();
  alert("comment uploaded successfully");
  console.log(receipt.transactionHash);
}

async function likePost(id) {
  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
  const likePost = await Contract.likePost(id);

  const receipt = await likePost.wait();
  // get like animation and insert or toggle like and not liked
  console.log(receipt.transactionHash);
}

async function dislikePost(id) {
  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
  const dislikePost = await Contract.dislikePost(id);

  const receipt = await dislikePost.wait();
  // get like animation and insert or toggle like and not liked
  console.log(receipt.transactionHash);
}

async function tipPost(id) {
  // toggle the tip modal
  var x = document.getElementById("tipMenu");
  x.style.display = "block";

  // get the price from the user
  const amount = document.getElementById("tipAmount").value;
  const tipAmount = amount * (10 ** 18);

  // approve
  const TokenContract = new ethers.Contract(TokenContractAddress, TokenContractABI, signer);
  await TokenContract.approve(AppContractAddress, tipAmount);
  // send 
  const Contract = new ethers.Contract(AppContractAddress, TokenContractABI, signer);
  const Send = await Contract.tipPost(id, tipAmount);

  const receipt = await Send.wait();
  alert("You just tipped this post");
  console.log(receipt.transactionHash);
}

async function unlockPost(id) {
  const Contract = new ethers.Contract(AppContractAddress, TokenContractABI, signer);
  const price = await Contract.getPrice(id);

  // approve
  const TokenContract = new ethers.Contract(TokenContractAddress, TokenContractABI, signer);
  await TokenContract.approve(AppContractAddress, price);
  // send
  const Send = await Contract.unlockPost(id);

  const receipt = await Send.wait();
  alert("You just unlocked this post");
  console.log(receipt.transactionHash);
}

async function viewUnlockedPost(id) {
  const Contract = new ethers.Contract(AppContractAddress, TokenContractABI, signer);
  const _post = await Contract.viewLockedPost(id);
  let post = JSON.parse(_post);
  let content = fetchIPFS(post.posthash);
  let postContent = content.body;
  let imagehash = content.imageHash;

  if (image == null) {
    // THEN PUT IT IN A TEXT ONLY
  } else {
    let imageurl = `https://gateway.moralisipfs.com/ipfs/${imagehash}`;
  }
}

async function viewPost(id) {
  const Contract = new ethers.Contract(AppContractAddress, TokenContractABI, signer);
  const _post = await Contract.viewPost(id);
  let post = JSON.parse(_post);
  let content = fetchIPFS(post.posthash);
  let postContent = content.body;
  let imagehash = content.imageHash;

    if (image == null) {
      // THEN PUT IT IN A TEXT ONLY
    } else {
      let imageurl = `https://gateway.moralisipfs.com/ipfs/${imagehash}`;
    }

}

async function loadUser(user) {
  // get the address of the new user
  // transition to the new page
  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
  const Posts = await Contract.fetchUserPosts(user);
  const Data = await Contract.getProfile(user);
  const hash = Data[0];

  const Profile = fetchIPFS(hash);
  const userName = Profile.username;
  const profilePic = Profile.pic;
  const picURL = `https://gateway.moralisipfs.com/ipfs/${profilePic}`;
  const postCount = Data[1];
  const followerCount = Data[2];

  // TODO
  for(let i = Posts.length - 1; i >= 0; i--) {
    let _post = Posts[i];
    let post = JSON.parse(_post);
    let content = fetchIPFS(post.posthash);
    let postContent = content.body;
    let imagehash = content.imageHash;

    if (post.locked == true) {
      if (imagehash == null) {
        
      } else {
        let imageurl = `https://gateway.moralisipfs.com/ipfs/${imagehash}`;
      }
    } else {
      if (imagehash == null) {
        
      } else {
        let imageurl = `https://gateway.moralisipfs.com/ipfs/${imagehash}`;
      }
    }
    // THEN PUT IT IN A TEXT ONLY
  }

  // INSERT the profile the details into the component

}

async function mintVerified() {
  const Contract = new ethers.Contract(VerifiedContractAddress, VerifiedContractABI, signer);
  const Mint = await Contract.mint();

  const receipt = await Mint.wait();
  alert("Yay, You are now verified");
  console.log(receipt.transactionHash);
}

async function makeLockedPost() {
  const postText = document.getElementById("postText").value;
  const file = document.getElementById("profilePic").files[0];
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
  
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
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
  
    const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
    const createPost = await Contract.createLockedPost(postHash, price);
  
    const receipt = await createPost.wait();
    alert("Post uploaded successfully");
    console.log(receipt.transactionHash);
  }
}

async function followUser(user) {
  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
  const follow = await Contract.followUser(user);

  const receipt = await follow.wait();
  alert("You just tipped this post"); // get hug/handshake annimation
  console.log(receipt.transactionHash);

}

async function deployCollectionContract() {
  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);

  const factory = new ContractFactory(NFTCollectionABI, NFTCollectionByteCode, signer);
  const NFTContract = await factory.deploy();

  const CollectionAddress = NFTContract.address;

  const deployCon = await NFTContract.deployTransaction.wait();
  const receipt = await Contract.setCollection(CollectionAddress);

}

async function mintPost(id) {
  var amount = document.getElementById("amount");

  const Contract = new ethers.Contract(AppContractAddress, AppContractABI, signer);
  const receipt = await Contract.mintPost(amount, id);
}

async function fetchIPFS(hash) {
  const url = `https://gateway.moralisipfs.com/ipfs/${hash}`;
  const response = await fetch(url);
  return await response.json();
}
