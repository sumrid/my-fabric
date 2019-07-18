const express = require('express');
const router = express.Router();
const conntorller = require('./controller')

router.get('/query/:key', async (req, res) => {
    let key = req.params.key;

    const result = await conntorller.query(key);

    // JSON.stringify() เปลี่ยน object เป็น string
    // JSON.parse() เปลี่ยน json form เป็น object
    res.json(JSON.parse(JSON.stringify(result)));
});

router.get('/transfer/:from/:to/:amount', async (req, res) => {
    let from = req.params.from;
    let to = req.params.to;
    let amount = req.params.amount;

    const result = await conntorller.transfer(from, to, amount);
    res.send(result);
});

router.post('/add', async (req, res) => {
    const userList = req.body;
    const result = await conntorller.add(userList);
    res.json(result);
});

router.post('/create/user', async (req, res) => {
    const user = req.body;
    const result = await conntorller.createUser(user);
    res.json(result);
});

router.post('/create/wallet', async (req, res) => {
    const wallet = req.body;

    try {
        const result = await conntorller.createWallet(wallet);
        res.json(result);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/test', async (req, res) => {
    try {
        const result = await conntorller.test();
        res.json(result);
    } catch (err) {
        res.status(500).send(err);
    }
})

module.exports = router;