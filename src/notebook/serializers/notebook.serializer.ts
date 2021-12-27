import { Notebook } from '../notebook.entity';

export interface NotebookMinOutput {
  id: string;
  title: string;
}

export const parseNotebookForMinOutput = (
  notebook: Notebook,
): NotebookMinOutput => {
  return {
    id: notebook.id,
    title: notebook.title,
  };
};
