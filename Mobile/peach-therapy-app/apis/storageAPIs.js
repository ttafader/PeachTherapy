import { storage } from './firebaseConfig'
import { ref, listAll, getBytes, getDownloadURL } from "firebase/storage";

export async function getWavFileFromStorage(url) {
    const storageRef = ref(storage, url);
    return await getDownloadURL(storageRef)
}

export async function getTextFileFromStorage(url) {
    const storageRef = ref(storage, url);
    const dlURL = await getDownloadURL(storageRef)

    try {
        const response = await fetch(dlURL);
        if (!response.ok) {
            throw new Error('Failed to fetch the text file');
        }
        const text = await response.text();
        const lines = text.split('\n');
        return lines;
    } catch (error) {
        console.error('Error fetching text file:', error);
        return [];
    }
}



async function fetchTextFileLines(url) {

}