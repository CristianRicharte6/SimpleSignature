const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VerifySig", function () {
  async function deployment() {
    const [signer, account1] = await ethers.getSigners();

    const VerifySig = await ethers.getContractFactory("VerifySig");
    const verifySig = await VerifySig.deploy();
    await verifySig.deployed();

    // 1) Hash message to sign.
    const message = "This is the way!";
    const to = "0x4B229Ed260cc6AA763c17C412162d46f2b4caF52";
    const amount = 0;
    const nonce = 0;

    const hashedMessage = await verifySig.getMessageHash(
      to,
      amount,
      message,
      nonce
    );

    // 2) Sign message hashed.
    const signedMessage = await verifySig.getEthSignedMessageHash(
      hashedMessage
    );

    console.log("Lenght: ", signedMessage.length);
    console.log(signedMessage);

    return {
      signer,
      account1,
      verifySig,
      signedMessage,
      hashedMessage,
      message,
      to,
      amount,
      nonce,
    };
  }

  describe("Deployment", function () {
    it("Verify signature", async function () {
      const {
        signer,
        account1,
        verifySig,
        signedMessage,
        hashedMessage,
        message,
        to,
        amount,
        nonce,
      } = await loadFixture(deployment);

      const result = await verifySig.verify(
        signer.address,
        to,
        amount,
        message,
        nonce,
        signedMessage
      );

      expect(await verifySig.verify(result)).to.equal(true);
    });
  });
});
