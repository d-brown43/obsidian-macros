export type Macro = {
  id: string;
  text: string;
  label: string;
};

export interface PluginSettings {
  macros: Macro[];
}
