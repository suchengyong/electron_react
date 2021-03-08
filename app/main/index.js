const {app,BrowserWindow} = require('electron');
const handleIPC = require('./ipc');
const {create:createMainWindow,show:showMainWindow,close:closeMainWindow} = require('./windows/main')
const {create:createControlWindow} = require('./windows/control')
// 禁止多个主窗口打开
const getTheLock = app.requestSingleInstanceLock();

if(!getTheLock) {
    app.quit();
}else{
    app.on('second-instance',()=>{
        showMainWindow();
    })
    // 初始化
    app.on('ready',()=>{
        createMainWindow();
        //createControlWindow();
        handleIPC();
        //require('./robot')();
    });
    // 关闭之前
    app.on('before-quit',()=>{
        closeMainWindow();
    });
    // 激活app
    app.on('activate',()=>{
        showMainWindow();
    })
}
