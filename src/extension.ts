import * as vscode from 'vscode';
import { AlgFoldingRangeProvider } from './AlgFoldingRangeProvider';
import { AlgHeadingCommands } from './AlgHeadingCommands';

export function activate(context: vscode.ExtensionContext) {

	vscode.commands.registerTextEditorCommand('alg.promoteHeading', AlgHeadingCommands.promoteHeading);
	vscode.commands.registerTextEditorCommand('alg.demoteHeading', AlgHeadingCommands.demoteHeading);
	vscode.commands.registerTextEditorCommand('alg.nextHeading', AlgHeadingCommands.nextHeading);
	vscode.commands.registerTextEditorCommand('alg.previousHeading', AlgHeadingCommands.previousHeading);
	vscode.commands.registerTextEditorCommand('alg.nextSameLevelHeading', AlgHeadingCommands.nextSameLevelHeading);
	vscode.commands.registerTextEditorCommand('alg.previousSameLevelHeading', AlgHeadingCommands.previousSameLevelHeading);
	vscode.commands.registerTextEditorCommand('alg.backHigherLevelHeading', AlgHeadingCommands.backHigherLevelHeading);
	vscode.commands.registerTextEditorCommand('alg.promoteCurrentSubtree', AlgHeadingCommands.promoteSubtree);
	vscode.commands.registerTextEditorCommand('alg.demoteCurrentSubtree', AlgHeadingCommands.demoteSubtree);
	vscode.commands.registerTextEditorCommand('alg.insertNewHeading', AlgHeadingCommands.insertNewHeading);

	const algFoldingRangeProvider: AlgFoldingRangeProvider = new AlgFoldingRangeProvider();
	vscode.languages.registerFoldingRangeProvider({ scheme: 'file', language: 'alg' }, algFoldingRangeProvider);
}

export function deactivate() {}
