const { Client } = require('tplink-smarthome-api');

var localDevices = {
    "bathroomMirror": "192.168.0.85",
    "deskLamp": "192.168.0.162"
};

const client = new Client();

async function togglePower(host){
    var device = await getDeviceByHost(host);
    var currentState = await device.getPowerState();
    device.setPowerState(!currentState);
}

async function getDeviceByHost(host){
    return await client.getDevice({host: host})
}

function getAllDevices(){

    return new Promise(resolve => {
        var onlineDevices = [];

        client.startDiscovery().on('device-new', (device) => {
            onlineDevices.push(device);
        });

        setTimeout(function(){
            client.stopDiscovery();
            resolve(onlineDevices);
        }, 5000)
    })
}

var utils = {};

utils.togglePower = togglePower;

export default utils;