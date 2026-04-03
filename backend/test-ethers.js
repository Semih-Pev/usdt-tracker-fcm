const { ethers } = require('ethers');

async function test() {
  console.log("Connecting to Ethereum...");
  const provider = new ethers.JsonRpcProvider('https://eth.llamarpc.com');
  const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  const usdtAbi = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
  const contract = new ethers.Contract(usdtAddress, usdtAbi, provider);

  console.log('Listening for transfers...');
  let count = 0;
  contract.on('Transfer', (from, to, value) => {
    count++;
    console.log(`[${count}] Transfer: ${ethers.formatUnits(value, 6)} USDT`);
    if (count > 5) process.exit(0);
  });
}

test().catch(console.error);
