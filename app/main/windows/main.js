const {app,BrowserWindow} = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
let win;
let willQuitApp = false;

function create() {
    win = new BrowserWindow({
        width:600,
        height:300,
        webPreferences:{
            nodeIntegration:true,
        }
    });
    // 窗口假关闭
    win.on('close',(e)=>{
        if(willQuitApp) {
            win = null;
        }else{
            e.preventDefault();
            win.hide();
        }
    });

    if(isDev) { // 开发环境
        win.loadURL('http://localhost:3000');
    }else{
        win.loadFile(path.resolve(__dirname,'../../renderer/pages/main/index.html'));
    }
}

function send(channel,...args) {
    win.webContents.send(channel,...args)
}

function show() {
    win.show();
}

function close() {
    willQuitApp = true;
    win.close();
}
module.exports = {create,send,show,close};