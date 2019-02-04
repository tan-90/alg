import { FoldingRange } from 'vscode';
import { TextDocument } from 'vscode';
import { TextEditor } from 'vscode';
import { TextEditorEdit } from 'vscode';
import { TextLine } from 'vscode';
import { Position } from 'vscode';
import { Selection } from 'vscode';

export class Section
{
    public level: number;

    public parent: Section | undefined;
    public subSections: Section[];

    public hasBlankLine: boolean;

    public start: number;
    public end: number;

    constructor(level: number, parent: Section | undefined, start: number, end?: number, hasBlankLine?: boolean)
    {
        this.level = level;

        this.parent = parent;
        this.subSections = [];

        this.hasBlankLine = hasBlankLine ? hasBlankLine : false;

        this.start = start;
        this.end = end ? end : start;
    }

    public getFoldingRanges(): FoldingRange[] | undefined
    {
        let foldingRanges: FoldingRange[] = [];
        if (this.level !== 0 && this.start !== this.end)
        {
            foldingRanges.push(new FoldingRange(this.start, this.end));
        }
        
        this.subSections.forEach(section => {
            let subFoldingRange: FoldingRange[] | undefined = section.getFoldingRanges();
            if (subFoldingRange)
            {
                foldingRanges = foldingRanges.concat(subFoldingRange);
            }
        });

        return foldingRanges;
    }

    public containsCursor(cursorPosition: Position): boolean
    {
        return cursorPosition.line >= this.start && cursorPosition.line <= this.end + (this.hasBlankLine ? 1 : 0);
    }

    public promoteHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        if (this.level > 1)
        {
            let headingLine: TextLine = editor.document.lineAt(this.start);
            let punctuationStart: number = headingLine.firstNonWhitespaceCharacterIndex;
            let deleteRangePositions: Position[] = [];
            deleteRangePositions.push(new Position(headingLine.lineNumber, punctuationStart));
            deleteRangePositions.push(new Position(headingLine.lineNumber, punctuationStart + 1));

            let headingPunctuationSelection: Selection = new Selection(deleteRangePositions[0], deleteRangePositions[1]);
            edit.delete(headingPunctuationSelection);
        }
    }

    public demoteHeading(editor: TextEditor, edit: TextEditorEdit): void
    {
        if (this.level < 6)
        {
            let headingLine: TextLine = editor.document.lineAt(this.start);
            let punctuationStart: Position = new Position(headingLine.lineNumber, headingLine.firstNonWhitespaceCharacterIndex);
            edit.insert(punctuationStart, '#');
        }
    }

    public promoteSubtree(editor: TextEditor, edit: TextEditorEdit): void
    {
        this.promoteHeading(editor, edit);
        this.subSections.forEach(section => {
            section.promoteSubtree(editor, edit);
        });
    }

    public demoteSubtree(editor: TextEditor, edit: TextEditorEdit): void
    {
        this.demoteHeading(editor, edit);
        this.subSections.forEach(section => {
            section.demoteSubtree(editor, edit);
        });
    }
}

export class AlgDocumentData
{
    private static algDocumentDataRegistry: Map<TextDocument, AlgDocumentData> = new Map<TextDocument, AlgDocumentData>();

    private document: TextDocument;
    private algDocument: Section | undefined;

    constructor(document: TextDocument)
    {
        this.document = document;

        AlgDocumentData.setDocumentData(document, this);
    }

    public static getDocumentData(document: TextDocument): AlgDocumentData | undefined
    {
        return AlgDocumentData.algDocumentDataRegistry.get(document);
    }

    private static setDocumentData(document: TextDocument, data: AlgDocumentData): void
    {
        AlgDocumentData.algDocumentDataRegistry.set(document, data);
    }

