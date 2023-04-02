const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VerifySig", function () {
  async function deployment() {
    const [account0, account1] = await ethers.getSigners();
    // Message to sign
    const message = "This is the way!";

    const signedMessage = await account0.signMessage(message);

    const VerifySig = await ethers.getContractFactory("VerifySig");
    const verifySig = await VerifySig.deploy();
    await verifySig.deployed();

    return { account0, account1, verifySig, signedMessage, message };
  }

  describe("Deployment", function () {
    it("", async function () {
      const { account0, account1, verifySig, signedMessage, message } =
        await loadFixture(deployment);

      const HashedMessage = await verifySig
        .connect(account0)
        .getMessageHashed(message);

      expect(
        await verifySig.verify(account0.address, HashedMessage, signedMessage)
      ).to.equal(true);
    });
  });
});
