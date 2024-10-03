document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('fileInput');
    const filesList = document.getElementById('filesList');
    const uploadFileButton = document.getElementById('uploadFileButton');

    // Load files from localStorage when the page loads
    loadFiles();

    // Upload file event listener
    uploadFileButton.addEventListener('click', function () {
        const fileType = document.getElementById('fileType').value;

        if (fileInput.files.length === 0) {
            alert('Please select a file to upload.');
            return;
        }

        const file = fileInput.files[0];
        addFileItem(file, fileType);
        saveFileToLocalStorage(file, fileType);
        fileInput.value = ''; // Clear the input
        alert('File uploaded successfully!');
    });

    // Add file item to the DOM
    function addFileItem(file, fileType, isLoaded = false) {
        const fileItem = document.createElement('div');
        fileItem.classList.add('fileItem');
        fileItem.style.cssText = `
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        `;
        fileItem.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #007BFF;">${file.name}</h3>
            <div class="fileDetails" style="display: flex; flex-direction: column; gap: 10px;">
                <div><strong>Type:</strong> ${fileType.charAt(0).toUpperCase() + fileType.slice(1)}</div>
                <div><strong>Format:</strong> ${file.type}</div>
                <div><strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB</div>
            </div>
            <p style="margin: 8px 0; color: #555; line-height: 1.6;">A newly uploaded ${fileType} file.</p>
            <div class="buttons" style="display: flex; gap: 10px; margin-top: 10px;">
                <button class="button deleteButton" style="padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer; color: #fff; background-color: #dc3545;">Delete</button>
            </div>
        `;

        // Add delete functionality to the button
        fileItem.querySelector('.deleteButton').addEventListener('click', function () {
            filesList.removeChild(fileItem);
            deleteFileFromLocalStorage(file.name);
        });

        // Add watch/view button if the file type is video
        if (fileType === 'video' && file.type === 'video/mp4') {
            const watchButton = document.createElement('button');
            watchButton.classList.add('button');
            watchButton.style.cssText = `
                padding: 8px 16px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                color: #fff;
                background-color: #28a745;
            `;
            watchButton.innerText = 'Watch Video';

            // Add event listener for watching video
            watchButton.addEventListener('click', function () {
                const videoModal = document.createElement('div');
                videoModal.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                `;

                const videoPlayer = document.createElement('video');
                videoPlayer.controls = true;
                videoPlayer.style.cssText = 'max-width: 90%; max-height: 90%;';
                videoPlayer.src = URL.createObjectURL(file);

                videoModal.appendChild(videoPlayer);

                // Close the modal when clicking outside the video
                videoModal.addEventListener('click', function (e) {
                    if (e.target === videoModal) {
                        document.body.removeChild(videoModal);
                    }
                });

                document.body.appendChild(videoModal);
            });

            fileItem.querySelector('.buttons').appendChild(watchButton);
        }

        filesList.appendChild(fileItem);
    }

    // Save file details to localStorage
    function saveFileToLocalStorage(file, fileType) {
        const reader = new FileReader();
        reader.onload = function () {
            const files = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
            files.push({
                name: file.name,
                type: file.type,
                size: file.size,
                fileType: fileType,
                content: reader.result
            });
            localStorage.setItem('uploadedFiles', JSON.stringify(files));
        };
        reader.readAsDataURL(file);
    }

    // Load files from localStorage
    function loadFiles() {
        const files = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
        files.forEach(file => {
            const blob = dataURLToBlob(file.content);
            const newFile = new File([blob], file.name, { type: file.type });
            addFileItem(newFile, file.fileType, true);
        });
    }

    // Convert data URL to Blob
    function dataURLToBlob(dataURL) {
        const parts = dataURL.split(',');
        const byteString = atob(parts[1]);
        const mimeString = parts[0].split(':')[1].split(';')[0];

        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    // Delete file from localStorage
    function deleteFileFromLocalStorage(fileName) {
        let files = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
        files = files.filter(file => file.name !== fileName);
        localStorage.setItem('uploadedFiles', JSON.stringify(files));
    }
});
