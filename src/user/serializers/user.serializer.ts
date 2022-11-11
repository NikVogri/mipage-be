import { User } from '../user.entity';

export interface OutputUser {
  id: string;
  email: string;
  username: string;
  avatar: string;
  bio: string;
  createdAt: Date;
}

export const parseUserForOutput = (user: User): OutputUser => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    bio: user.bio,
    createdAt: user.createdAt,
  };
};
