import { User } from 'src/user/entities/user.entity';

export class UserDTO {
  username: string;
  firstName: string;
  lastName: string;
  email: string;

  constructor(user: User | null) {
    if (!user) return;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
  }
}
