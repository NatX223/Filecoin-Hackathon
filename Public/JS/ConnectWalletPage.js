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
async function GetHomePage() {

  const Contract = new ethers.Contract(contractAddress, abi, signer);
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

    // INSERT DATA INTO THE POST COMPONENT
    // IF THE CONTENT HAS NO PICTURE
    // THEN PUT IT IN A TEXT ONLY
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

  const Contract = new ethers.Contract(contractAddress, abi, signer);
  const signUp = await Contract.signUp(profileHash);

  const receipt = await signUp.wait();
  alert("You have succesfully signed up to DaSocia");
  console.log(receipt.transactionHash);
}

async function makePost() {
  // get the post content and picture
  const postText = document.getElementById("postText").value;
  const file = document.getElementById("profilePic").files[0];
  // if file == null
  if (file == null) {
    const postObject = {
      body: postText
    };
  
    const post = new Moralis.File("post.json", {
      base64: Buffer.from(JSON.stringify(postObject), 'base64'),
    });
  
    await post.saveIPFS();
    const postHash = post.hash();
  
    const Contract = new ethers.Contract(contractAddress, abi, signer);
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
  
    const Contract = new ethers.Contract(contractAddress, abi, signer);
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

  const Contract = new ethers.Contract(contractAddress, abi, signer);
  const commentPost = await Contract.createPost(postHash);

  const receipt = await commentPost.wait();
  alert("comment uploaded successfully");
  console.log(receipt.transactionHash);
}

async function fetchIPFS(hash) {
  const url = `https://gateway.moralisipfs.com/ipfs/${hash}`;
  const response = await fetch(url);
  return await response.json();
}
