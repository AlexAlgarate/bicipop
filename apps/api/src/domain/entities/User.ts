import { BaseEntity } from './BaseEntity';

interface UserProps {
  username: string;
  email: string;
  password: string;
  id: string;
  createdAt: Date;
}

export class User extends BaseEntity {
  readonly username: string;
  readonly email: string;
  readonly password: string;

  constructor({ username, email, password, id, createdAt }: UserProps) {
    super(id, createdAt);
    this.username = username;
    this.email = email;
    this.password = password;
  }
}
