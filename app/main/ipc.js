const {ipcMain, remote} = require('electron');
const {send:sendMainWindow} = require('./windows/main');
const {create:createControlWindow} = require('./windows/control')
module.exports = function() {
    ipcMain.handle('login',async()=>{
        let code = Math.floor(Math.random()*(999999-100000)) + 100000;
        return code;
    });
    ipcMain.on('control',async (e,remoteCode)=>{
        // 在里跟服务器端交互，但是我们目前mock返回
        sendMainWindow('control-state-change',remoteCode,1);
        createControlWindow();// 控制窗口弹出
    })
}