/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const WALLET_NAME = 'wallet3';
const ADMIN = 'admin';
const USER = 'sumrid.klinkanha.org3';
const AFFILIATION = 'org3.department1';
const MSP = 'Org3MSP';

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'src', WALLET_NAME);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        // ตรวจสอบว่ามี user อยู่แล้วหรือไม่
        const userExists = await wallet.exists(USER);
        if (userExists) {
            console.log(`An identity for the user ${USER} already exists in the wallet`);
            return;
        }

        // Check to see if we've already enrolled the admin user.
        // เป็นการเรียก admin user ออกมา
        const adminExists = await wallet.exists(ADMIN);
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        // มีการอ่าน connection profile ที่ได้จาก connection.json
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: ADMIN, discovery: { enabled: false } });

        // Get the CA client object from the gateway for interacting with the CA.
        // จะเรียก client ที่กำหนดไว้ใน connection.json**
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        // 1. register
        // 2. enroll
        const secret = await ca.register({ affiliation: AFFILIATION, enrollmentID: USER, role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: USER, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity(MSP, enrollment.certificate, enrollment.key.toBytes());
        wallet.import(USER, userIdentity);
        console.log(`Successfully registered and enrolled admin user "${USER}" and imported it into the wallet`);

    } catch (error) {
        console.error(`Failed to register user "${USER}": ${error}`);
        process.exit(1);
    }
}

main();
