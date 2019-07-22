const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/main');
const mock = require('./mockData');
const sinon = require('sinon');
const should = chai.should();
const controller = require('../src/controller');

chai.use(chaiHttp);

describe('Test API', () => {

    // Create stub
    const controllerStub = {};
    controllerStub.query = sinon.stub();
    controllerStub.createUser = sinon.stub();
    controllerStub.createWallet = sinon.stub();

    afterEach(() => {
        sinon.restore();
    });

    it('Test query success', (done) => {
        // Arrange
        let res = mock.queryResult;
        res.key = "someKey";
        controllerStub.query.withArgs('someKey')
            .returns(res);
        sinon.replace(controller, 'query', controllerStub.query);

        // Act
        chai.request(server)
            .get('/api/query/someKey')
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.key.should.be.eql('someKey');
                done();
            })
    });

    it('Test create user success', (done) => {
        // Arrange
        let user = mock.user;
        controllerStub.createUser.withArgs(user)
            .returns(user);
        sinon.replace(controller, 'createUser', controllerStub.createUser);

        // Act
        chai.request(server)
            .post('/api/create/user')
            .send(user)
            .end((err, res) => {
                res.status.should.equal(200);
                res.body.stdID.should.equal('001');
                done();
            });
    });

    it('Test create wallet success', (done) => {
        let wallet = mock.wallet;
        controllerStub.createWallet.withArgs(wallet)
            .returns(wallet);
        sinon.replace(controller, 'createWallet', controllerStub.createWallet);

        // Act
        chai.request(server)
            .post('/api/create/wallet')
            .send(wallet)
            .end((err, res) => {
                res.status.should.eqls(200);
                done();
            });
    });

    it('Test create wallet fails', (done) => {
        let wallet = mock.wallet;
        controllerStub.createWallet.withArgs(wallet)
            .throwsException('some error');
        sinon.replace(controller, 'createWallet', controllerStub.createWallet);

        // Act
        chai.request(server)
            .post('/api/create/wallet')
            .send(wallet)
            .end((err, res) => {
                res.status.should.equal(500);
                done();
            });
    });
});