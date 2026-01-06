export class CreateUserDto {
  name!: string;
  email!: string;
  password!: string;
  role?: string;
  cpf?: string;
  registration?: string;
}

export class UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  cpf?: string;
  registration?: string;
  status?: string;
}
