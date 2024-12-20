export default class LocalDB {
  DEFAULT_DB_NAME = "tasky";
  DEFAULT_STORE_NAME = "tasky_store";
  private dbName: string;
  private dbVersion: number;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(
    dbName: string = this.DEFAULT_DB_NAME,
    storeName: string = this.DEFAULT_STORE_NAME,
    dbVersion: number = 1
  ) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.dbVersion = dbVersion;
  }

  // Open the database
  async open(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onerror = (event) => {
        reject(`Failed to open database: ${request.error}`);
      };
    });
  }

  // Add or update data
  async set(key: string | number | null, value: any): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const request = key
        ? store.put({ id: key, ...value }) // Update
        : store.add(value); // Add

      request.onsuccess = () => resolve();
      request.onerror = (event) =>
        reject(`Failed to set data: ${request.error}`);
    });
  }

  // Get data by key
  async get(key: string | number): Promise<any> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);

      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        reject(`Failed to get data: ${request.error}`);
    });
  }

  // Get all data
  async getAll(): Promise<any[]> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);

      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) =>
        reject(`Failed to get all data: ${request.error}`);
    });
  }

  // Delete data by key
  async delete(key: string | number): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = (event) =>
        reject(`Failed to delete data: ${request.error}`);
    });
  }

  // Clear all data in the store
  async clear(): Promise<void> {
    if (!this.db) await this.open();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);

      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = (event) =>
        reject(`Failed to clear store: ${request.error}`);
    });
  }

  // Close the database
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}
