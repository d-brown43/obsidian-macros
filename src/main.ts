import ReactDOM from 'react-dom';
import React from 'react';
import {
  App,
  Modal,
  Plugin,
  debounce,
  MarkdownView,
  PluginSettingTab,
} from 'obsidian';
import MacroManageModal from './MacroManageModal';
import { PluginSettings } from './types';
import { Provider } from 'react-redux';
import store, { getIsApplyingMacro, getMacros, resetUi } from "./redux";
import { Unsubscribe } from 'redux';
import { rehydrate } from './redux';
import MacroApplyPopover from './MacroApplyPopover';
import * as CodeMirror from 'codemirror';
import { closeApplyMacro, openApplyMacro } from './redux';
import { observeStore } from './utils';

const DEFAULT_SETTINGS: PluginSettings = {
  macros: [
    {
      id: 'default-macro-ipsum',
      label: 'Lorem Ipsum',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse vestibulum, dui a consequat auctor, orci leo efficitur arcu, vel imperdiet enim neque quis nunc. Quisque mattis, ante sed laoreet tristique, mauris est hendrerit sapien, et accumsan orci leo in orci. Donec pretium lectus eget eros tristique, quis maximus nibh gravida. Donec orci nisi, auctor vel bibendum nec, interdum at dolor. Aenean risus nunc, ornare ac tellus eu, pellentesque sagittis ipsum. Nullam vitae maximus nibh. Nunc vulputate sed est eget tincidunt. Nullam viverra porta lacus ut aliquam. In rhoncus est ex, sit amet pretium nibh eleifend vitae. Suspendisse potenti. Nullam finibus lobortis massa, id tempor augue commodo a. Curabitur mi leo, posuere id libero eu, consequat efficitur metus. Duis quis consectetur augue, ut semper odio. Morbi eget augue eu nunc vulputate fermentum ac vitae purus. Donec elementum diam a mauris malesuada, id tincidunt lorem iaculis.',
    },
    {
      id: 'default-macro-google',
      label: 'Google Search',
      text: '[{link name}](https://google.com?q={search query})',
    },
  ],
};

export default class MacroPlugin extends Plugin {
  storeUnsubscribe: Unsubscribe | null = null;
  codeMirrors: CodeMirror.Editor[] = [];
  closePopover: () => void = () => {};

  subscribeToStore() {
    let promise = Promise.resolve();
    const updateSettings = debounce(
      () => {
        promise = promise.then(() => this.saveSettings());
      },
      1000,
      true
    );

    this.storeUnsubscribe = observeStore(getMacros, updateSettings);
  }

  async rehydrate() {
    const settings = await this.loadData();
    const settingsState = settings || DEFAULT_SETTINGS;
    store.dispatch(rehydrate(settingsState.macros));
  }

  applyMacro(resolvedMacro: string) {
    this.getMarkdownView()?.editor.replaceSelection(resolvedMacro);
  }

  getMarkdownView() {
    if (this.app.workspace.activeLeaf.view.getViewType() === 'markdown') {
      return this.app.workspace.activeLeaf.view as MarkdownView;
    }
    return null;
  }

  isSourceMode(): boolean {
    return this.getMarkdownView()?.getMode() === 'source';
  }

  openManageMacros() {
    new ManageMacroModal(this.app, this).open();
  }

  async onload() {
    await this.rehydrate();
    this.subscribeToStore();

    this.registerCodeMirror((cm) => {
      this.codeMirrors.push(cm);
    });

    this.addSettingTab(new Settings(this.app, this));

    this.addCommand({
      id: 'macro',
      name: 'Manage Macros',
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            this.openManageMacros();
          }
          return true;
        }
        return false;
      },
    });

    this.addCommand({
      id: 'apply-macro',
      name: 'Apply Macro',
      editorCheckCallback: (checking: boolean) => {
        const leaf = this.app.workspace.activeLeaf;
        const isApplyingMacro = getIsApplyingMacro(store.getState());

        const markdownView = this.getMarkdownView();

        if (leaf && !isApplyingMacro && markdownView) {
          if (!checking) {
            store.dispatch(openApplyMacro());

            const codeMirror = (this.app.workspace.activeLeaf as any).view
              .currentMode.cmEditor;

            const containerEl = document.body;

            const element = containerEl.createEl('div');
            element.style.position = 'absolute';
            element.style.top = '0';
            element.style.left = '0';

            this.closePopover = () => {
              ReactDOM.unmountComponentAtNode(element);
              element.parentNode?.removeChild(element);
              store.dispatch(closeApplyMacro());
              codeMirror.focus();
              store.dispatch(resetUi());
            };
            ReactDOM.render(
              React.createElement(
                Provider,
                { store },
                React.createElement(MacroApplyPopover, {
                  cursorElement: codeMirror.display.input.wrapper,
                  close: () => this.closePopover(),
                  getCursorPosition: () => {
                    return codeMirror.cursorCoords(false, 'page');
                  },
                  applyMacro: (resolvedValue) => {
                    this.closePopover();
                    this.applyMacro(resolvedValue);
                  },
                })
              ),
              element
            );
          }
          return true;
        }
        return false;
      },
    });
  }

  onunload() {
    if (this.storeUnsubscribe) {
      this.storeUnsubscribe();
    }
    this.closePopover();
  }

  async saveSettings() {
    const macros = getMacros(store.getState());
    const settings = {
      macros,
    };
    await this.saveData(settings);
  }
}

class ManageMacroModal extends Modal {
  plugin: MacroPlugin;

  constructor(app: App, plugin: MacroPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen() {
    ReactDOM.render(
      React.createElement(
        Provider,
        { store },
        React.createElement(MacroManageModal)
      ),
      this.contentEl
    );
  }

  onClose() {
    let { contentEl } = this;
    ReactDOM.unmountComponentAtNode(contentEl);
    contentEl.empty();
    store.dispatch(resetUi());
  }
}

class Settings extends PluginSettingTab {
  plugin: MacroPlugin;

  constructor(app: App, plugin: MacroPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Obsidian Macros' });

    containerEl.createEl('p', {
      text: 'This is a plugin to allow adding customisable macros.',
    });
    containerEl.createEl('p', {
      text: 'There are two commands, "Manage Macros" and "Apply Macro".',
    });
    containerEl.createEl('p', {
      text: 'Manage macros allows you to customise add, delete and customise your macros.',
    });
    containerEl.createEl('p', {
      text: 'Apply macro will bring up a popup to insert one of your selected macros at the current cursor location in your editor. This command only works while you are editing a file.',
    });

    const tryoutButton = containerEl.createEl('button', {
      text: 'Take me to my macros',
    });
    this.plugin.registerDomEvent(tryoutButton, 'click', () => {
      this.plugin.openManageMacros();
    });
  }
}
