function handleFiles(fileList) {
    const duplicateFiles = [];
    let newFiles = [];
    let totalFiles = fileList.length;
    let uploadedFiles = 0;

    for (const file of fileList) {
        if (file.type === 'text/plain') {
            if (!isFileAlreadyUploaded(file)) {
                newFiles.push(file);
            } else {
                duplicateFiles.push(file.name);
                console.log(`Duplicate file: ${file.name}`);
            }
        } else {
            showToast('Only text files are allowed.');
            console.log(`Invalid file type: ${file.name}`);
        }
    }

    if (newFiles.length > 0) {
        uploadProgress.style.display = 'block';
        uploadProgress.querySelector('.progress-fill').style.width = '0%';
        uploadProgress.querySelector('.progress-text').textContent = '0%';
        
        const progressInterval = setInterval(() => {
            if (uploadedFiles < newFiles.length) {
                const file = newFiles[uploadedFiles];
                files.push(file);
                createFileCard(file);
                uploadedFiles++;
                updateProgress(uploadedFiles, newFiles.length);
                updateFileNumbers();
            } else {
                clearInterval(progressInterval);
                uploadProgress.style.display = 'none';
                if (duplicateFiles.length > 0) {
                    showToast(`Files "${duplicateFiles.join(', ')}" have already been uploaded.`);
                }
                updateButtonStates();
                fileInput.value = '';
            }
        }, 500);
    } else if (duplicateFiles.length > 0) {
        showToast(`Files "${duplicateFiles.join(', ')}" have already been uploaded.`);
    }

    updateButtonStates();
    fileInput.value = '';
}

function isFileAlreadyUploaded(file) {
    return files.some(existingFile => existingFile.name === file.name && existingFile.size === file.size && existingFile.lastModified === file.lastModified);
}

function createFileCard(file) {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.innerHTML = `
        <div class="file-number"></div>
        <div class="file-icon">${getFileIcon(file.name)}</div>
        <div class="file-name">${file.name}</div>
        <button class="preview-button" title="Preview"><i class="fas fa-eye"></i></button>
        <span class="delete-icon" title="Delete"><i class="fas fa-times"></i></span>
    `;
    card.querySelector('.delete-icon').addEventListener('click', () => {
        const index = files.indexOf(file);
        if (index > -1) {
            files.splice(index, 1);
            card.remove();
            updateButtonStates();
            updateFileNumbers();
            console.log(`File removed: ${file.name}`);
        }
    });
    card.querySelector('.preview-button').addEventListener('click', () => previewFile(file));
    fileGrid.appendChild(card);
}

function updateFileNumbers() {
    const fileCards = fileGrid.querySelectorAll('.file-card');
    fileCards.forEach((card, index) => {
        card.querySelector('.file-number').textContent = `#${index + 1}`;
    });
}

async function previewFile(file) {
    try {
        const content = await file.text();
        previewFileName.textContent = file.name;
        previewContent.textContent = content;
        modal.style.display = 'block';
    } catch (error) {
        showToast('Error loading file preview. Please try again.');
        console.error('Error loading file preview:', error);
    }
}