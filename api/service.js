const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

// ทำการอ่านไฟล์ connection.json
const ccpPath = path.resolve(__dirname, 'connection.json');
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

exports.test = async () => {
    try {
        // Get channel, client
        const gateway = await getGateway(USER);
        const network = await gateway.getNetwork(CHANNEL);
        const channel = network.getChannel();
        const client = gateway.getClient();

        // Create tx request poprosal
        const txID = client.newTransactionID();
        const txID_string = txID.getTransactionID();
        const request = {
            targets: ['peer0.org1.example.com', 'peer0.org2.example.com'],
            chaincodeId: CONTRACT,
            fcn: FN_QUERY,
            args: ['stdID|59070174'],
            chainId: CHANNEL,
            txId: txID
        }

        // Send and recive response
        const results = await channel.sendTransactionProposal(request);

        // ตรวจสอบผลลัพธ์
        var proposalResponses = results[0];
        var proposal = results[1];
        let isProposalGood = false;
        if (proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200) {
            isProposalGood = true;
            console.log('Transaction proposal was good');
        } else {
            console.error('Transaction proposal was bad');
        }

        // ถ้า proposal ผ่าน
        if (isProposalGood) {
            let promises = [];

            // Get event hub
            // และสร้าง promise event
            let eventHubs = channel.getChannelEventHubsForOrg();
            eventHubs.forEach((eventHub) => {
                console.log(eventHub);
                let eventPromise = new Promise((resolve, reject) => {
                    function whenTimeout() {
                        console.info('Event timeout');
                        eventHub.unregisterTxEvent(txID_string);
                        eventHub.disconnect();
                        reject();
                    }
                    let eventTimeout = setTimeout(whenTimeout, 20000);

                    // รอรับ event
                    // พร้อมกับใส่ callback เพื่อให้รู้ว่าเมื่อได้ event จะทำอะไรต่อ
                    eventHub.registerTxEvent(txID_string, (tx_id, code) => {
                        clearTimeout(eventTimeout);
                        eventHub.unregisterTxEvent(txID_string);

                        console.log('Successfully received the tx event');
                        resolve(tx_id, code);
                    });

                    eventHub.connect();
                });

                promises.push(eventPromise);
            });

            // ส่ง transaction
            const requestTx = {
                txId: txID,
                proposalResponses: proposalResponses,
                proposal: proposal
            }
            const sendPromise = channel.sendTransaction(requestTx);
            promises.push(sendPromise);

            return Promise.all(promises);
        } else {
            return new Error('Transaction proposal was bad ' + results);
        }

        // return txID.getTransactionID();
    } catch (err) {
        console.error(err);
        throw err;
    }
}
