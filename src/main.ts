import ReactDOM from "react-dom";
import React from "react";
const { App, Modal, Plugin } = eval('require')('obsidian');
import MacroManageModal from './MacroManageModal';
import {PluginSettings} from "./types";

const DEFAULT_SETTINGS: PluginSettings = {
	macros: [],
}

export default class MacroPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;

	async onload() {
		console.log('loading plugin');

		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());

		// this.addRibbonIcon('dice', 'Sample Plugin', () => {
		// 	new Notice('This is a notice!');
		// });

		// this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'macro',
			name: 'Manage Macros',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new MacroModal(this.app, this, this.settings).open();
					}
					return true;
				}
				return false;
			}
		});

		// this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			console.log('codemirror', cm);
		});

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log('unloading plugin');
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class MacroModal extends Modal {
	settings: PluginSettings;
	plugin: MacroPlugin;

	constructor(app: typeof App, plugin: MacroPlugin, settings: PluginSettings) {
		super(app);
		this.settings = settings;
		this.plugin = plugin;
	}

	onOpen() {
		ReactDOM.render(
			React.createElement(MacroManageModal, {
				macros: this.settings.macros,
			}),
			this.contentEl,
		);
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}
