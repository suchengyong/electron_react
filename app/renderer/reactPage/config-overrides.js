// 修改配置webpack
const {override} = require('customize-cra');

function addRendererTarget(config) {
    config.target = 'electron-renderer';
    return config;
}

module.exports = override(addRendererTarget);