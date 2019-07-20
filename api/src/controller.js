const service = require('./service')

exports.query = async key => {
    try {
        // ทำการดึงข้อมูลมาจาก blockchain
        const result = await service.query(key);

        // ส่งผลลัพธ์กลับไป
        let res = {
            "key": key,
            "result": JSON.parse(String(result))
        };
        return res;
    } catch (err) {
        throw err;
    }
}

exports.createUser = async (user) => {
    try {
        const result = await service.createUser(user.stdID, user.name, user.tel, user.status);
        return JSON.parse(String(result));
    } catch (err) {
        throw err;
    }
}

exports.createWallet = async (wallet) => {
    try {
        const result = await service.createWallet(wallet);
        return JSON.parse(String(result));
    } catch (err) {
        throw err;
    }
}

// ################
//    Test zone
// ################
exports.test = async () => {
    try {
        const txID = await service.test();
        return txID;
    } catch (err) {
        throw err;
    }
}

exports.query2 = async (query) => {
    try {
        const result = await service.query2(query);
        return JSON.parse(String(result));
    } catch (err) {
        throw err;
    }
}