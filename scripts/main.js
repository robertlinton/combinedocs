// DOM Elements
const fileInput = document.getElementById('fileInput');
const fileGrid = document.getElementById('fileGrid');
const combineButton = document.getElementById('combineButton');
const downloadButton = document.getElementById('downloadButton');
const copyButton = document.getElementById('copyButton');
const clearButton = document.getElementById('clearButton');
const dropArea = document.getElementById('dropArea');

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

// Initialize Sortable
new Sortable(fileGrid, {
    animation: 150,
    ghostClass: 'blue-background-class',
    onEnd: updateFileNumbers
});