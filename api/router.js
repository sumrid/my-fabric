const express = require('express');
const router = express.Router();
const conntorller = require('./controller')

router.get('/query/:key', async (req, res) => {
    let key = req.params.key;

    const result = await conntorller.query(key);

    // JSON.stringify() เปลี่ยน object เป็น string
    // JSON.parse() เปลี่ยน json form เป็น object
    res.send(JSON.parse(JSON.stringify(result)));
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
    res.json(userList);
})

module.exports = router;