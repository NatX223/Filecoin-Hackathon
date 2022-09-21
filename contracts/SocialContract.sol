// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";

// A Social Media platform where people can monetize their content

contract SocialMediaContract {
    // Variables
    using Counters for Counters.Counter; // OpenZepplin Counter
    Counters.Counter private _posts; // Counter For Posts
    address payable owner; // Contract Owner Address
    uint totalreward; // the total amount of tokens that will be rewarded for contributing
    uint rewardAccumalted = 0; // the rewards that have given
    uint decimals; // the decimals of the token
    // the specified amount of tokens to be rewarded to a user for making an interaction
    uint postReward;
    uint likeReward;
    uint commentReward;
    IToken token;

    // mapping for an address to the ipfs hash of his profile
    mapping(address => string) profileHash;
    // the count for a userPosts
    mapping(address => uint) userPostCount;

    // follower mapping for users
    mapping (address => uint) followerCount;
    mapping (address => mapping (address => bool)) following;

    // mapping for verified waitlist
    mapping (address => bool) verified;

    // number of followers needed to become verified
    uint public verifiedLevel;

    // Mapping for users to their collection address
    mapping (address => address) userCollection;

    struct Post {
        uint id;
        string posthash; // This will include image and description
        address payable author; // Author Address
        bool deleted; // Delete Status
        uint likes; // Post Likes
        uint postedAt; // TimeStamp
        string[] commentsHash; // IPFS hash for the comments
        bool locked; // check if the post is locked or not
        uint unlockPrice; // the price for unlocking the post in the native coin
    }

    event PostCreated(
        uint id,
        string posthash,
        address payable author,
        bool deleted,
        uint likes,
        uint postedAt
    );

    // Mappings
    mapping(uint256 => Post) private idToPost;
    mapping(address => mapping(uint => bool)) private liked; // mapping for user if he/she has liked the post or not
    mapping (address => bool) unlocked;

    constructor(uint _postReward, uint _likeReward,  uint _commentReward, address tokenAddress, uint _verifiedLevel) {
        postReward = _postReward;
        likeReward = _likeReward;
        commentReward = _commentReward;
        verifiedLevel = _verifiedLevel;
        token = IToken(tokenAddress);
        totalreward = token.totalRewards();
        decimals = token.decimals();
    }

    // function to sign a user up
    function signUp(string memory hash) public {
        profileHash[msg.sender] = hash;
        userPostCount[msg.sender] = 0;
        followerCount[msg.sender] = 0;
    }

    // function to update the user profile
    function updateProfile(string memory hash) public {
        profileHash[msg.sender] = hash;
    }

    // Creates a Post
    function createPost(string memory _postHash) public {
        require(bytes(_postHash).length > 0, "PostHash Not Found");
        uint remainingReward = totalreward - rewardAccumalted;

        if (remainingReward >= postReward) {
        _posts.increment();
        uint256 newPostId = _posts.current(); // Post Counter Incremented
        uint likes = 0; // Likes initialized to zero
        uint postedAt = block.timestamp; // Post Timestamp
        bool deleted = false; // Post Status default false
        string[] memory comments;

        idToPost[newPostId] = Post(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt,
            comments,
            false,
            0
        );

        liked[msg.sender][newPostId] = false;

        uint amount = postReward * (10 ** decimals);
        token.transfer(msg.sender, amount);

        rewardAccumalted = rewardAccumalted + postReward;

        userPostCount[msg.sender] = userPostCount[msg.sender] + 1;

        emit PostCreated(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt
        );
        } else {
        _posts.increment();
        uint256 newPostId = _posts.current(); // Post Counter Incremented
        uint likes = 0; // Likes initialized to zero
        uint postedAt = block.timestamp; // Post Timestamp
        bool deleted = false; // Post Status default false
        string[] memory comments;

        idToPost[newPostId] = Post(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt,
            comments,
            false,
            0
        );

        liked[msg.sender][newPostId] = false;

        userPostCount[msg.sender] = userPostCount[msg.sender] + 1;

        emit PostCreated(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt
        );
        }
    }

    // function to create a locked post
        function createLockedPost(string memory _postHash, uint unlockPrice) public {
        require(bytes(_postHash).length > 0, "PostHash Not Found");
        uint remainingReward = totalreward - rewardAccumalted;

        if (remainingReward >= postReward) {
        _posts.increment();
        uint256 newPostId = _posts.current(); // Post Counter Incremented
        uint likes = 0; // Likes initialized to zero
        uint postedAt = block.timestamp; // Post Timestamp
        bool deleted = false; // Post Status default false
        string[] memory comments;

        idToPost[newPostId] = Post(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt,
            comments,
            true,
            unlockPrice
        );

        liked[msg.sender][newPostId] = false;

        uint amount = postReward * (10 ** decimals);
        token.transfer(msg.sender, amount);

        rewardAccumalted = rewardAccumalted + postReward;

        emit PostCreated(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt
        );
        } else {
        _posts.increment();
        uint256 newPostId = _posts.current(); // Post Counter Incremented
        uint likes = 0; // Likes initialized to zero
        uint postedAt = block.timestamp; // Post Timestamp
        bool deleted = false; // Post Status default false
        string[] memory comments;

        idToPost[newPostId] = Post(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt,
            comments,
            false,
            unlockPrice
        );

        liked[msg.sender][newPostId] = false;

        emit PostCreated(
            newPostId,
            _postHash,
            payable(msg.sender),
            deleted,
            likes,
            postedAt
        );
        }
    }

    // Return all posts stored in mapping
    // done
    function fetchPosts() public view returns (Post[] memory) {
        uint postCount = _posts.current();
        uint currentIndex = 0;
        Post[] memory posts = new Post[](postCount);
        for (uint i = 0; i < postCount; i++) {
            if (idToPost[i + 1].deleted == false) {
                uint currentId = i + 1;
                Post storage currentPost = idToPost[currentId];
                posts[currentIndex] = currentPost;
                currentIndex += 1;
            }
        }
        return posts;
    }

    // Delete Post
    function deletePost(uint _id) public {
        // Post Can only be deleted by author
        address author = idToPost[_id].author;
        require(msg.sender == author, "Post can only be deleted by owner"); // Checks Author
        // Set Delete Status to true
        idToPost[_id].deleted = true;
    }

    // Like Post
    function likePost(uint _id) public {
        bool likeStatus = liked[msg.sender][_id];
        require(likeStatus == false, "User has Liked this Post Before");
        uint remainingReward = totalreward - rewardAccumalted;
        if (remainingReward >= postReward) {
        liked[msg.sender][_id] = true;
        uint postLikes = idToPost[_id].likes;
        idToPost[_id].likes = postLikes + 1;

        uint amount = likeReward * (10 ** decimals);
        token.transfer(msg.sender, amount);

        rewardAccumalted = rewardAccumalted +likeReward;      
        } else {
        liked[msg.sender][_id] = true;
        uint postLikes = idToPost[_id].likes;
        idToPost[_id].likes = postLikes + 1;
        }
    }

    // function to comment on post
    function commentPost(uint id, string memory newHash) public {
        uint postCount = getPostCount();
        uint remainingReward = totalreward - rewardAccumalted;
        require(id <= postCount, "The post does not exist");
        if (remainingReward >= commentReward) {
            idToPost[id].commentsHash.push(newHash);
            uint amount = postReward * (10 ** decimals);
            token.transfer(msg.sender, amount);

            rewardAccumalted = rewardAccumalted + postReward;
        } else {
            idToPost[id].commentsHash.push(newHash);
        }

    }

    // function to fetch the comments on a particular post
    

    // Dislike Post
    function dislikePost(uint _id) public {
        bool likeStatus = liked[msg.sender][_id];
        require(likeStatus == true, "User has DisLiked this Post Before");
        liked[msg.sender][_id] = false;
        uint postLikes = idToPost[_id].likes;
        idToPost[_id].likes = postLikes - 1;
    }

    // To edit the hash of a hash
    function editPost(uint _id, string memory _hash) public {
        // Post Can only be edited by author
        address author = idToPost[_id].author;
        require(msg.sender == author, "Post can only be edited by owner"); // Checks Author
        // Set Post Hash to new Hash
        idToPost[_id].posthash = _hash;
    }

    // function to tip a post
    function tipPost(uint id, uint tip) public {
        uint postCount = getPostCount();
        require(id <= postCount, "The post does not exist");

        address author = idToPost[id].author;
        token.transferFrom(msg.sender, author, tip);
    }

    // Return all posts of msg.sender
    function fetchMyPosts() public view returns (Post[] memory) {
        uint totalPostCount = _posts.current();
        uint currentIndex = 0;
        uint itemCount = 0;

        for (uint i = 0; i < totalPostCount; i++) {
            if (idToPost[i + 1].author == msg.sender) {
                itemCount += 1;
            }
        }

        Post[] memory posts = new Post[](itemCount);
        for (uint i = 0; i < totalPostCount; i++) {
            if (idToPost[i + 1].author == msg.sender) {
                uint currentId = i + 1;
                Post storage currentPost = idToPost[currentId];
                posts[currentIndex] = currentPost;
                currentIndex += 1;
            }
        }
        return posts;
    }

    // Return all posts of a user
    function fetchUserPosts(address user) public view returns (Post[] memory) {
        uint totalPostCount = _posts.current();
        uint currentIndex = 0;
        uint itemCount = 0;

        for (uint i = 0; i < totalPostCount; i++) {
            if (idToPost[i + 1].author == user) {
                itemCount += 1;
            }
        }

        Post[] memory posts = new Post[](itemCount);
        for (uint i = 0; i < totalPostCount; i++) {
            if (idToPost[i + 1].author == user) {
                uint currentId = i + 1;
                Post storage currentPost = idToPost[currentId];
                posts[currentIndex] = currentPost;
                currentIndex += 1;
            }
        }
        return posts;
    }

    // function to return user profile
    // done
    function getUserProfile() public view returns (string memory _profileHash, uint postCount, uint _followerCount) {
        return(profileHash[msg.sender], userPostCount[msg.sender], followerCount[msg.sender]);
    }

    function getProfile(address user) public view returns (string memory _profileHash, uint postCount, uint _followerCount) {
        return(profileHash[user], userPostCount[user], followerCount[user]);
    }

    // function to return the postHash of a post
    function getHash(uint id) view public returns (string memory posthash) {
        posthash = idToPost[id].posthash;
        return posthash;
    }

    // Setter and Getter Functions
    function getPostCount() public view returns (uint) {
        return _posts.current();
    }

    function getLikeCount(uint _id) public view returns (uint) {
        return idToPost[_id].likes;
    }

    // function to follow a user
    function followUser(address user) public {
        require(following[msg.sender][user] != true, "You are already following this user");
        followerCount[user] = followerCount[user] + 1;
        following[msg.sender][user] = true;
    }

    // function to get the waitlist for verified status
    function getVerified() public {
        require(followerCount[msg.sender] >= verifiedLevel, "You do not have enough followers");
        require(verified[msg.sender] != true, "You are already verified");
        verified[msg.sender] = true;
    }

    // function to check if a user is verified
    function checkVerified(address user) public view returns (bool) {
        bool _verified = verified[user];
        return _verified;
    }
    
    // function to return the price for unlocking a post
    function getPrice(uint id) public view returns (uint price) {
        price = idToPost[id].unlockPrice;
    }
    
    function mintVerified(address user) external {
        require(verified[user] == true, "You are not verified yet");

        verified[user] = false;
    }

    // function to unlock a post
    function unlockPost(uint postId) public {
        require(unlocked[msg.sender] != true, "You have unlocked this post already");
        
        uint price = getPrice(postId);
        address author = idToPost[postId].author;
        token.transferFrom(msg.sender, author, price);
    }

    // function to view locked post
    function viewLockedPost(uint postId) public view returns (Post memory post) {
        require(unlocked[msg.sender] == true, "You have not unlocked this post yet");
        post = idToPost[postId];
        return post;
    }

    // function to view post
    function viewPost(uint postId) public view returns (Post memory post) {
        require(unlocked[msg.sender] == true, "You have not unlocked this post yet");
        require(idToPost[postId].deleted != true, "Post has been deleted");
        
        post = idToPost[postId];
        return post;
    }

    function setCollection(address contractAddress) public {
        userCollection[msg.sender] = contractAddress;
    }

    function mintPost(uint amount, uint id) public {
        require(amount < 5, "You cannot mint more than 5");
        string memory uri = idToPost[id].posthash;
        address collectionAddress = userCollection[msg.sender];
        Collection NFTCollection = Collection(collectionAddress);

        NFTCollection.mint(msg.sender, amount, uri);
    }

}

interface IToken {
    
    function maximumSupply() external returns (uint);

    function totalRewards() external returns (uint);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    function decimals() external returns (uint);
}

interface Collection {
    function mint(address to, uint amount, string memory uri) external;
}