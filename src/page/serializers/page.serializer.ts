import {
  NotebookMinOutput,
  parseNotebookForMinOutput,
} from 'src/notebook/serializers/notebook.serializer';
import { User } from 'src/user/user.entity';
import { Page, PageType } from '../page.entity';

export interface OutputPage {
  id: string;
  title: string;
  type: string;
  updatedAt: Date;
  isPrivate: boolean;
  notebooks: {
    id: string;
    title: string;
  }[];
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
  isOwner: boolean;
}

export const parsePageForOutput = (page: Page): OutputPage => {
  const members = page.members
    ? page.members.slice(0, 3).map((member) => ({
        id: member.id,
        avatar: member.avatar,
        username: member.username,
      }))
    : [];

  const notebooks = page.notebooks
    ? page.notebooks.map((nb) => ({
        id: nb.id,
        title: nb.title,
      }))
    : [];

  return {
    id: page.id,
    title: page.title,
    type: page.type,
    updatedAt: page.updatedAt,
    isPrivate: page.private,
    notebooks: page.type === PageType.notebook ? notebooks : undefined,
    members,
    owner: {
      id: page.owner.id,
      avatar: page.owner.avatar,
      username: page.owner.username,
    },
  };
};

export const parsePageForMinOutput = (
  page: Page,
  user: User,
): MinOutPutPage => {
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
    isOwner: page.owner.id === user.id,
  };
};
