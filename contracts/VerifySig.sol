// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract VerifySig {


    constructor(){}

    function verify(
        address _signer, 
        string memory _message, 
        bytes memory _signature) public pure returns (bool) {

            // Hash message
            bytes32 messageHashed = getMessageHashed(_message);

            // Hash the standar prefix format + hashed message 
            bytes32 signedMessage = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHashed));

            return recover(signedMessage, _signature) == _signer;
    }

    function getMessageHashed(string memory _message) public pure returns(bytes32){

        return keccak256(abi.encodePacked(_message));
    }

    function recover(bytes32 _signedMessage, bytes memory _signature) public pure returns(address) {

        (bytes32 r, bytes32 s, uint8 v) = _split(_signature);

        //Recover the address associated with the public key from elliptic curve signature 
        // or return zero on error.
        return ecrecover(_signedMessage, v, r, s);
    }

    function _split(bytes memory _signature) internal pure returns( bytes32 r, bytes32 s, uint8 v) {
        // 32 bytes from "r", 32 bytes from "s", 1 byte from "v" (uint8 = 1 byte) === 65 bytes
        require(_signature.length == 65, "Invalid signature length");

        assembly {
            // First 32 bytes are for the pointer in memory.
            // Second 32 bytes are for the "r" in signature. 
            // 32 meas from 32bytes in beyond, as it is a 32 bytes variable, it will save 32 bytes
            r := mload(add(_signature, 32))
            // 32 bytes from the 64 bytes in beyond. 
            s := mload(add(_signature, 64))
            // 1 bytes from 96 bytes. 0 means the first byte
            v := byte(0, mload(add(_signature, 96)))
        }
    }
}