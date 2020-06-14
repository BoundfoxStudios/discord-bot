import { Guild, Role } from '../deps.ts';

export const getRoleByName = (guild: Guild, roleName: string): Role | undefined => {
  return guild.roles.find(role => role.name === roleName);
}
