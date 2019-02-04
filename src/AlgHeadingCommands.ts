import { TextEditor } from 'vscode';
import { TextEditorEdit } from 'vscode';
import { TextLine } from 'vscode';
import { Position } from 'vscode';

import { AlgHelper } from './AlgHelper';
import { AlgDocumentData, Section } from './AlgDocumentData';

export class AlgHeadingCommands
{
    public static promoteHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        let cursorPosition: Position = AlgHelper.getCursor(editor);
        let cursorLine: TextLine = AlgHelper.getCursorLine(editor);

        if (AlgHelper.isSectionHeading(cursorLine))
        {
            let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
            if (documentData)
            {
                documentData.promoteHeading(cursorPosition, editor, edit);
            }
        }
    }
  
    public static demoteHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        let cursorPosition: Position = AlgHelper.getCursor(editor);
        let cursorLine: TextLine = AlgHelper.getCursorLine(editor);

        if (AlgHelper.isSectionHeading(cursorLine))
        {
            let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
            if (documentData)
            {
                documentData.demoteHeading(cursorPosition, editor, edit);
            }
        }
    }
    
    public static nextHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
        if (documentData)
        {
            let headingSection: Section | undefined = documentData.getNextSection(AlgHelper.getCursor(editor));
            if (headingSection)
            {
                AlgHelper.moveCursor(editor, new Position(headingSection.start, 0));
            }
        }
    }

    public static previousHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
        if (documentData)
        {
            let headingSection: Section | undefined = documentData.getPreviousSection(AlgHelper.getCursor(editor));
            if (headingSection)
            {
                AlgHelper.moveCursor(editor, new Position(headingSection.start, 0));
            }
        }
    }
    
    public static nextSameLevelHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
        if (documentData)
        {
            let headingSection: Section | undefined = documentData.getNextSameLevelSection(AlgHelper.getCursor(editor));
            if (headingSection)
            {
                AlgHelper.moveCursor(editor, new Position(headingSection.start, 0));
            }
        }
    }

    public static previousSameLevelHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
        if (documentData)
        {
            let headingSection: Section | undefined = documentData.getPreviousSameLevelSection(AlgHelper.getCursor(editor));
            if (headingSection)
            {
                AlgHelper.moveCursor(editor, new Position(headingSection.start, 0));
            }
        }
    }

    public static backHigherLevelHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
        if (documentData)
        {
            let headingSection: Section | undefined = documentData.getHigherLevelHeading(AlgHelper.getCursor(editor));
            if (headingSection)
            {
                AlgHelper.moveCursor(editor, new Position(headingSection.start, 0));
            }
        }
    }

    public static promoteSubtree(editor: TextEditor, edit: TextEditorEdit): void
    {
        let cursorPosition: Position = AlgHelper.getCursor(editor);
        let cursorLine: TextLine = AlgHelper.getCursorLine(editor);

        if (AlgHelper.isSectionHeading(cursorLine))
        {
            let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
            if (documentData)
            {
                documentData.promoteSubtree(cursorPosition, editor, edit);
            }
        }
    }

    public static demoteSubtree(editor: TextEditor, edit: TextEditorEdit): void
    {
        let cursorPosition: Position = AlgHelper.getCursor(editor);
        let cursorLine: TextLine = AlgHelper.getCursorLine(editor);

        if (AlgHelper.isSectionHeading(cursorLine))
        {
            let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
            if (documentData)
            {
                documentData.demoteSubtree(cursorPosition, editor, edit);
            }
        }
    }

    public static insertNewHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        let cursorPosition: Position = AlgHelper.getCursor(editor);
        
        let documentData: AlgDocumentData | undefined = AlgDocumentData.getDocumentData(editor.document);
        if (documentData)
        {
            documentData.insertNewHeading(cursorPosition, editor, edit);
        }
    }
}