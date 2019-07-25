const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const AFFILIATION = 'org3.department1';
const WALLET_NAME = 'wallet3';
const ADMIN = 'admin';

async function main() {
    try {
        // Create a new file system based wallet for managing identities.
        // Path ./src/wallet...
        const walletPath = path.join(process.cwd(), 'src', WALLET_NAME);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: ADMIN, discovery: { enabled: false } });
    
        // Get the CA client object from the gateway for interacting with the CA.
        // จะเรียก client ที่กำหนดไว้ใน connection.json**
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // สร้าง org3.department1
        await ca.newAffiliationService().create({name: AFFILIATION}, adminIdentity);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();