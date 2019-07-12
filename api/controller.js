const service = require('./service')

exports.query = async key => {
    // ทำการดึงข้อมูลมาจาก blockchain
    const result = await service.query(key);
    
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

exports.transfer = async (from, to, amout=0) => {
    const result = await service.transfer(from, to, amout);

    if (result instanceof Error) {
        console.error(result);
        return result;
    }
    return result;
}

exports.add = async (userLists) => {
    const result = service.add(userLists[0], userLists[1]);
    return result;
}
