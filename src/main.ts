// import {
//   App,
//   Modal,
//   Notice,
//   Plugin,
//   PluginSettingTab,
//   Setting
// } from 'obsidian';

// interface MyPluginSettings {
//   mySetting: string;
// }

// const DEFAULT_SETTINGS: MyPluginSettings = {
//   mySetting: 'default'
// };

// export default class MyPlugin extends Plugin {
//   settings: MyPluginSettings;
//   errors: any;

//   async onload() {
//     console.log('loading plugin');

//     await this.loadSettings();

//     this.addRibbonIcon('dice', 'Sample Plugin', () => {
//       new Notice('This is a notice!');
//     });

//     this.addStatusBarItem().setText('Status Bar Text');

//     this.addCommand({
//       id: 'better-toggle-todo',
//       name: 'Toggle to-do lists',
//       callback: () => this.checkTexts(),
//       hotkeys: [
//         {
//           modifiers: ['Mod', 'Shift'],
//           key: 'l'
//         }
//       ]
//     });

//     this.addCommand({
//       id: 'open-sample-modal',
//       name: 'Open Sample Modal',
//       checkCallback: (checking: boolean) => {
//         let leaf = this.app.workspace.activeLeaf;
//         if (leaf) {
//           if (!checking) {
//             new SampleModal(this.app).open();
//           }
//           return true;
//         }
//         return false;
//       }
//     });

//     this.addSettingTab(new SampleSettingTab(this.app, this));

//     this.registerCodeMirror((cm: CodeMirror.Editor) => {
//       console.log('codemirror', cm);
//     });

//     this.registerDomEvent(document, 'click', (evt: any) => {
//       const selectedWord = evt.target.innerText;
//       const res = this.errors
//         .map(function (e: any) {
//           if (e.word === selectedWord) {
//             return e.s;
//           }
//         })
//         .filter(function (e: any) {
//           if (e !== undefined) {
//             return e;
//           }
//         });
//       var tooltips = document.querySelectorAll(
//         '.obsidian-orthography-highlight'
//       );
//       for (var i = 0; i < tooltips.length; i++) {
//         tooltips[i].addEventListener('click', showTooltip);
//       }
//     });

//     this.registerInterval(
//       window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000)
//     );
//   }

//   onunload() {
//     console.log('unloading plugin');
//   }

//   async loadSettings() {
//     this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
//   }

//   async saveSettings() {
//     await this.saveData(this.settings);
//   }

//   async checkTexts() {
//     const activeLeaf: any = this.app.workspace.activeLeaf;
//     const editor = activeLeaf.view.sourceMode.cmEditor;
//     const text = editor.getValue();
//     const url =
//       'https://speller.yandex.net/services/spellservice.json/checkTexts';
//     const formData = new FormData();
//     formData.append('text', text);
//     formData.append('lang', 'en');

//     postData(url, formData).then((data) => {
//       createTooltip();
//       this.errors = data[0];
//       const res = data[0].map(function (item: any) {
//         return item['word'];
//       });
//       var regexFromMyArray = new RegExp(res.join('|'), 'gi');
//       console.log(regexFromMyArray, '!!!!');

//       this.search(regexFromMyArray);
//     });
//   }

//   search(val: any) {
//     const activeLeaf: any = this.app.workspace.activeLeaf;
//     const editor = activeLeaf.view.sourceMode.cmEditor;
//     var searchQuery = new RegExp(val);
//     var cursor = editor.getSearchCursor(searchQuery);
//     console.log(cursor);
//     while (cursor.findNext()) {
//       editor.markText(cursor.from(), cursor.to(), {
//         className: 'obsidian-orthography-highlight'
//       });
//     }
//   }
// }

// function createTooltip() {
//   var newDiv = document.createElement('div');
//   newDiv.classList.add('tooltip');
//   document.body.appendChild(newDiv);
// }

// function showTooltip(e: any) {
//   // var tooltip = e.target.classList.contains("tooltip") ?
//   //   e.target :
//   //   e.target.querySelector(":scope .tooltip");
//   var tooltip: any = document.querySelector('.tooltip');
//   tooltip.style.left =
//     e.pageX + tooltip.clientWidth + 10 < document.body.clientWidth
//       ? e.pageX + 10 + 'px'
//       : document.body.clientWidth + 5 - tooltip.clientWidth + 'px';
//   tooltip.style.top =
//     e.pageY + tooltip.clientHeight + 10 < document.body.clientHeight
//       ? e.pageY + 10 + 'px'
//       : document.body.clientHeight + 5 - tooltip.clientHeight + 'px';
// }

// // Пример отправки POST запроса:
// async function postData(url = '', data: any) {
//   // Default options are marked with *
//   const response = await fetch(url, {
//     method: 'POST', // *GET, POST, PUT, DELETE, etc.
//     body: data // body data type must match "Content-Type" header
//   });
//   return await response.json(); // parses JSON response into native JavaScript objects
// }

// class SampleModal extends Modal {
//   constructor(app: App) {
//     super(app);
//   }

//   onOpen() {
//     let { contentEl } = this;
//     contentEl.setText('Woah!');
//   }

//   onClose() {
//     let { contentEl } = this;
//     contentEl.empty();
//   }
// }

// class SampleSettingTab extends PluginSettingTab {
//   plugin: MyPlugin;

//   constructor(app: App, plugin: MyPlugin) {
//     super(app, plugin);
//     this.plugin = plugin;
//   }

//   display(): void {
//     let { containerEl } = this;

//     containerEl.empty();

//     containerEl.createEl('h2', {
//       text: 'Settings for my awesome plugin.'
//     });

//     new Setting(containerEl)
//       .setName('Setting #1')
//       .setDesc("It's a secret")
//       .addText((text) =>
//         text
//           .setPlaceholder('Enter your secret')
//           .setValue('')
//           .onChange(async (value) => {
//             console.log('Secret: ' + value);
//             this.plugin.settings.mySetting = value;
//             await this.plugin.saveSettings();
//           })
//       );
//   }
// }


import { Plugin } from 'obsidian';
import { OrthographySettings, OrthographySettingTab } from './settings';

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;

  async onload(): Promise<void> {
    const settings = new OrthographySettings(this);
    await settings.loadSettings();
    this.settings = settings;

    this.addSettingTab(new OrthographySettingTab(this.app, this, settings));

    this.addCommand({
      id: 'check-orthography',
      name: 'Check Orthography',
      callback: () => this.runCheckOrthography(),
      hotkeys: [
        {
          modifiers: ['Mod', 'Shift'],
          key: 'l'
        }
      ]
    });
  }

  private runCheckOrthography(): void {
    console.log('!!!!!!!!!');
  }
}
