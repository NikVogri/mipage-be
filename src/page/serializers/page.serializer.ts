import {
  NotebookMinOutput,
  parseNotebookForMinOutput,
} from 'src/notebook/serializers/notebook.serializer';
import { Page, PageType } from '../page.entity';
export interface OutputPage {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  members: {
    id: string;
    username: string;
    avatar: string;
  }[];
  owner: {
    id: string;
    avatar: string;
    username: string;
  };
}

export interface MinOutPutPage {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  notebooks?: NotebookMinOutput[];
}

export const parsePageForOutput = (page: Page): OutputPage => {
  const members = page.members.slice(0, 3).map((member) => ({
    id: member.id,
    avatar: member.avatar,
    username: member.username,
  }));

  return {
    id: page.id,
    title: page.title,
    type: page.type,
    createdAt: page.createdAt,
    members,
    owner: {
      id: page.owner.id,
      avatar: page.owner.avatar,
      username: page.owner.username,
    },
  };
};

export const parsePageForMinOutput = (page: Page): MinOutPutPage => {
  let notebooks = undefined;
  if (page.type === PageType.notebook) {
    notebooks = page.notebooks.map((notebook) =>
      parseNotebookForMinOutput(notebook),
    );
  }

  return {
    id: page.id,
    title: page.title,
    type: page.type,
    createdAt: page.createdAt,
    notebooks,
  };
};
