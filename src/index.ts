import { BrowserWindow, app, Menu, MenuItem, MenuItemConstructorOptions } from 'electron'
import { getVersion, getConfiguration, getCodecs, Codec } from './ffmpeg'

let window: BrowserWindow = null;

app.on('ready', () => {
    window = new BrowserWindow({width: 800, height: 600});

    const template: MenuItemConstructorOptions[] = [
        {
            label: 'File',
            submenu: [
                {label: 'Open'},
                {label: 'Close'},
                {type: 'separator'},
                {
                    label: 'Exit',
                    click: (menuItem: MenuItem,  browserWindow: BrowserWindow, event: Event) => {
                        browserWindow.close()
                    }
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    window.loadFile(`${process.cwd()}/build/home.html`);
});

// getConfiguration().then((configs: string[]) => {
//     for(const index in configs) {
//         console.log(configs[index]);
//     }
// });

// getVersion().then((version: string) => {
//     console.log(`Version: ${version}`);
// });

getCodecs().then((codecs: Codec[]) => {
    codecs.filter((codec: Codec, index: number, array: Codec[]) => {
        return codec.lossy && codec.losless && codec.type == 'A';
    }).map((codec: Codec, index: number, array: Codec[]) => {
        console.log(codec.name);
    });
});