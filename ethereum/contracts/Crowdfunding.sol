// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;
contract CampaignFact{
    
    address[] deployedCampaigns;
    
    uint campaignCounter;
    
    function createCampaign(uint user_id, string memory campaign_title, string memory campaign_description, string memory imageHash, uint fund_amount, string memory campaign_ttl, string memory user_mail) public {
        address newCampaign = address (new Campaign( user_id, campaign_title, campaign_description, imageHash, fund_amount, "0", campaign_ttl, msg.sender, user_mail));
        deployedCampaigns.push(newCampaign);
        campaignCounter++;
    }
    
    function getDeployedCampaigns() public view returns (address[] memory) {
        return (deployedCampaigns);
    }
    
    function getCampaignCount () public view returns (uint) {
        return (campaignCounter);
    }
}

contract Campaign {
    
    uint user_id;
    string campaign_title;
    string campaign_description;
    string imageHash;
    uint fund_amount;
    string amount_raised;
    string campaign_ttl;
    address campaign_metamask_address;
    string user_mail;
    
    constructor ( uint u_id, string memory c_title, string memory c_description, string memory imgHash, uint f_amount, string memory a_raised, string memory c_ttl, address c_metamask_address, string memory u_mail) {
        user_id = u_id;
        campaign_title = c_title;
        campaign_description = c_description;
        imageHash = imgHash;
        fund_amount = f_amount;
        amount_raised = a_raised;
        campaign_ttl = c_ttl;
        campaign_metamask_address = c_metamask_address;
        user_mail = u_mail;
    }
    
    function getCampaignDetails () public view returns ( uint, string memory, string memory, string memory, uint, string memory, string memory, address, string memory) {
        return ( user_id, campaign_title, campaign_description, imageHash, fund_amount, amount_raised, campaign_ttl, campaign_metamask_address, user_mail);
    }
    
   struct campaignTransaction {
        uint sender_id;
        address donator_metamask_address;
        uint amount;
    }
    
    uint transactionCount;
    
    mapping(uint => campaignTransaction) transaction;
    
    function donate (uint sender_id, string memory a_raised) public payable{
        transactionCount++;
        transaction[transactionCount] = campaignTransaction( sender_id, msg.sender, msg.value);
        payable(campaign_metamask_address).transfer(msg.value);
        amount_raised = a_raised;
    }
        
    function getTransactionCount () public view returns (uint) {
        return (transactionCount);
    }
    
    function getTransaction (uint transaction_id) public view returns (uint, address, uint) {
        return (transaction[transaction_id].sender_id, transaction[transaction_id].donator_metamask_address, transaction[transaction_id].amount);
    }
    
}