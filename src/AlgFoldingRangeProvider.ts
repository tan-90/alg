import { CancellationToken } from 'vscode';
import { FoldingContext } from 'vscode';
import { FoldingRange } from 'vscode';
import { FoldingRangeProvider } from 'vscode';
import { ProviderResult } from 'vscode';
import { TextDocument } from 'vscode';

import { AlgDocumentData } from './AlgDocumentData';

export class AlgFoldingRangeProvider implements FoldingRangeProvider 
{  
    provideFoldingRanges(document: TextDocument, context: FoldingContext, token: CancellationToken): ProviderResult<FoldingRange[]>
    {
        let data = AlgDocumentData.getDocumentData(document);
        if (!data)
        {
            data = new AlgDocumentData(document);
        }

        return data.getFoldingRanges();
    }
}