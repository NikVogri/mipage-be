import { NotebookBlock } from '../notebook-block.entity';

export interface NotebookMinOutput {
  id: string;
  title: string;
}

export const parseNotebookBlockForOutput = (notebookBlock: NotebookBlock) => {
  return {
    id: notebookBlock.id,
    content: notebookBlock.content,
    type: notebookBlock.type,
  };
};
