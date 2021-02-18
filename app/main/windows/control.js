const {app,BrowserWindow} = require('electron');
const path = require('path');
let win;
function create() {
    win = new BrowserWindow({
        width:800,
        height:400,
        webPreferences:{
            nodeIntegration:true,
        }
    });
    win.loadFile(path.resolve(__dirname,'../../renderer/pages/control/index.html'));
}

module.exports = {create};