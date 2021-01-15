/*const player = document.querySelector('#player');
const handleSuccess = (stream) => {
	if(window.URL){
		player.srcObject = stream;
	} else {
		player.src = stream;
	}
	
}*/

	import idb from '/idb.js';

  
  	const model = {
		init() {
			this.player = document.getElementById('player');
			this.downloadLink = document.getElementById('download');
			this.stopButton = document.getElementById('stop');
			this.startButton = document.getElementById('start');
			this.pauseButton = document.getElementById('pause');
			this.titleInput = document.getElementById('videoTitle');
			this.comentInput = document.getElementById('videoComent');
			if (!window.indexedDB) {
				console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
			}else{
				/*window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
				// DON'T use "var indexedDB = ..." if you're not in a function.
				// Moreover, you may need references to some window.IDB* objects:
				window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
				window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
				// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
				//let us open our database
				const DBOpenReq = indexedDB.open("MemoriesDataBase", 4);
				//let handle error
				*/
				 idb.getDb();
				 this.getVideoDataFromIDB();
			}
		},
		getVideoDataFromIDB() {
			idb.getAllData().then(data => console.log(data));
		},
		saveVideoDataToIDB() {
			
		},
		handleSuccess: function(stream) {
			
			const options = {mimeType: 'video/webm;codecs=vp9,opus'};
			let recordedChunks;
			const mediaRecorder = new MediaRecorder(stream, options);

			mediaRecorder.addEventListener('dataavailable', function(e) {
				
			  if (e.data.size > 0) {
				recordedChunks = e.data;
			  }

			  console.log(recordedChunks);
			});

			mediaRecorder.addEventListener('start', function() {
			  console.log("start", mediaRecorder.state);
			  
			});
			mediaRecorder.addEventListener('pause', function() {
				console.log("pause", mediaRecorder.state);
			});
			mediaRecorder.addEventListener('resume', function() {
				console.log("resume", mediaRecorder.state);
			});
			mediaRecorder.addEventListener('stop', function() {
				const mem = {
					title: model.titleInput.value,
					date: new Date().toUTCString(),
					coment:model.comentInput.value,
					video: recordedChunks
				};
			  console.log("stop");
			  idb.saveData(mem);
			  model.downloadLink.href = URL.createObjectURL(mem.video);
			  model.downloadLink.download = 'acetest.webm';
			});
			model.stopButton.addEventListener('click', function() {
				
				mediaRecorder.stop();
				model.titleInput.value = '';
				model.comentInput.value = '';
			})
			model.startButton.addEventListener('click', function() {
				
				mediaRecorder.start();
			})
			model.pauseButton.addEventListener('click', function() {
				
				if(model.pauseButton.classList.contains('pause')){
					model.pauseButton.classList.remove('pause');
					model.pauseButton.classList.add('resume');
					mediaRecorder.resume();
				}else if(model.pauseButton.classList.contains('resume')){
					model.pauseButton.classList.remove('resume');
					model.pauseButton.classList.add('pause');
					mediaRecorder.pause();
				}
					
			})

			
			model.player.srcObject = stream;
		}
	}
	
	const octopuss = {
		init() {
			model.init();
			
			const constraints = {
				audio:false,  
				video: true
			};
			navigator.mediaDevices
				.getUserMedia(constraints)
				.then(model.handleSuccess);
			}
	}
	
	const display = {
		
	}
	
	window.addEventListener('load', () => {
		octopuss.init();
	})
	
  

	
	
	