const DB_NAME = 'MemoriesDataBase';
const DB_VERSION = 4;
const DB_STORE_NAME = 'memories'
let DB;

export default {
	
	async getDb() {
		return new Promise((resolve, reject) => {
			if(DB){return resolve(DB);}
			let request = window.indexedDB.open(DB_NAME, DB_VERSION);
			
			request.onerror = e => {
				console.error(`Error opening Db ${e}`);
				reject('Error');
			};
			
			request.onsuccess = e => {
				DB = e.target.result;
				resolve(DB);
				console.log(`Opening ${DB_NAME} data base ${DB}`);
			}
			
			request.onupgradeneeded = e => {
				console.log('onupgradeneeded');
				let db = e.target.result;
				let objectStore = db.createObjectStore(DB_STORE_NAME, { keyPath: "date", autoIncrement : true })
				objectStore.createIndex("title", "title", { unique: false });
				objectStore.createIndex("date", "date", { unique: false });
				objectStore.createIndex("coment", "coment", { unique: false });
				objectStore.createIndex("video", "video", { unique: false });
			};
			
			
		});
	},
	async saveData(data) {
		let db = await this.getDb();
		return new Promise((resolve, reject) => {
			
			let transaction = db.transaction([DB_STORE_NAME], 'readwrite');
			
			transaction.oncomplete = () => {
				resolve()
				console.log(`Added ${Object(data)} to data base ${DB}`);
			};
			
			let store = transaction.objectStore(DB_STORE_NAME);
			store.put(data);
		});
	},
	async getAllData() {
		let db = await this.getDb();
		
		return new Promise(resolve => {
			
			let transaction = db.transaction([DB_STORE_NAME], 'readonly');
			
			transaction.oncomplete = () => {
				resolve(data);
			};
			
			let store = transaction.objectStore('memories');
			let data = [];
			
			store.getAll().onsuccess = (event) => {
				data = event.target.result;
			}
			
		})
	}
}