import { initializeApp } from "firebase/app";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBqGOXZdZ_5Xc0kshufOXwZHbW2vPmOuTs",
  authDomain: "wholesale-7a3c2.firebaseapp.com",
  databaseURL: "https://wholesale-7a3c2-default-rtdb.firebaseio.com",
  projectId: "wholesale-7a3c2",
  storageBucket: "wholesale-7a3c2.firebasestorage.app",
  messagingSenderId: "502311578585",
  appId: "1:502311578585:web:f2a8fc27d9902113c347c8",
  measurementId: "G-XP25PL56QC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const propertiesCollection = collection(db, "properties");
const buyersCollection = collection(db, "buyers");

function mapSnapshot(snapshot) {
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

export async function fetchDeals() {
  const snapshot = await getDocs(propertiesCollection);
  return mapSnapshot(snapshot);
}

export async function saveDeal(property) {
  const propertyRef = doc(propertiesCollection, property.id);
  await setDoc(propertyRef, property);
}

export async function deleteDealById(id) {
  const propertyRef = doc(propertiesCollection, id);
  await deleteDoc(propertyRef);
}

export async function fetchBuyers() {
  const snapshot = await getDocs(buyersCollection);
  return mapSnapshot(snapshot);
}

export async function saveBuyer(buyer) {
  const buyerRef = doc(buyersCollection, buyer.id);
  await setDoc(buyerRef, buyer);
}

export async function deleteBuyerById(id) {
  const buyerRef = doc(buyersCollection, id);
  await deleteDoc(buyerRef);
}
