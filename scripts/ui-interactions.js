const toast = document.getElementById('toast');
const toastMessage = toast.querySelector('.toast-message');
const closeToastButton = toast.querySelector('.close-toast');
const modal = document.getElementById('previewModal');
const closeButton = document.getElementsByClassName('close')[0];
const uploadProgress = document.getElementById('uploadProgress');
const combineProgress = document.getElementById('combineProgress');
const loadingText = document.getElementById('loadingText');

let toastTimeout;

closeToastButton.addEventListener('click', () => {
    toast.classList.remove('show');
    clearTimeout(toastTimeout);
});

closeButton.onclick = () => { modal.style.display = 'none'; }

window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 10000); // Hide after 10 seconds
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
