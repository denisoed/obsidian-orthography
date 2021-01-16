import { App, PluginSettingTab, Setting } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import type OrthographyPlugin from '../main';

export class OrthographySettingTab extends PluginSettingTab {
  constructor(
    app: App,
    plugin: OrthographyPlugin,
    private settings: OrthographySettings
  ) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl, settings } = this;

    containerEl.empty();
    OrthographySettingTab.setAlwaysNewPaneForSymbols(containerEl, settings);
    OrthographySettingTab.setSymbolsInLineOrder(containerEl, settings);
    OrthographySettingTab.setInputSetting(containerEl, settings);
  }

  static setAlwaysNewPaneForSymbols(
    containerEl: HTMLElement,
    settings: OrthographySettings
  ): void {
    new Setting(containerEl)
      .setName('Open Symbols in new pane')
      .setDesc(
        'Enabled, always open a new pane when navigating to Symbols. Disabled, navigate in an already open pane (if one exists)'
      )
      .addToggle((toggle) =>
        toggle.setValue(settings.alwaysNewPaneForSymbols).onChange((value) => {
          settings.alwaysNewPaneForSymbols = value;
          settings.saveSettings();
        })
      );
  }

  static setSymbolsInLineOrder(
    containerEl: HTMLElement,
    settings: OrthographySettings
  ): void {
    new Setting(containerEl)
      .setName('List symbols in order they appear')
      .setDesc(
        'Enabled, symbols will be displayed in the (line) order they appear in the source text, indented under any preceding heading. Disabled, symbols will be grouped by type: Headings, Tags, Links, Embeds.'
      )
      .addToggle((toggle) =>
        toggle.setValue(settings.symbolsInlineOrder).onChange((value) => {
          settings.symbolsInlineOrder = value;
          settings.saveSettings();
        })
      );
  }

  static setInputSetting(
    containerEl: HTMLElement,
    settings: OrthographySettings
  ): void {
    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc("It's a secret")
      .addText((text) =>
        text
          .setPlaceholder('Enter your secret')
          .setValue('')
          .onChange(async (value) => {
            console.log('Secret: ' + value);
            settings.inputSetting = value;
            await settings.saveSettings();
          })
      );
  }
}
