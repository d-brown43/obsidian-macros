import ReactDOM from "react-dom";
import React from "react";
import { App, Modal, Plugin, debounce } from 'obsidian';
import MacroManageModal from './MacroManageModal';
import {PluginSettings} from "./types";
import {Provider} from "react-redux";
import store from "./redux";
import {Unsubscribe} from "redux";
import {rehydrate} from "./redux/hydration";
import MacroApplyPopover from "./MacroApplyPopover";
import * as CodeMirror from "codemirror";
import {closeApplyMacro, openApplyMacro } from "./redux/ui";

const DEFAULT_SETTINGS: PluginSettings = {
	macros: [],
}

export default class MacroPlugin extends Plugin {
	settings: PluginSettings = DEFAULT_SETTINGS;
	storeUnsubscribe: Unsubscribe | null = null;
	codeMirror: CodeMirror.Editor | null = null;

	subscribeToStore() {
		let promise = Promise.resolve();
		const updateSettings = debounce(() => {
			promise = promise.then(() => {
				this.saveSettings();
			});
		}, 1000, true);

		store.subscribe(updateSettings);
	}

	async rehydrate() {
		const settings = await this.loadData();
		store.dispatch(rehydrate(settings.macros));
	}

	applyMacro(resolvedMacro: string) {
		this.codeMirror?.getDoc().replaceSelection(resolvedMacro);
	}

	async onload() {
		console.log('loading plugin');

		await this.rehydrate();
		this.subscribeToStore();

		this.registerCodeMirror(cm => {
			this.codeMirror = cm;
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
			}
		});

		this.addCommand({
			id: 'apply-macro',
			name: 'Apply Macro',
			checkCallback: (checking: boolean) => {
				const leaf = this.app.workspace.activeLeaf;
				const isApplyingMacro = store.getState().ui.applyingMacro;
				if (leaf && !isApplyingMacro) {
					if (!checking) {
						store.dispatch(openApplyMacro());
						const element = this.app.workspace.containerEl.createDiv();
						this.codeMirror?.addWidget(this.codeMirror?.getCursor(), element, true);
						const close = () => {
							ReactDOM.unmountComponentAtNode(element);
							element.parentNode?.removeChild(element);
							store.dispatch(closeApplyMacro());
						};
						ReactDOM.render(
							React.createElement(
								Provider,
								{ store },
								React.createElement(
									MacroApplyPopover,
									{
										close,
										applyMacro: resolvedValue => {
											close();
											this.applyMacro(resolvedValue);
											this.codeMirror?.focus();
										}
									}
								)
							), element);
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
			this.contentEl,
		);
	}

	onClose() {
		let {contentEl} = this;
		ReactDOM.unmountComponentAtNode(contentEl);
		contentEl.empty();
	}
}