    private parseDocument(document: TextDocument): void
    {
        this.algDocument = new Section(0, undefined, 0);

        let sectionStack: Section[] = [this.algDocument];
        let lastLineEmpty: boolean = false;
        for (let lineNumber: number = 0; lineNumber < document.lineCount; lineNumber++)
        {
            let line: TextLine = document.lineAt(lineNumber);

            if (line.isEmptyOrWhitespace)
            {
                lastLineEmpty = true;
            }
            else
            {
                if (this.isSectionHeading(line))
                {
                    let headingLevel: number = this.getHeadingLevel(line);
                    let currSection: Section;
                    
                    if (headingLevel > sectionStack[sectionStack.length - 1].level)
                    {
                        currSection = new Section(headingLevel, sectionStack[sectionStack.length - 1], lineNumber);
                        sectionStack.push(currSection);
                    }
                    else
                    {
                        while (headingLevel <=  sectionStack[sectionStack.length - 1].level)
                        {
                            let lastSection: Section = sectionStack[sectionStack.length - 1];
                            lastSection.end = lineNumber - (lastLineEmpty ? 2 : 1);
                            lastSection.hasBlankLine = lastLineEmpty;
                            
                            sectionStack.pop();

                            sectionStack[sectionStack.length - 1].subSections.push(lastSection);
                        }
                        currSection = new Section(headingLevel, sectionStack[sectionStack.length - 1], lineNumber);
                        sectionStack.push(currSection);
                    }
                }
                lastLineEmpty = false;
            }
        }

        while (sectionStack.length > 1)
        {
            let lastSection: Section = sectionStack[sectionStack.length - 1];
            lastSection.end = document.lineCount - (lastLineEmpty ? 2 : 1);
            lastSection.hasBlankLine = lastLineEmpty;

            sectionStack.pop();

            sectionStack[sectionStack.length - 1].subSections.push(lastSection);
        }

        sectionStack.pop();            
        this.algDocument.end = document.lineCount - (lastLineEmpty ? 2 : 1);
        this.algDocument.hasBlankLine = lastLineEmpty;
    
    }

    public getSection(cursorPosition: Position): Section | undefined
    {
        // TODO Optimizations will happen later.
        if (!this.algDocument)
        {
            return undefined;
        }
        else
        {
            let sectionFound: Section = this.algDocument;

            while (sectionFound.subSections.length !== 0)
            {
                let subSectionFound: Section | undefined;
                sectionFound.subSections.forEach(section => {
                    if (section.containsCursor(cursorPosition))
                    {
                        subSectionFound = section;
                    }    
                });

                if (subSectionFound)
                {
                    sectionFound = subSectionFound;
                }
                else
                {
                    break;
                }
            }

            return sectionFound;
        }
    }

    public promoteHeading(cursorPosition: Position, editor: TextEditor, edit: TextEditorEdit): void
    {
        let currentSection: Section | undefined = this.getSection(cursorPosition);
        if (currentSection)
        {
            currentSection.promoteHeading(editor, edit);
        }
    }

    public demoteHeading(cursorPosition: Position, editor: TextEditor, edit: TextEditorEdit): void
    {
        let currentSection: Section | undefined = this.getSection(cursorPosition);
        if (currentSection)
        {
            currentSection.demoteHeading(editor, edit);
        }        
    }

    public getNextSection(cursorPosition: Position): Section | undefined
    {
        let getNextSibling: (currentSection: Section) => Section | undefined;
        getNextSibling = section => {
            if (section.parent)
            {
                let indexOnParent: number = section.parent.subSections.indexOf(section);
                if (indexOnParent >= 0 && indexOnParent < section.parent.subSections.length - 1)
                {
                    return section.parent.subSections[indexOnParent + 1];
                }
                else
                {
                    return getNextSibling(section.parent);
                }
            }
            
            return undefined;
        };

        let currentSection: Section | undefined = this.getSection(cursorPosition);
        if (currentSection)
        {
            if (currentSection.subSections.length !== 0)
            {
                return currentSection.subSections[0];
            }
            else
            {
                return getNextSibling(currentSection);
            }
        }

        return undefined;
    }

