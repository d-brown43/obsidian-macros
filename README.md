# Obsidian Macros
This plugin is based on [the obsidian sample plugin](https://github.com/obsidianmd/obsidian-sample-plugin).

It is designed to allow easy inputting of repetitive
strings into your markdown notes. It has simple variable
replacement syntax which you can make use of in your
macros, essentially anything inside a pair of single
curly braces is interpreted as a variable.

For example, if I configure a macro "here it is: { content }", this
would allow me to enter a value for "content" during macro
application. If I entered "something" as the value for
"content" during application, I would end up inserting a string
"here it is: something" into my markdown note.

## Installation
Clone the code
```
$ git clone git@github.com:d-brown43/obsidian-macros.git
$ cd obsidian-macros
```

Install and build the plugin
```
$ yarn install
$ yarn build
```

A folder named `obsidian-macros` will be created
in the root of the code repository. You will need to copy
this into your Obsidian.md vault: `<your vault>/.obsidian/plugins`.

You will need to enable the plugin within Obsidian.md, in the same
way as you would with any third party plugin.

## Using the plugin
Two commands are added for managing and applying your macros.

### Manage Macros
This macro will allow you to manage your macro definitions. Each macro has
a label for your reference, and the macro string itself. You can add and delete
macros from this interface

### Apply Macro
To use this command, you will need to be within a markdown editor view. Upon
applying this macro, a popover will appear showing all the macros you have defined.
You can select any macro from this list. If your selected macro has any variables,
a second step will appear allowing you to input values for each variable. If
the macro has no variables, it will be applied immediately at the location of your
cursor in the editor.

## How it was made
[Take a look at my blog post](https://david-brown.dev/posts/obsidian-macros-plugin/) with the process I went through
to create this plugin.
