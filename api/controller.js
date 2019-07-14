const service = require('./service')

exports.query = async key => {
    // ทำการดึงข้อมูลมาจาก blockchain
    const result = await service.query(key);

    // Check error
    if (result instanceof Error) {
        console.error(result);
        return result;
    }

    let res = {
        "key": key,
        "result": String(result)
    };
    return res;
}

exports.transfer = async (from, to, amout = 0) => {
    const result = await service.transfer(from, to, amout);

    // Check error
    if (result instanceof Error) {
        console.error(result);
        return result;
    }
    return result;
}

exports.add = async (userLists) => {
    const result = await service.add(userLists[0], userLists[1]);
    return result;
}

exports.createUser = async (user) => {
    const result = await service.createUser(user.stdID, user.name, user.tel, user.status);

    // Check error
    if (result instanceof Error) {
        console.error(result);
        return result;
    }

    return String(result);
}

exports.createWallet = async (wallet) => {
    try {
        const result = await service.createWallet(wallet);
        return String(result);
    } catch (err) {
        throw err
    }
}