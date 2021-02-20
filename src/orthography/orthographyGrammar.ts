import { App } from 'obsidian';
import { OrthographySettings } from 'src/settings';

export class OrthographyGrammar {
  private app: App;
  private settings: OrthographySettings;

  constructor(app: App, settings: OrthographySettings) {
    this.app = app;
    this.settings = settings;
  }

  public init(): void {}

  public destroy(): void {}
}
