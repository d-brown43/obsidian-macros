export type BuiltinTypes = 'currentTime';

export type Macro = {
  id: string;
  text: string;
  label: string;
};

export type BuiltinMacro = {
  id: string;
  type: BuiltinTypes;
  label: string;
};

export type BuiltinSetting<T extends string> = {
  type: T;
  isEnabled: boolean;
  label: string;
};

export type BuiltinPluginSettings = {
  [key in BuiltinTypes]: BuiltinSetting<key>;
};

export type MacroUnion = Macro | BuiltinMacro;

export interface PluginSettings {
  macros: Macro[];
  builtins: BuiltinPluginSettings;
}
