const controller = require('../src/controller');
const service = require('../src/service');
const mock = require('./mockData');
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

    afterEach(() => {
        sinon.restore();
    });

    // Create stub
    const stubService = {};
    stubService.query = sinon.stub();
    stubService.createUser = sinon.stub();
    stubService.createWallet = sinon.stub();

    it('Test query success', async () => {
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
        const user = mock.user;
        stubService.createUser.withArgs(user.stdID, user.name, user.tel, user.status)
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
        const wallet = mock.wallet;
        stubService.createWallet.withArgs(wallet)
            .returns(Buffer.from(JSON.stringify(wallet)));
        sinon.replace(service, 'createWallet', stubService.createWallet);

        // Act
        const result = await controller.createWallet(wallet);
        console.log(result);

        // Assert
        expect(result).eql(wallet);
    });

    it('Test query fails', async () => {
        stubService.query.withArgs('testKey').throws('something');
        sinon.replace(service, 'query', stubService.query);

        try {
            const result = await controller.query('testKey');
            console.log(result);
        } catch (err) {
            console.log(err);
            expect(String(err)).eql('something');
        }
    });

    it('Test create user fails', async () => {
        const user = mock.user;
        stubService.createUser
            .withArgs(user.stdID, user.name, user.tel, user.status)
            .throws('something');
        sinon.replace(service, 'createUser', stubService.createUser);

        try {
            await controller.createUser(user);
            console.log(result);
        } catch (err) {
            console.log(err);
            expect(String(err)).eql('something');
        }
    });

    it('Test create wallet fails', async ()=> {
        // Arrange
        const wallet = mock.wallet;
        stubService.createWallet.withArgs(wallet)
            .throws('something')
        sinon.replace(service, 'createWallet', stubService.createWallet);

        // Act
        try {
            await controller.createWallet(wallet);
        } catch (err) {
            // Assert
            console.log(err);
            expect(String(err)).eql('something');
        }
    });

});