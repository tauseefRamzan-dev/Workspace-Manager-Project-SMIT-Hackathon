
const DB_NAME = 'WorkspaceManager';
const DB_VERSION = 1;

const STORES = {
  workspace: 'workspaces',
  project: 'projects',
  task: 'tasks',
  activity: 'activities',
};

let db = null;

export const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      for (const storeName of Object.values(STORES)) {
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: 'id' });
        }
      }
    };
  });
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('LocalStorage error:', error);
  }
};

export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('LocalStorage error:', error);
    return defaultValue;
  }
};

export const saveToIndexedDB = async (storeName, data) => {
  if (!db) await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const loadFromIndexedDB = async (storeName, id) => {
  if (!db) await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const loadAllFromIndexedDB = async (storeName) => {
  if (!db) await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
};

export const deleteFromIndexedDB = async (storeName, id) => {
  if (!db) await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const clearStore = async (storeName) => {
  if (!db) await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
};

export const exportData = async () => {
  const data = {};
  
  for (const [key, storeName] of Object.entries(STORES)) {
    data[key] = await loadAllFromIndexedDB(storeName);
  }
  
  data.auth = loadFromLocalStorage('currentUser');
  data.ui = loadFromLocalStorage('appUI');
  data.appState = loadFromLocalStorage('appState');
  data.exportedAt = new Date().toISOString();
  
  return data;
};

export const importData = async (data) => {
  try {
    if (!data || typeof data !== 'object' || (!data.appState && !['workspace', 'project', 'task', 'activity'].some(key => Array.isArray(data[key])))) {
      throw new Error('Invalid workspace backup format');
    }
    for (const [key, storeName] of Object.entries(STORES)) {
      if (data[key] && Array.isArray(data[key])) {
        await clearStore(storeName);
        for (const item of data[key]) {
          await saveToIndexedDB(storeName, item);
        }
      }
    }
    
    if (data.auth) {
      saveToLocalStorage('currentUser', data.auth);
    }
    if (data.ui) {
      saveToLocalStorage('appUI', data.ui);
    }
    if (data.appState && typeof data.appState === 'object') {
      saveToLocalStorage('appState', data.appState);
    }
    
    return true;
  } catch (error) {
    console.error('Import error:', error);
    return false;
  }
};

export const resetAllData = async () => {
  try {
    for (const storeName of Object.values(STORES)) {
      await clearStore(storeName);
    }
    
    localStorage.removeItem('currentUser');
    localStorage.removeItem('appUI');
    localStorage.removeItem('appState');
    localStorage.removeItem('theme');
    
    return true;
  } catch (error) {
    console.error('Reset error:', error);
    return false;
  }
};

export const isOffline = () => {
  return !navigator.onLine;
};
