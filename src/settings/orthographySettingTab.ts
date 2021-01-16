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
    // OrthographySettingTab.setLanguage(containerEl, settings);
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

  static setLanguage(
    containerEl: HTMLElement,
    settings: OrthographySettings
  ): void {
    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc("It's a secret")
      .addDropdown((dropdown) =>
        dropdown
          .addOption('en', 'English')
          .addOption('ru', 'Russian')
          .addOption('uk', 'Ukraine')
          .addOption('en, ru, uk', 'All')
          .onChange(async (value) => {
            console.log(value);
            settings.language = value;
            await settings.saveSettings();
          })
      );
  }
}
