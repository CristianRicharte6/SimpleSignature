const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const ethers = require("ethers");

describe("VerifySig", function () {
  async function deployment() {
    const accounts = await ethers.getSigners();

    // Message to sign
    const message = "This is the way!";

    const signedMessage = await accounts[0].signMessage(message);

    const VerifySig = await ethers.getContractFactory("VerifySig");
    const verifySig = await VerifySig.deploy();
    await verifySig.deployed();

    return { accounts, verifySig, signedMessage, message };
  }

  describe("Deployment", function () {
    it("", async function () {
      const { accounts, verifySig, signedMessage, message } = await loadFixture(
        deployment
      );

      const HashedMessage = await verifySig
        .connect(accounts[0])
        .getMessageHashed(message);

      expect(
        await verifySig.verify(accounts[0].address, HashedMessage, signedMessage)
      ).to.be(true);
    });
  });
});
