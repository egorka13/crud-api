import { User } from '../models/User';

export let users: User[] = [];

export function getUsers(): User[] {
  return users;
}

export function addUser(user: User) {
  users.push(user);
}

export function updateUser(userId: string, updatedUser: User) {
  const userIndex = findUserIndexById(userId);

  if (userIndex !== -1) {
    users[userIndex] = updatedUser;
  }
}

export function deleteUser(userId: string) {
  users = users.filter((user) => user.id !== userId);
}

export function findUserById(userId: string): User | undefined {
  return users.find((user) => user.id === userId);
}

export function findUserIndexById(userId: string): number {
  return users.findIndex((user) => user.id === userId);
}
