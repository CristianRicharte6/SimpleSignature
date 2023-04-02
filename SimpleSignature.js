const ethers = require("ethers");
require("dotenv").config();

const simpleSignature = async () => {
  // Instance Signer from Private key
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

  const message = "This is the way!";
  // Sign message from the private key instance.
  const signature = await wallet.signMessage(message);

  console.log(`Message signed is: ${message}`);
  console.log(`Signed message is: ${signature}`);

  // We can get the Public key from the message + signature
  const signerPublicAddr = ethers.verifyMessage(message, signature);
  console.log(`The Public Key of the signer is: ${signerPublicAddr}`);

  if (signerPublicAddr === process.env.PUBLIC_KEY) {
    console.log("You are the signer of the message! :)");
  } else {
    console.log("Does not look like you are the signer of the message! :(");
  }
};

simpleSignature();
