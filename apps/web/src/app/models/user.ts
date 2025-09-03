import { Land } from "./land";

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  password: string;
  role: string;
  favorites?: Land[];
  lands?: Land[];
}
