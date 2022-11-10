import { parseMemberForMinOutput } from 'src/member/serializers/member.serializer';
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

export interface MinOutputPage {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  notebooks?: NotebookMinOutput[];
  isOwner: boolean;
}

export const parsePageForOutput = (page: Page): OutputPage => {
  const output = {
    id: page.id,
    title: page.title,
    type: page.type,
    updatedAt: page.updatedAt,
    isPrivate: page.private,
    notebooks: undefined,
    members: [],
    owner: {
      id: page.owner.id,
      avatar: page.owner.avatar,
      username: page.owner.username,
    },
  };

  if (page.members?.length) {
    output.members = page.members.map(parseMemberForMinOutput);
  }

  if (page.type === PageType.notebook) {
    output.notebooks = page.notebooks
      ? page.notebooks.map(parseNotebookForMinOutput)
      : [];
  }

  return output;
};

export const parsePageForMinOutput = (
  page: Page,
  user: User,
): MinOutputPage => {
  const output = {
    id: page.id,
    title: page.title,
    type: page.type,
    createdAt: page.createdAt,
    notebooks: undefined,
    isOwner: page.owner.id === user.id,
  };

  if (page.type === PageType.notebook) {
    output.notebooks = page.notebooks.map(parseNotebookForMinOutput);
  }

  return output;
};
