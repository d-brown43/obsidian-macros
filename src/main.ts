import ReactDOM from "react-dom";
import React from "react";
import { App, Modal, Plugin } from 'obsidian';
import MacroManageModal from './MacroManageModal';
import {PluginSettings} from "./types";
import {Provider} from "react-redux";
import store from "./redux";
import {Unsubscribe} from "redux";
import {rehydrate} from "./redux/hydration";

const DEFAULT_SETTINGS: PluginSettings = {
	macros: [],
}

export default class MacroPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;
	storeUnsubscribe: Unsubscribe | null = null;

	subscribeToStore() {
		let timerId: NodeJS.Timeout | null = null;
		let promise = Promise.resolve();
		this.storeUnsubscribe = store.subscribe(() => {
			if (timerId) {
				clearTimeout(timerId);
			}
			timerId = setTimeout(() => {
				promise = promise.then(() => {
					this.saveSettings();
				});
			}, 1000);
		});
	}

	async rehydrate() {
		const settings = await this.loadData();
		store.dispatch(rehydrate(settings.macros));
	}

	async onload() {
		console.log('loading plugin');

		await this.rehydrate();
		this.subscribeToStore();

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
	}

	onunload() {
		console.log('unloading plugin');
		if (this.storeUnsubscribe) {
			this.storeUnsubscribe();
		}
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

class MacroModal extends Modal {
	settings: PluginSettings;
	plugin: MacroPlugin;

	constructor(app: App, plugin: MacroPlugin, settings: PluginSettings) {
		super(app);
		this.settings = settings;
		this.plugin = plugin;
	}

	onOpen() {
		ReactDOM.render(
			React.createElement(Provider, {
				store,
			}, React.createElement(MacroManageModal, {
				macros: this.settings.macros,
			})),
			this.contentEl,
		);
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}
