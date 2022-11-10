import { User } from 'src/user/user.entity';

export const parseMemberForOutput = (member: User) => ({
  id: member.id,
  username: member.username,
  email: member.email,
  avatar: member.avatar,
});

export const parseMemberForMinOutput = (member: User) => ({
  id: member.id,
  username: member.username,
  avatar: member.avatar,
});
