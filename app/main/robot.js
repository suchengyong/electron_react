const { ipcMain } = require('electron');
// 鼠标控制库调用原生底层
const robot = require('robotjs');
const vkey = require('vkey');
// 鼠标事件
function handelMouse(data) {
    let {clientX,clientY,screen,video} = data;
    // data {clientX,clientY,screen:{width,height},video:{width,height}}
    let x = clientX * screen.width / video.width;
    let y = clientY * screen.height / video.height;
    robot.moveMouse(x,y);
    robot.mouseClick();
}
// 键盘事件
function handelKey(data) {
    let modifiers = [];
    if(data.meta) {
        modifiers.push('meta');
    }
    if(data.shift) {
        modifiers.push('shift');
    }
    if(data.alt) {
        modifiers.push('alt');
    }
    if(data.ctrl) {
        modifiers.push('ctrl');
    }
    let key = vkey[data.keyCode].toLowerCase();
    if(key[0] !=='<') {
        robot.keyTap(key,modifiers);
    }
}
module.exports = function() {
    ipcMain.on('robot',(e,type,data)=>{
        if(type==='mouse') {
            handelMouse(data);
        }else if(type === 'key') {
            handelKey(data);
        }
    })
}