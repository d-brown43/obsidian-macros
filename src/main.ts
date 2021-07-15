import { App, Modal, Plugin } from 'obsidian';

type Macro = {
	text: string;
}

interface PluginSettings {
	macros: Macro[];
}

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

	constructor(app: App, plugin: MacroPlugin, settings: PluginSettings) {
		super(app);
		this.settings = settings;
		this.plugin = plugin;
	}

	render() {
		const {contentEl} = this;
		while (contentEl.firstChild) {
			contentEl.removeChild(contentEl.firstChild);
		}

		contentEl.createEl('h2', {text: 'Macros'});

		console.log('rendering macros', this.settings.macros);

		this.settings.macros.forEach(macro => {
			const container = contentEl.createDiv();
			const input = contentEl.createEl('input', {
				type: 'text',
			});
			input.value = macro.text;

			const confirm = contentEl.createEl('button', {
				type: 'button',
				text: 'Confirm',
			});
			confirm.addEventListener('click', () => {
				console.log('confirming changes', input.value);
				macro.text = input.value;
				this.updateMacros();
			});

			const deleteMacro = contentEl.createEl('button', {
				type: 'button',
				text: 'Delete',
			});
			deleteMacro.addEventListener('click', () => {
				console.log('deleting macro');
				this.settings.macros = this.settings.macros.filter(m => m !== macro);
				this.updateMacros();
			});

			container.appendChild(input);
			container.appendChild(confirm);
			container.appendChild(deleteMacro);
		});

		const controls = contentEl.createDiv();
		const addNew = contentEl.createEl('button', {
			type: 'button',
			text: 'Add new macro',
		});
		addNew.addEventListener('click', () => {
			console.log('adding new macro');
			this.settings.macros.push({
				text: 'test',
			});
			this.updateMacros();
		});
		controls.appendChild(addNew);
	}

	async updateMacros() {
		this.plugin.saveSettings();
		this.render();
	}

	onOpen() {
		this.render();
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}
