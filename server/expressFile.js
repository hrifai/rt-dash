//node server express implementation
const express = require('express');
const app = express();

//use cors origin policy headers
var cors = require('cors');
app.use(cors());
app.use(cors({
    origin: 'http://localhost:8080'
}));

const port = 3000;

//client from tp-link library to connect to local device instances
const { Client } = require('tplink-smarthome-api');
const client = new Client();

//microsoft weather js lib for dash
const weather = require('weather-js');

// as client.startDiscovery only 'discovers' devices on instantiation
// we need to keep a stack-memory based version of the device object
// in order to keep this current we set listeners for power-on and off on the device
// when these are run they update the device state in memory

var sessionDevices = [];

client.startDiscovery().on("device-new", async (device) => {
    var currentState = await device.getPowerState();

    //NOTE: Add case to check if device already added

    //on discovery push the device to the the memory array
    sessionDevices.push({
        alias: device.alias.split(';')[0],
        ip: device.host,
        icon: device.alias.split(';')[1],
        lastState:currentState
    });

    //set listeners to update state on power change
    var listenTo = [{
        state: 'power-on',
        callback: (device) => {getDeviceFromMemory(device.host).lastState = true},
    },
    {
        state: 'power-off',
        callback: (device) => {getDeviceFromMemory(device.host).lastState = false},
    }];

    listenTo.forEach(instruction => {
        device.on(instruction.state,instruction.callback);
    })

});


setTimeout( () => {
    client.stopDiscovery();
},1000);

app.get('/toggle', async (req, res) => {
    var ip = req.param('ip');
    var device = getDeviceFromMemory(ip);
    var currentState = await device.getPowerState();
    device.setPowerState(!currentState);
    res.send({
        currentState: !currentState,
        host: ip,
        time: new Date()
    })
});

app.get('/get-all-devices', (req, res) => {

    //previous to device listener change for updating session object

    // sessionDevices.forEach(async (dev) => {
    //     var raw = await client.getDevice({host:dev.ip});
    //     dev.lastState = await raw.getPowerState();
    // });
    res.send(sessionDevices);
});


app.get('/weather', async (req, res) => {
    var city = req.param('city');
    weather.find({search:city,degreeType:'C'}, (err,results) => {
        if(err){
            console.log(err);
        } else {
            res.send({current:results[0].current,forecast:results[0].forecast});
        }
    })
});

app.listen(port, () => console.log(`[RT] server listening on port ${port}!`));


// ********* UTIL FUNCTIONS **********
// These are going to be refactored into a utils file

function getDeviceFromMemory(deviceIp){
    return sessionDevices.filter(dev => deviceIp === ip)[0];
}