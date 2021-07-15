export type Macro = {
  id: string;
  text: string;
};

export interface PluginSettings {
  macros: Macro[];
}
