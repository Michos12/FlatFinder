import { db } from "./init";
import { collection, getDocs, setDoc, doc, deleteDoc} from 'firebase/firestore';
import { Injectable } from '@angular/core';
import { User } from "../../models/user";

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    constructor() {}
    async addUser(user: User, merge?: boolean): Promise<void> {
        try{
            const newUser = await setDoc(doc(db, "users", String(user.email)), {
                first: user.firstName,
                last: user.lastName,
                email: user.email,
                birthDate: user.birthDate,
                password: user.password,
                role: user.role,
                favorites: user.favorites || [],
                lands: user.lands || []
            }, { merge: merge || false });
            console.log("Document written with ID: ", user.email);
        } catch (e){
            console.error("Error adding document: ", e);
        }
    }

    async getUsers(): Promise<User[]> {
        const users: User[] = [];
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log(doc.id, " => ", data);
                users.push({
                    firstName: data['name'],
                    lastName: data['lastName'],
                    email: data['email'],
                    birthDate: data['birthDate'],
                    password: data['password'],
                    role: data['role'],
                    favorites: data['favorites'] || [],
                    lands: data['lands'] || []
                });
            });
            console.log(users);
        } catch (e) {
            console.error("Error getting documents: ", e);
        }
        return users;
    }
    async deleteUser(email: string): Promise<void> {
        try {
            await deleteDoc(doc(db, 'users', `${email}`));
            console.log(`User deleted: ${email}`);
        } catch (e) {
            console.error(`Error deleting user: ${email}`, e);
        }
    }
}
