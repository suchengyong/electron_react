const WebSocket = require('ws');
const wss = new WebSocket.Server({port:8010});
const code2ws = new Map();
wss.on('connection',(ws,request)=>{
    let code = Math.floor(Math.random()*(999999-100000))+100000
    code2ws.set(code,ws);
    ws.sendData = (event,data) => {
        ws.send(JSON.stringify({event,data}));
    }
    ws.on('message',(message)=>{
        console.log('message',message);
        let parsedMessage = {};
        try {
            parsedMessage = JSON.parse(message);
        } catch (err) {
            ws.sendError('message invalid');
            console.log('parse message',err);
            return;
        }
        let {event,data} = parsedMessage;
        if(event === 'login') {
            ws.sendData('logined',{code});
        }else if(event === 'control') {
            let remote = +data.remote;
            if(code2ws.has(remote)) {
                ws.sendData('controlled',{remote});
                ws.sendRemote = code2ws.get(remote).sendData;
                ws.sendData('be-controlled',{remote:code});
            }
        }else if (event === 'forward') {
            ws.sendData(data.event,data.data);
        }
    });
    ws.on('close',()=>{
        code2ws.delete(code);
        clearTimeout(ws.closeTimeout);
    })
    
    ws.closeTimeout = setTimeout(()=>{
        ws.terminate();
    },10*60*1000);
})
