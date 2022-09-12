// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract VerifiedToken {
    // token name
    string private _name;
    // token symbol
    string private _symbol;
    // balances/ownership mapping
    mapping (address => uint) _balances;
    // owners list -- array
    address[] private owners;
    // the uri variable
    string private _tokenURI;
    // the smart contract instance
    SocialContract internal mainContract;


    // getting the address of the contract
    constructor(address contractAddress, string memory tokenURI_, string memory name_, string memory symbol_) {
        mainContract = SocialContract(contractAddress);
        _tokenURI = tokenURI_;
        _name = name_;
        _symbol = symbol_;
    }

    // function to mint the token, just one for each user
    function mint() public {
        bool status = mainContract.checkVerified(msg.sender);
        require(status == true, "You are not in the wait list");

        _balances[msg.sender] = _balances[msg.sender] + 1;
        mainContract.mintVerified(msg.sender);
    }

    // function to return the uri
    function tokenURI() public view returns (string memory) {
        return _tokenURI;
    }

    // return balance/ownership
    function checkOwnership() public view returns (bool) {
        if (_balances[msg.sender] == 1) {
            return true;
        } else {
            return false;
        }
    }
}

// interface for waitlist
interface SocialContract {
    function checkVerified(address user) external returns (bool);
    function mintVerified(address user) external;
}