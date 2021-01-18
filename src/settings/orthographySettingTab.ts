import { App, PluginSettingTab, Setting, ExtraButtonComponent } from 'obsidian';
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
    OrthographySettingTab.setDisplayRunner(containerEl, settings);
    // OrthographySettingTab.setLanguage(containerEl, settings);
  }

  static setDisplayRunner(
    containerEl: HTMLElement,
    settings: OrthographySettings
  ): void {
    new Setting(containerEl)
      .setName('Show button')
      .setDesc('Button for orthography checking')
      .addToggle((toggle) =>
        toggle.setValue(settings.displayRunner).onChange((value) => {
          settings.displayRunner = value;
          settings.saveSettings();
        })
      );
  }

  static setLanguage(
    containerEl: HTMLElement,
    settings: OrthographySettings
  ): void {
    new Setting(containerEl)
      .setName('Language setting')
      .setDesc('Select language')
      .addDropdown((dropdown) =>
        dropdown
          .addOption('en', 'English')
          .addOption('ru', 'Russian')
          .addOption('uk', 'Ukraine')
          .addOption('en, ru, uk', 'All')
          .onChange(async (value) => {
            settings.language = value;
            await settings.saveSettings();
          })
      );
  }
}
