// https://stackoverflow.com/questions/3653065/get-local-ip-address-in-node-js?page=2&tab=active#tab-top
var os = require('os');
var ifaces = os.networkInterfaces();

function getIP() {
    let ipAdds = [];
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return null;
            }

            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                console.log(ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                ipAdds.push(iface.address);
                console.log(ifname, iface.address);
            }
            ++alias;
        });
    });
    console.log(ipAdds);
    return ipAdds[0];
}

module.exports = {
    getIP: getIP
}