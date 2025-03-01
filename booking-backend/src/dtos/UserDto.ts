export class UserDto {
    id: number;
    name: string;
    email: string;
    tel: string;

  
    constructor(user: any) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.tel = user.tel;
    }
  }
  