const fileInput = document.getElementById('fileInput');
const fileGrid = document.getElementById('fileGrid');
const combineButton = document.getElementById('combineButton');
const downloadButton = document.getElementById('downloadButton');
const copyButton = document.getElementById('copyButton');
const combinedContent = document.getElementById('combinedContent');
const loadingIndicator = document.getElementById('loadingIndicator');
const clearButton = document.getElementById('clearButton');
const dropArea = document.getElementById('dropArea');
const combinedContentContainer = document.getElementById('combinedContentContainer');
const toast = document.getElementById('toast');
const modal = document.getElementById('previewModal');
const closeButton = document.getElementsByClassName('close')[0];
const previewFileName = document.getElementById('previewFileName');
const previewContent = document.getElementById('previewContent');
const uploadProgress = document.getElementById('uploadProgress');
const combineProgress = document.getElementById('combineProgress');
const loadingText = document.getElementById('loadingText');
let files = [];

// Event Listeners
fileInput.addEventListener('change', (event) => handleFiles(event.target.files));
dropArea.addEventListener('dragover', handleDragOver);
dropArea.addEventListener('dragleave', handleDragLeave);
dropArea.addEventListener('drop', handleDrop);
combineButton.addEventListener('click', combineFiles);
downloadButton.addEventListener('click', downloadCombinedFile);
copyButton.addEventListener('click', copyToClipboard);
clearButton.addEventListener('click', clearFiles);
closeButton.onclick = () => { modal.style.display = 'none'; }
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Functions
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

function updateProgress(uploadedFiles, totalFiles) {
    const percent = (uploadedFiles / totalFiles) * 100;
    const progressFill = uploadProgress.querySelector('.progress-fill');
    const progressText = uploadProgress.querySelector('.progress-text');
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${Math.round(percent)}%`;
    if (uploadedFiles === totalFiles) {
        uploadProgress.style.display = 'none';
    }
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

function handleDragOver(event) {
    event.preventDefault();
    dropArea.classList.add('drag-over');
}

function handleDragLeave(event) {
    dropArea.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    dropArea.classList.remove('drag-over');
    handleFiles(event.dataTransfer.files);
}

function getFileIcon(fileName) {
    return '📄';
}

function updateButtonStates() {
    const hasFiles = files.length > 0;
    combineButton.disabled = !hasFiles;
    clearButton.disabled = !hasFiles;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

async function combineFiles() {
    loadingIndicator.style.display = 'block';
    combineProgress.style.display = 'block';
    combinedContentContainer.style.display = 'none';
    let combined = '';
    const fileCards = fileGrid.querySelectorAll('.file-card');
    const totalFiles = fileCards.length;
    let processedFiles = 0;

    try {
        for (const card of fileCards) {
            const fileName = card.querySelector('.file-name').textContent;
            const fileNumber = card.querySelector('.file-number').textContent;
            const file = files.find(f => f.name === fileName);
            if (file) {
                const content = await file.text();
                combined += `${fileNumber} ${file.name}\n${content}\n\n`;
                processedFiles++;
                await simulateCombineProgress(processedFiles, totalFiles);
            }
        }
        combinedContent.value = combined.trim();
        combinedContentContainer.style.display = 'block';
        showToast('Files combined successfully!');
    } catch (error) {
        showToast('Error combining files. Please try again.');
        console.error('Error combining files:', error);
    } finally {
        loadingIndicator.style.display = 'none';
        combineProgress.style.display = 'none';
    }
}

function simulateCombineProgress(processed, total) {
    return new Promise(resolve => {
        const progressFill = combineProgress.querySelector('.progress-fill');
        const progressText = combineProgress.querySelector('.progress-text');
        const percent = (processed / total) * 100;
        const duration = 500 + Math.random() * 1000; // Random duration between 500ms and 1500ms

        progressFill.style.width = `${percent}%`;
        progressText.textContent = `${Math.round(percent)}%`;
        loadingText.textContent = `Combining... ${processed}/${total} files`;

        setTimeout(resolve, duration);
    });
}

function downloadCombinedFile() {
    try {
        const blob = new Blob([combinedContent.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'combined_text.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('File downloaded successfully!');
    } catch (error) {
        showToast('Error downloading file. Please try again.');
        console.error('Error downloading file:', error);
    }
}

function copyToClipboard() {
    try {
        combinedContent.select();
        document.execCommand('copy');
        showToast('Content copied to clipboard!');
    } catch (error) {
        showToast('Error copying to clipboard. Please try again.');
        console.error('Error copying to clipboard:', error);
    }
}

function clearFiles() {
    files = [];
    fileGrid.innerHTML = '';
    combinedContent.value = '';
    combinedContentContainer.style.display = 'none';
    combineProgress.style.display = 'none';
    updateButtonStates();
    showToast('All files cleared.');
    console.log('All files cleared');
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

// Initialize Sortable
new Sortable(fileGrid, {
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd: updateFileNumbers
});