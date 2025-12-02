// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/PreshotBadges.sol";
import "../src/PreshotCredentials.sol";

contract DeployContracts is Script {
    function run() external returns (address badges, address credentials) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deployer:", deployer);
        console.log("Starting deployment to Base Sepolia...");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy PreshotBadges
        console.log("Deploying PreshotBadges...");
        PreshotBadges badgesContract = new PreshotBadges();
        badges = address(badgesContract);
        console.log("PreshotBadges deployed at:", badges);
        
        // Deploy PreshotCredentials
        console.log("Deploying PreshotCredentials...");
        PreshotCredentials credentialsContract =  new PreshotCredentials(badges);
        credentials = address(credentialsContract);
        console.log("PreshotCredentials deployed at:", credentials);
        
        // Grant necessary roles
        console.log("Granting MINTER_ROLE to PreshotCredentials...");
        badgesContract.grantMinterRole(credentials);
        
        console.log("Granting AI_SUBMITTER_ROLE to deployer...");
        credentialsContract.grantAISubmitterRole(deployer);
        
        vm.stopBroadcast();
        
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("PreshotBadges:", badges);
        console.log("PreshotCredentials:", credentials);
        console.log("Basescan:");
        console.log("  Badges:", string(abi.encodePacked("https://sepolia.basescan.org/address/", vm.toString(badges))));
        console.log("  Credentials:", string(abi.encodePacked("https://sepolia.basescan.org/address/", vm.toString(credentials))));
    }
}
