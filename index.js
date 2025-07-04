console.log("Hello World");
const {app, BrowserWindow} = require('electron');

app.on ('ready', () => {
    let win = new BrowserWindow({
        width: 700,
        height: 1000,
        autoHideMenuBar: true
    })
    win.loadFile('src/index.html')
})