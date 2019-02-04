import { TextEditor} from 'vscode';
import { Position } from 'vscode';
import { Range } from 'vscode';
import { Selection } from 'vscode';
import { TextEditorRevealType } from 'vscode';
import { TextLine } from 'vscode';

export class AlgHelper
{
    public static getCursor(editor: TextEditor): Position
    {
        return editor.selection.active;
    }

    public static moveCursor(editor: TextEditor, destination: Position): void
    {
        editor.selections = [new Selection(destination, destination)];
        editor.revealRange(new Range(destination, destination), TextEditorRevealType.InCenter);
    }

    public static isSectionHeading(line: TextLine): boolean
    {
        return /^[\#]{1,6}\s/.test(line.text);
    }

    public static getHeadingLevel(line: TextLine): number
    {
        let punctuation = /^([\#]{1,6})\s/.exec(line.text);
        return punctuation ? punctuation[1].length : 0;
    }

    public static getCursorLine(editor: TextEditor): TextLine
    {
        return editor.document.lineAt(AlgHelper.getCursor(editor).line);
    }
}