// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
contract DigitalIdentity {
    
    struct UserData {
        uint user_id;
        string user_email;
        bytes32 user_password;
        string user_account_status;
        string user_passport_num;
        string user_passport_name;
        string user_passport_link;
        string secret_key;
    }
    
    struct UserCred {
        uint user_id;
        string user_passport_num;
    }
    
    uint numUsers; 
    // web3 start from 1 to <=numUsers
    mapping(string => UserData) userPassportNo; 
    mapping(uint => UserCred) userCounter;
    
    function getNumOfUsers () public view returns (uint) {
        return numUsers;
    }

    function getPassportNoById (uint user_id) public view returns (string memory) {
        return (userCounter[user_id].user_passport_num);
    }

    function addUser( string memory user_email, string memory user_password , string memory user_passport_num, string memory user_passport_name, string memory user_passport_link, string memory secret_key) public {
        require (keccak256(abi.encodePacked(userPassportNo[user_passport_num].user_passport_num)) != keccak256(abi.encodePacked(user_passport_num)), "Error! User already exists.");
        numUsers++;
        bytes32 user_password1 = keccak256(abi.encodePacked(user_password));
        userPassportNo[user_passport_num] = UserData( numUsers, user_email, user_password1, "unverified", user_passport_num, user_passport_name, user_passport_link, secret_key);
        userCounter[numUsers] = UserCred( numUsers, user_passport_num);
    }
    
    function getUser ( uint user_id) public view returns ( string memory, string memory, string memory, string memory, string memory ) {
        string memory passNum = getPassportNoById(user_id);
        return ( userPassportNo[passNum].user_email, userPassportNo[passNum].user_account_status, userPassportNo[passNum].user_passport_num, userPassportNo[passNum].user_passport_name, userPassportNo[passNum].user_passport_link);
    }
    
    function updateUser (string memory user_email, string memory user_passport_num, string memory user_passport_name, string memory user_passport_link) public {
        require (keccak256(abi.encodePacked(userPassportNo[user_passport_num].user_passport_num)) == keccak256(abi.encodePacked(user_passport_num)), "Error! User not registered or wrong passport number entered.");
        require (keccak256(abi.encodePacked(userPassportNo[user_passport_num].user_account_status)) != keccak256(abi.encodePacked("suspended")), "Error! Your account is banned");
        userPassportNo[user_passport_num].user_email = user_email ;
        userPassportNo[user_passport_num].user_account_status = "unverified" ;
        userPassportNo[user_passport_num].user_passport_name = user_passport_name ;
        userPassportNo[user_passport_num].user_passport_link = user_passport_link ;
    } 
    
    function updatePassword (string memory user_passport_num, string memory new_user_password, string memory secret_key) public {
        require (keccak256(abi.encodePacked(userPassportNo[user_passport_num].user_passport_num)) == keccak256(abi.encodePacked(user_passport_num)), "Error! User not registered or wrong passport number entered.");
        require (keccak256(abi.encodePacked(userPassportNo[user_passport_num].user_account_status)) != keccak256(abi.encodePacked("suspended")), "Error! Your account is banned");
        require (keccak256(abi.encodePacked(userPassportNo[user_passport_num].secret_key)) == keccak256(abi.encodePacked(secret_key)), "Error! Invalid secret key. Please try again.");
        bytes32 user_password1 = keccak256(abi.encodePacked(new_user_password));
        userPassportNo[user_passport_num].user_password = user_password1 ;  
    }
    
    function suspendUser ( uint user_id) public {
        string memory passNum = getPassportNoById(user_id);
        userPassportNo[passNum].user_account_status = "suspended";
    }
    
    function login( string memory user_passport_num, string memory user_password) public view returns (uint, string memory, string memory) {
        require (keccak256(abi.encodePacked(userPassportNo[user_passport_num].user_passport_num)) == keccak256(abi.encodePacked(user_passport_num)), "Error! User not registered or wrong passport number entered.");
        require (keccak256(abi.encodePacked(userPassportNo[user_passport_num].user_account_status)) != keccak256(abi.encodePacked("suspended")), "Error! The account is banned.");
        bytes32 user_password1 = keccak256(abi.encodePacked(user_password));
        require (keccak256(abi.encodePacked(userPassportNo[user_passport_num].user_password)) == keccak256(abi.encodePacked(user_password1)), "Error! Invalid password. Please try again.");
        return (userPassportNo[user_passport_num].user_id, userPassportNo[user_passport_num].user_account_status, userPassportNo[user_passport_num].user_email);
    }
    
    function getUnverifiedUser( uint user_id) public view returns ( string memory, string memory, string memory, string memory ) {
        string memory passNum = getPassportNoById(user_id);
        require(keccak256(abi.encodePacked(userPassportNo[passNum].user_account_status)) == keccak256(abi.encodePacked("unverified")), "Error! User is already verified/rejected");
        return (userPassportNo[passNum].user_email, userPassportNo[passNum].user_passport_num, userPassportNo[passNum].user_passport_name, userPassportNo[passNum].user_passport_link);
    }
    
    function verifyUser( uint user_id, string memory user_account_status) public {
       string memory passNum = getPassportNoById(user_id);
       userPassportNo[passNum].user_account_status = user_account_status;
    }
    
    string admin_name = "admin";
    bytes32 admin_pass = keccak256(abi.encodePacked("pass"));
    
    
    function adminLogin (string memory a_name, string memory a_pass) public view returns (string memory) {
        require (keccak256(abi.encodePacked(admin_name)) == keccak256(abi.encodePacked(a_name)), "Error! Invalid admin name");
        bytes32 a_pass1 = keccak256(abi.encodePacked(a_pass));
        require (keccak256(abi.encodePacked(admin_pass)) == keccak256(abi.encodePacked(a_pass1)), "Error! Invalid admin password");
        return ("Success");
    }
    
}