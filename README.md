# CombineDocs
A web-based application that allows users to upload multiple text files, reorder them, and combine them into a single document.

## Features

- **File Upload**: Drag and drop or select multiple text files.
- **File Management**: 
  - Preview uploaded files
  - Delete individual files
  - Reorder files via drag-and-drop
- **File Combination**: Merge all uploaded files into a single document.
- **Download**: Save the combined document as a text file.
- **Copy to Clipboard**: Easily copy the combined content.
- **Responsive Design**: Works well on both desktop and mobile devices.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- [Sortable.js](https://github.com/SortableJS/Sortable) for drag-and-drop reordering
- [Font Awesome](https://fontawesome.com/) for icons

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/robertlinton/combinedocs.git
   ```
2. Open `index.html` in your web browser.

## Usage

1. Upload files by clicking the "Choose Files" button or dragging and dropping files onto the designated area.
2. Reorder files by dragging the file cards.
3. Preview file contents by clicking the eye icon on each file card.
4. Remove unwanted files using the delete (x) button on each file card.
5. Click "Combine Files" to merge all uploaded files.
6. View the combined content in the text area.
7. Download the combined file or copy its content to the clipboard.

## Project Structure

- `index.html`: The main HTML file
- `styles.css`: Contains all the CSS for styling the application
- `script.js`: The JavaScript file with all the application logic

## Browser Compatibility

This application is compatible with modern web browsers including:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge
- Safari

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