    public getPreviousSection(cursorPosition: Position): Section | undefined
    {
        let currentSection: Section | undefined = this.getSection(cursorPosition);
        if (currentSection)
        {
            if (cursorPosition.line !== currentSection.start)
            {
                return currentSection;
            }
            else if (currentSection.parent)
            {
                let indexOnParent: number = currentSection.parent.subSections.indexOf(currentSection);
                if (indexOnParent >= 1)
                {
                    currentSection = currentSection.parent.subSections[indexOnParent - 1];
                    while (currentSection.subSections.length !== 0)
                    {
                        currentSection = currentSection.subSections[currentSection.subSections.length - 1];
                    }

                    return currentSection;
                }
                else if (currentSection.parent.level !== 0)
                {
                    return currentSection.parent;
                }
            }
        }

        return undefined;
    }

    public getNextSameLevelSection(cursorPosition: Position): Section | undefined
    {
        let currentSection: Section | undefined = this.getSection(cursorPosition);
        if (currentSection && currentSection.parent)
        {
            let indexOnParent: number = currentSection.parent.subSections.indexOf(currentSection);
            if (indexOnParent < currentSection.parent.subSections.length - 1)
            {
                for (let siblingIndex: number = indexOnParent + 1; siblingIndex < currentSection.parent.subSections.length; siblingIndex++)
                {
                    let sibling: Section = currentSection.parent.subSections[siblingIndex];
                    if (sibling.level === currentSection.level)
                    {
                        return sibling;
                    }
                }
            }
        }

        return undefined;
    }

    public getPreviousSameLevelSection(cursorPosition: Position): Section | undefined
    {
        let currentSection: Section | undefined = this.getSection(cursorPosition);
        if (currentSection && currentSection.parent)
        {
            let indexOnParent: number = currentSection.parent.subSections.indexOf(currentSection);
            if (indexOnParent > 0)
            {
                for (let siblingIndex: number = indexOnParent - 1; siblingIndex >= 0; siblingIndex--)
                {
                    let sibling: Section = currentSection.parent.subSections[siblingIndex];
                    if (sibling.level === currentSection.level)
                    {
                        return sibling;
                    }
                }
            }
        }

        return undefined;
    }

    public promoteSubtree(cursorPosition: Position, editor: TextEditor, edit: TextEditorEdit): void
    {
        let currentSection: Section | undefined = this.getSection(cursorPosition);
        if (currentSection)
        {
            currentSection.promoteSubtree(editor, edit);
        }
    }

    public demoteSubtree(cursorPosition: Position, editor: TextEditor, edit: TextEditorEdit): void
    {
        let currentSection: Section | undefined = this.getSection(cursorPosition);
        if (currentSection)
        {
            currentSection.demoteSubtree(editor, edit);
        }
    }

    public getHigherLevelHeading(cursorPosition: Position): Section | undefined
    {
        let currentSection: Section | undefined = this.getSection(cursorPosition);
        if (currentSection && currentSection.level > 1)
        {
            return currentSection.parent;
        }

        return undefined;
    }

    public insertNewHeading(cursorPosition: Position, editor: TextEditor, edit: TextEditorEdit): void
    {
        let currentSection: Section | undefined = this.getSection(cursorPosition);

        if (currentSection)
        {
            let strRepeat: (value: string, iterations: number) => string = (value, iterations) => {
                let result: string = '';
                for (let i = 0; i < iterations; ++i)
                {
                    result += value;
                }
                return result;
            };
            
            edit.insert(new Position(cursorPosition.line, 0), `\n${strRepeat('#', Math.min(currentSection.level, 1))} `);
        }
    }

    private isSectionHeading(line: TextLine): boolean
    {
        return /^[\#]{1,6}\s/.test(line.text);
    }

    private getHeadingLevel(line: TextLine): number
    {
        let punctuation = /^([\#]{1,6})\s/.exec(line.text);
        return punctuation ? punctuation[1].length : 0;
    }

    public getFoldingRanges(): FoldingRange[]
    {
        // TODO Look into ways of detecting document changes to avoid parsing the file again.
        this.parseDocument(this.document);

        if (this.algDocument)
        {
            return this.algDocument.getFoldingRanges() || [];
        }
        else
        {
            return [];
        }
    }
}