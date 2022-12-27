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

export const parseNotebookForOutput = (notebook: Notebook) => {
  return {
    id: notebook.id,
    banner: null, // TODO: set as an actual value when implemented
    order: notebook.order,
    blocks: notebook.blocks,
    title: notebook.title,
  };
};
