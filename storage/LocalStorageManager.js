// storage/LocalStorageManager.js
import { StorageManager } from './StorageManager.js';

export class LocalStorageManager extends StorageManager {
    saveSession(session) {
        if (!session || !Array.isArray(session.questions) || session.questions.length === 0) {
            console.warn("Sessão ignorada: sem respostas registradas.");
            return;
        }

        const history = JSON.parse(localStorage.getItem('allSessions')) || [];
        history.push(session);
        localStorage.setItem('allSessions', JSON.stringify(history));
    }
    getAllSessions() {
        return JSON.parse(localStorage.getItem('allSessions')) || [];
    }
}