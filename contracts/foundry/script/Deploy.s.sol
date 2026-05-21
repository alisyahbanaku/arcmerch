// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ArcMerchNFT.sol";

/**
 * @title DeployArcMerch
 * @notice Deploy ArcMerchNFT to Arc Testnet
 * @dev Run: forge script script/Deploy.s.sol --rpc-url arc_testnet --broadcast --verify
 */
contract DeployArcMerch is Script {
    // Arc Testnet addresses
    address constant USDC = 0x3600000000000000000000000000000000000000;
    address constant TREASURY = 0x7e860fb6515D8c250d67c26F54D0a3c217cA05Ac;

    // Mint price: 5 USDC (6 decimals)
    uint256 constant MINT_PRICE = 5 * 1e6;

    function run() external {
        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        ArcMerchNFT nft = new ArcMerchNFT(USDC, TREASURY, MINT_PRICE);

        vm.stopBroadcast();

        console.log("=========================================");
        console.log("ArcMerchNFT deployed!");
        console.log("=========================================");
        console.log("Contract address:", address(nft));
        console.log("USDC address:    ", USDC);
        console.log("Treasury address:", TREASURY);
        console.log("Mint price:      5 USDC");
        console.log("=========================================");
    }
}
