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