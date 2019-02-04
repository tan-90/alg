# alg

Unicorns and rainbows! alg is short for **AL**most or**G** and is inspired by, for now actually copied from, emacs' [org-mode](https://orgmode.org/) (that one is the unicorn). It's meant to describe a document format and set of editing tools for authoring documents and organizing tasks in the form of a [vscode](https://code.visualstudio.com/) extension.

alg is a thing because I'm too stubborn to stop reinventing the wheel, but some original ideas will become a thing in due time. Also, alg will become a superset of markdown (not because it's better than org's format, simply because I want to).

## Features
The extension will activate in `.alg` files offering syntax highlight, code folding, and basic editing tools. The tools can be accessed by the command palette and are all prefixed by `alg:`.

A simple sample alg file is provided in the `samples` folder. That's the file I've been using for testing.

For your convenience, here's a table with all the tools and keyboard shortcuts. Keep in mind the shortcuts are all placeholders.

|Command|Name|Description|
|:------|:---|:----------|
|`alt+left`   |Promote Heading            |Decreases the heading level                         |
|`alt+right`  |Demote Heading             |Increases the heading level                         |
|`alt+down`   |Previous Heading           |Moves to the next heading                           |
|`alt+up`     |Next Heading               |Moves to the previous heading                       |
|`ctrl+alt+up`|Previous Same Level Heading|Moves to the previous same level heading            |
|`ctrl+alt+up`|Next Same Level Heading    |Moves to the next same level heading                |
|`shift+left` |Promote Current Subtree    |Promotes the current header and all it's sub headers|
|`shift+right`|Demote Current Subtree     |Demotes the current header and all it's sub headers |
|`shift+enter`|Insert New Header          |Inserts a new header at the current level           |

# Trying it out
I want to publish this when it has enough features to actually be useful, but for now you can simply clone it, ´npm install´, open the folder in vscode and run it.
