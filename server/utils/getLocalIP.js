import os from 'os';

/**
 * Obtenir l'ip du serveur sur le réseau local
 */
const getLocalIP = () => {
    const interfaces = os.networkInterfaces()
    //console.log(interfaces)

    for (const interfaceName in interfaces) {
        if (!/wi[-]?fi|wlan/i.test(interfaceName)) continue;

        const iface = interfaces[interfaceName]
        //console.log(`iface : ${iface}`) // DEBUG

        for (const alias of iface) {
            //console.log(`alias family : ${alias.family}`) // DEBUG
            //console.log(`alias internal : ${alias.internal}`) // DEBUG
            if (alias.family === 'IPv4' && !alias.internal && alias.address.startsWith('192.')) {
                //console.log(`alias address : ${alias.address}`) // DEBUG
                return alias.address
            }
        }
    }

    return '127.0.0.1'; // fallback
}

export default getLocalIP()