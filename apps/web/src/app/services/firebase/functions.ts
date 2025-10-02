import { db } from "./init";
import { collection, addDoc, getDocs} from 'firebase/firestore';
import { User } from "../../models/user";

export class FirebaseService {
    constructor() {}
    async addUser(user: User): Promise<void> {
        try{
            const docRef = await addDoc(collection(db, "users"), {
                first: user.firstName,
                last: user.lastName,
                email: user.email,
                birthDate: user.birthDate,
                password: user.password,
                role: user.role,
                favorites: user.favorites || [],
                lands: user.lands || []
            });
            console.log("Document written with ID: ", docRef.id);
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
                // users.push({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     email: data.email,
                //     birthDate: data.birthDate,
                //     password: data.password,
                //     role: data.role,
                //     favorites: data.favorites || [],
                //     lands: data.lands || []
                // });
            });
        } catch (e) {
            console.error("Error getting documents: ", e);
        }
        return users;
    }
}
