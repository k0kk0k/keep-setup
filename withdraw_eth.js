const fs = require('fs');
const ethers = require('ethers');

const KeepBonding = require("@keep-network/keep-ecdsa/artifacts/KeepBonding.json")

if (process.argv.length < 3 || !process.argv[2]) {
	console.error('node access.js [password]');
	process.exit(1);
}

async function main() {
	let wallet
	try {
		const j = fs.readFileSync('wallet.json', 'utf8');
		const w  = await new ethers.Wallet.fromEncryptedJson(j, process.argv[2]);
		const ip = new ethers.providers.InfuraProvider('ropsten', process.env.INFURA_API);
		wallet = w.connect(ip);

		const keepBondingContract = new ethers.Contract(KeepBonding.networks["3"].address, KeepBonding.abi, wallet);

		const withdraw = await keepBondingContract.withdraw(ethers.utils.parseEther('20.0'), w.address)
		console.log(`withdrawing eth`)
		await withdraw.wait()

	} catch(err) {
		console.error(`Could not authorize: ${err.message}`)
		process.exit(1)
	}
}

main().catch(err => {
	console.error(err);
})
