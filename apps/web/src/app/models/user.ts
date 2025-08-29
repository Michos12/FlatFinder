import { Land } from "./land";

export interface User {
  firstname: string;
  lastName: string;
  email: string;
  birthDate: string;
  password: string;
  role: string;
  favorites?: Land[];
}
