import v from 'validator';

type IdTarget =
  | 'pages'
  | 'todos'
  | 'todo-items'
  | 'members'
  | 'notifications'
  | 'notebooks'
  | 'notebook-blocks';

export const extractIdFromPath = (
  path: string,
  idTarget: IdTarget,
): string | null => {
  const splitPath = path.split('/');
  const IdIndex = path
    .split('/')
    .findIndex((p, i) => v.isUUID(p) && splitPath[i - 1] === idTarget);

  const id = splitPath[IdIndex];

  if (!id || !v.isUUID(id)) {
    return null;
  }

  return splitPath[IdIndex];
};
