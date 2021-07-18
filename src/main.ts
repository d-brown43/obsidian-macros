import ReactDOM from 'react-dom';
import React from 'react';
import { App, Modal, Plugin, debounce, MarkdownView } from "obsidian";
import MacroManageModal from './MacroManageModal';
import { PluginSettings } from './types';
import { Provider } from 'react-redux';
import store, { getMacros } from "./redux";
import { Unsubscribe } from 'redux';
import { rehydrate } from './redux';
import MacroApplyPopover from './MacroApplyPopover';
import * as CodeMirror from 'codemirror';
import { closeApplyMacro, openApplyMacro } from './redux';
import { observeStore } from "./utils";

const DEFAULT_SETTINGS: PluginSettings = {
  macros: [],
};

export default class MacroPlugin extends Plugin {
  storeUnsubscribe: Unsubscribe | null = null;
  codeMirrors: CodeMirror.Editor[] = [];
  closePopover: () => void = () => {};

  subscribeToStore() {
    let promise = Promise.resolve();
    const updateSettings = debounce(
      () => {
        promise = promise.then(this.saveSettings);
      },
      1000,
      true
    );

    this.storeUnsubscribe = observeStore(
      getMacros,
      updateSettings,
    );
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

  async onload() {
    console.log('loading plugin');

    await this.rehydrate();
    this.subscribeToStore();

    this.registerCodeMirror((cm) => {
      this.codeMirrors.push(cm);
    });

    this.addCommand({
      id: 'macro',
      name: 'Manage Macros',
      checkCallback: (checking: boolean) => {
        let leaf = this.app.workspace.activeLeaf;
        if (leaf) {
          if (!checking) {
            new ManageMacroModal(this.app, this).open();
          }
          return true;
        }
        return false;
      },
    });

    this.addCommand({
      id: 'apply-macro',
      name: 'Apply Macro',
      checkCallback: (checking: boolean) => {
        const leaf = this.app.workspace.activeLeaf;
        const isApplyingMacro = store.getState().ui.applyingMacro;

        const isSourceMode = this.isSourceMode();
        const markdownView = this.getMarkdownView();

        if (leaf && !isApplyingMacro && isSourceMode && markdownView) {
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
            };
            ReactDOM.render(
              React.createElement(
                Provider,
                { store },
                React.createElement(MacroApplyPopover, {
                  close: this.closePopover,
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
    console.log('unloading plugin');
    if (this.storeUnsubscribe) {
      this.storeUnsubscribe();
    }
    this.closePopover();
  }

  async saveSettings() {
    const macros = store.getState().macro;
    const settings = {
      macros,
    };
    console.log('saving settings', settings);
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
  }
}
