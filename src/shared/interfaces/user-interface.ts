import firebase from 'firebase/compat/app';

export interface UserInterface {
    uid?: string,
    name?: string, 
    email?: string,
    createdAt?: firebase.firestore.Timestamp | firebase.firestore.FieldValue | string,
    photoUrl?: string,
    isActive: boolean,
    lastLogin: firebase.firestore.Timestamp | firebase.firestore.FieldValue | string,
    tipo: string
}
