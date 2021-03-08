const EventEmitter = require('events');
const peer = new EventEmitter();
const {ipcRenderer,desktopCapturer} = require('electron');
// 捕获桌面流
async function getScreenStream(){
    const sources = await desktopCapturer.getSources({types:['screen']});

    navigator.webkitGetUserMedia({
        audio:false,
        video:{
            mandatory:{
                chromeMediaSource:'desktop',
                chromeMediaSourceId:sources[0].id,
                maxWidth:window.screen.width,
                maxHeight:window.screen.height
            }
        }
    },(stream)=>{
        // 发布事件，发送桌面流
        peer.emit('add-stream',stream);
    },(err)=>{
        console.error(err);
    })
};
//getScreenStream();

// 视频建立传输流
const pc = new window.RTCPeerConnection({});// 事件传输链接创建
// onicecandidate iceEvent
// addIceCandidate

pc.onicecandidate = function(e) {
    console.log('candidate',JSON.stringify(e.candidate));
}

let candidates = [];
// 控制端设置本地生成的candidate
async function addIceCandidate(candidate) {
    if(candidate) {
        candidates.push(candidate)
    }
    if(pc.remoteDescription && pc.remoteDescription.type) {
        for(let i=0;i<candidates.length;i++) {
            await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
        }
        candidates = [];
    }
}
window.addIceCandidate = addIceCandidate;

// 创建一个offer
async function createOffer() {
    const offer = await pc.createOffer({
        offerToReceiveVideo:true,
        offerToReceiveAudio:false,// 不用英频，需要改为true
    });
    await pc.setLocalDescription(offer);
    console.log('pc offer',JSON.stringify(offer));
    return pc.localDescription;
}
createOffer();// 调用
// 接收端传回answer设置上
async function setRemote(answer) {
    await pc.setRemoteDescription(answer);
}
window.setRemote = setRemote;

// 监听传回视频流
pc.onaddstream = function(e) {
    console.log('add stream',e);
    peer.emit('add-stream',e.stream);
}



// peer.on('robot',(type,data)=>{
//     if(type ==='mouse'){
//         data.screen = {
//             width:window.screen.width,
//             height:window.screen.height
//         }
//     }else if(type === 'key'){

//     }
//     ipcRenderer.send('robot',type,data);
// })

module.exports = peer;