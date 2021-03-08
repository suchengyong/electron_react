const {ipcMain, remote} = require('electron');
const {send:sendMainWindow} = require('./windows/main');
const {create:createControlWindow} = require('./windows/control')
//const signal = require('./signal');

module.exports = function() {
    ipcMain.handle('login',async()=>{
        let code = Math.floor(Math.random()*(999999-100000)) + 100000;
       //let {code} = await signal.invoke('login',null,'logined');
        return code;
    });
    ipcMain.on('control',async (e,remote)=>{
       // signal.send('control',{remote})
        
    });
    // signal.on('controlled',(data)=>{
    //     // 在里跟服务器端交互，但是我们目前mock返回
    //     sendMainWindow('control-state-change',data.remote,1);
    //     createControlWindow();// 控制窗口弹出
    // });
    // signal.on('be-controlled',(data)=>{
    //     sendMainWindow('control-state-change',data.remote,2);
    // })
}