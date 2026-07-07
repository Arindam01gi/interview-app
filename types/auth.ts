export interface User {
  id: string;
  name: string;
  email: string;
}

export interface StoredUser extends User {
  passwordHash: string;
}
