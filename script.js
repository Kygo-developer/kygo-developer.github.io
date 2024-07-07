require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});

require(['vs/editor/editor.main'], function () {
  let editor;
  let currentTab = 'html';

  // Initialize Monaco Editor with autosave feature
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: getDefaultContent('html'),
    language: 'html',
    theme: 'vs-dark',
    automaticLayout: true, // Adjust editor layout automatically
    autoIndent: true, // Automatically indent code
    formatOnType: true, // Format code on typing
    formatOnPaste: true, // Format code on paste
    wordWrap: 'on', // Enable word wrap
    tabSize: 2 // Set tab size to 2 spaces
  });

  // Switch tabs between HTML, CSS, and JavaScript
  window.switchTab = function (tab) {
    currentTab = tab;
    const lang = tab === 'css' ? 'css' : 'javascript';
    editor.getModel().setMode(`ace/mode/${lang}`);
    editor.setValue(getDefaultContent(lang));
  };

  // Run the code inside the editor (Alt + Enter)
  editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.Enter, function () {
    const htmlContent = editor.getValue();
    const previewFrame = document.getElementById('preview');
    const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    preview.write(htmlContent);
    preview.close();
  });

  // Function to get default content based on language
  function getDefaultContent(lang) {
    switch (lang) {
      case 'css':
        return 'body {\n  font-family: Arial, sans-serif;\n}\n';
      case 'javascript':
        return 'console.log("Hello, World!");';
      default: // HTML
        return '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Document</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>';
    }
  }

  // Autosave the content when typing stops for 2 seconds
  let saveTimeout;
  editor.onDidChangeModelContent(function () {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(function () {
      localStorage.setItem(`editorContent_${currentTab}`, editor.getValue());
    }, 2000); // Adjust the timeout as needed (e.g., 2000 milliseconds = 2 seconds)
  });

  // Load saved content from localStorage
  editor.setValue(localStorage.getItem(`editorContent_${currentTab}`) || getDefaultContent(currentTab));
});
