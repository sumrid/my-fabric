const controller = require('../src/controller');
const service = require('../src/service');
const sinon = require('sinon');
const expect = require('chai').expect;

describe('Test controller.js', () => {
    // beforeEach(()=> {
    //     // Create stub
    //     const stubService = {};
    //     stubService.query = sinon.stub();

    //     let queryResult = {"message": "Hello world"}
    //     stubService.query.withArgs('testKey')
    //         .returns(Buffer.from(JSON.stringify(queryResult)));
    //     sandbox.replace(service, 'query', stubService.query);
    // });


    // Create stub
    const stubService = {};
    stubService.query = sinon.stub();
    stubService.createUser = sinon.stub();
    stubService.createWallet = sinon.stub();


    it('Test get success', async () => {
        // Arrange
        const resultStub = { "message": "Hello world" };
        stubService.query.withArgs('testKey')
            .returns(Buffer.from(JSON.stringify(resultStub)));
        sinon.replace(service, 'query', stubService.query);

        // Act
        const result = await controller.query('testKey');
        console.log(result);

        // Assert
        expect(result.key).equal('testKey');
        expect(result.result.message).equal('Hello world');
    });

    it('Test create user success', async () => {
        // Arrange
        let id = '001';
        let name = 'sumrid';
        let tel = '0899999999';
        let status = 'true';
        const user = { stdID: id, name: name, tel: tel, status: status };
        stubService.createUser.withArgs(id, name, tel, status)
            .returns(Buffer.from(JSON.stringify(user)));
        sinon.replace(service, 'createUser', stubService.createUser);

        // Act
        const result = await controller.createUser(user);
        console.log(result);

        // Assert
        expect(result).eql(user);
    });

    it('Test create wallet success', async () => {
        // Arrange
        let walletName = "my-wallet";
        let money = "5000";
        let owner = "sumrid";
        const wallet = { walletName: walletName, money: money, owner: owner };
        stubService.createWallet.withArgs(wallet)
            .returns(Buffer.from(JSON.stringify(wallet)));
        sinon.replace(service, 'createWallet', stubService.createWallet);

        // Act
        const result = await controller.createWallet(wallet);
        console.log(result);

        // Assert
        expect(result).eql(wallet);
    });
});