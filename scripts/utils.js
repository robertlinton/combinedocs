function getFileIcon(fileName) {
    return '📄';
}

function updateButtonStates() {
    const hasFiles = files.length > 0;
    combineButton.disabled = !hasFiles;
    clearButton.disabled = !hasFiles;
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
