import admin from "firebase-admin";
export interface Note {
    title: string;
    content: string;
    timestamp: admin.firestore.Timestamp;
    userId: string; 
  }
  