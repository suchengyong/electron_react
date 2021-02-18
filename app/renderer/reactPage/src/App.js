import React,{useState,useEffect} from 'react'
import './App.css';
import {ipcRenderer} from 'electron' // 1.引入时需要改动webpack配置 修改Target配置 ，
// 安装模块customize-cra react-app-rewired // 来修改react webpack配置
//const {ipcRenderer} = window.require('electron'); // 2.第二中引入方式，不需要改动其他配置

function App() {
  const [remoteCode,setRemoteCode] = useState('');
  const [localCode,setLocalCode] = useState('');
  const [controlText,setControlText] = useState('');
  const login = async () =>{
    let code = await ipcRenderer.invoke('login');
    setLocalCode(code);
  }
  useEffect(()=>{
    login();
    ipcRenderer.on('control-state-change',handleCotrolState);// 监听主进程改变状态
    return () =>{// 清除监听事件
      ipcRenderer.removeListener('control-state-change',handleCotrolState)
    }
  },[]);
  const handleCotrolState = (e,name,type) =>{
    let text = '';
    if(type === 1) {
      // 控制别人
      text = `正在远程控制${name}`
    }else if(type === 2) {
      // 被控制
      text = `被${name}控制中`
    }
    setControlText(text);
  }
  const startControl = (remoteCode)=>{
    ipcRenderer.send('control',remoteCode)
  }
  return (
    <div className="App">
      {
        controlText===''?<>
          <div>你的控制码：{localCode}</div>
          <input type='text' value={remoteCode} onChange={e=>setRemoteCode(e.target.value)}/>
          <button onClick={()=>startControl(remoteCode)}>确认</button>
        </>:<div>{controlText}</div>
      }
    </div>
  );
}

export default App;
