const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// ทำการอ่านไฟล์ connection.json
const ccpPath = path.resolve(__dirname, '..', 'network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

// Create a new file system based wallet for managing identities.
const walletPath = path.join(process.cwd(), 'wallet');
const wallet = new FileSystemWallet(walletPath);
console.log(`Wallet path: ${walletPath}`);

const USER = 'user1';
const FN_QUERY = 'query';
const FN_TRANSFER = 'invoke';
const FN_CREATE_USER = 'createUser';
const FN_CREATE_WALLET = 'createWallet';
const FN_INIT = 'init'
const CHANNEL = 'mychannel-1';
const CONTRACT = 'mycc';

async function getGateway(user) {
    try {
        // Check user
        const userExists = await wallet.exists(user);
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });
        return gateway;
    } catch (err) {
        console.error(`Failed to evaluate transaction: ${error}`);
        throw err;
    }
}

// Connect to network then return contract
async function getContract(user) {
    try {
        const gateway = await getGateway(user);
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(CHANNEL);
        // Get the contract from the network.
        return network.getContract(CONTRACT);
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        throw error;
    }
}

async function getChannel(user, channelName) {
    try {
        const gateway = await getGateway(user);
        const network = await gateway.getNetwork(channelName);
        return network.getChannel();
    } catch (err) {

    }
}

// #####################
// #  Query and Invoke
// #####################
exports.query = async (key) => {
    try {
        const contract = await getContract(USER);
        const result = await contract.evaluateTransaction(FN_QUERY, key);
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }

}

exports.transfer = async (from, to, amount) => {
    try {
        const contract = await getContract(USER);
        const result = await contract.submitTransaction(FN_TRANSFER, from, to, amount);
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }
}

exports.add = async (user1, user2) => {
    try {
        const contract = await getContract(USER);
        const result = await contract.submitTransaction(FN_INIT, user1.key, user1.value, user2.key, user2.value);
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }
}

exports.createUser = async (stdID, name, tel, status = false) => {
    try {
        const contract = await getContract(USER);
        const result = await contract.submitTransaction(FN_CREATE_USER, stdID, name, tel, status);
        return result;
    } catch (err) {
        console.error(err);
        return err;
    }
}

exports.createWallet = async (wallet) => {
    try {
        const contract = await getContract(USER);
        const result = await contract.submitTransaction(FN_CREATE_WALLET, wallet.walletName, wallet.money, wallet.owner);
        return result;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
