const WebSocket = require('ws');
const EventEmitter = require('events');
const { rejects } = require('assert');
const signal = new EventEmitter();

const ws = new WebSocket('ws://127.0.0.1:8010');

ws.on('open',()=>{
    console.log('连接成功')
});

ws.on('message',(message)=>{
    let data;
    try {
        data = JSON.parse(message)
    } catch (error) {
        console.log('err',error);
    };
    signal.emit(data.event,data.data);
})

function send(event,data) {
    ws.send(JSON.stringify({event,data}));
}
function invoke (event,data,answerEvent) {
    return new Promise((resolve,reject)=>{
        send(event,data);
        signal.once(answerEvent,resolve);
        setTimeout(()=>{
            reject('timeout')
        },5000)
    })
}
signal.send = send;
signal.invoke = invoke;
module.exports = signal;