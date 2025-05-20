import { ethers } from "./ethers-6.7.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const withdrawButton = document.getElementById("withdrawButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const statusDiv = document.getElementById("status");
const balanceDisplay = document.getElementById("balanceDisplay");

connectButton.onclick = connect;
withdrawButton.onclick = withdraw;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;

const getOwnerButton = document.createElement("button");
getOwnerButton.id = "getOwnerButton";
getOwnerButton.textContent = "Get Owner";
const getVersionButton = document.createElement("button");
getVersionButton.id = "getVersionButton";
getVersionButton.textContent = "Get Version";
const getPriceFeedButton = document.createElement("button");
getPriceFeedButton.id = "getPriceFeedButton";
getPriceFeedButton.textContent = "Get Price Feed";
const getFunderButton = document.createElement("button");
getFunderButton.id = "getFunderButton";
getFunderButton.textContent = "Get Funder (index)";
const getAddressToAmountFundedButton = document.createElement("button");
getAddressToAmountFundedButton.id = "getAddressToAmountFundedButton";
getAddressToAmountFundedButton.textContent = "Get Amount Funded (address)";

// Insert new buttons into the DOM after balanceButton
const card = document.querySelector(".card");
card.appendChild(getOwnerButton);
card.appendChild(getVersionButton);
card.appendChild(getPriceFeedButton);
card.appendChild(getFunderButton);
card.appendChild(getAddressToAmountFundedButton);

getOwnerButton.onclick = getOwner;
getVersionButton.onclick = getVersion;
getPriceFeedButton.onclick = getPriceFeed;
getFunderButton.onclick = getFunder;
getAddressToAmountFundedButton.onclick = getAddressToAmountFunded;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      connectButton.innerHTML = "Connected";
      statusDiv.innerHTML = "Wallet connected.";
    } catch (error) {
      statusDiv.innerHTML = "Connection failed.";
      console.log(error);
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask";
    statusDiv.innerHTML = "MetaMask not detected.";
  }
}

async function withdraw() {
  statusDiv.innerHTML = `Withdrawing...`;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.withdraw();
      await transactionResponse.wait(1);
      statusDiv.innerHTML = "Withdraw successful!";
    } catch (error) {
      statusDiv.innerHTML = "Withdraw failed.";
      console.log(error);
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask";
    statusDiv.innerHTML = "MetaMask not detected.";
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  statusDiv.innerHTML = `Funding with ${ethAmount} ETH...`;
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.parseEther(ethAmount),
      });
      await transactionResponse.wait(1);
      statusDiv.innerHTML = `Funded with ${ethAmount} ETH!`;
    } catch (error) {
      statusDiv.innerHTML = "Funding failed.";
      console.log(error);
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask";
    statusDiv.innerHTML = "MetaMask not detected.";
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      balanceDisplay.innerHTML = `Contract Balance: ${ethers.formatEther(
        balance
      )} ETH`;
    } catch (error) {
      balanceDisplay.innerHTML = "Could not fetch balance.";
      console.log(error);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
    balanceDisplay.innerHTML = "MetaMask not detected.";
  }
}

async function getOwner() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    try {
      const owner = await contract.getOwner();
      statusDiv.innerHTML = `Owner: ${owner}`;
    } catch (error) {
      statusDiv.innerHTML = "Could not fetch owner.";
      console.log(error);
    }
  }
}

async function getVersion() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    try {
      const version = await contract.getVersion();
      statusDiv.innerHTML = `Version: ${version}`;
    } catch (error) {
      statusDiv.innerHTML = "Could not fetch version.";
      console.log(error);
    }
  }
}

async function getPriceFeed() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    try {
      const priceFeed = await contract.getPriceFeed();
      statusDiv.innerHTML = `Price Feed: ${priceFeed}`;
    } catch (error) {
      statusDiv.innerHTML = "Could not fetch price feed.";
      console.log(error);
    }
  }
}

async function getFunder() {
  const index = prompt("Enter funder index:");
  if (typeof window.ethereum !== "undefined" && index !== null) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    try {
      const funder = await contract.getFunder(index);
      statusDiv.innerHTML = `Funder at index ${index}: ${funder}`;
    } catch (error) {
      statusDiv.innerHTML = "Could not fetch funder.";
      console.log(error);
    }
  }
}

async function getAddressToAmountFunded() {
  const address = prompt("Enter funder address:");
  if (typeof window.ethereum !== "undefined" && address) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, abi, provider);
    try {
      const amount = await contract.getAddressToAmountFunded(address);
      statusDiv.innerHTML = `Amount funded by ${address}: ${ethers.formatEther(
        amount
      )} ETH`;
    } catch (error) {
      statusDiv.innerHTML = "Could not fetch amount funded.";
      console.log(error);
    }
  }
}
