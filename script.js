require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' }});
require(['vs/editor/editor.main'], function () {
  let editors = {};
  let currentTab = 'html';

  editors.html = monaco.editor.create(document.getElementById('editor'), {
    value: [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '  <title>Document</title>',
      '</head>',
      '<body>',
      '  <h1>Hello World</h1>',
      '</body>',
      '</html>'
    ].join('\n'),
    language: 'html',
    theme: 'vs-dark'
  });

  editors.css = monaco.editor.create(document.getElementById('editor'), {
    value: 'body {\n  font-family: Arial, sans-serif;\n}\n',
    language: 'css',
    theme: 'vs-dark'
  });
  editors.css.getContainerDomNode().style.display = 'none';

  editors.javascript = monaco.editor.create(document.getElementById('editor'), {
    value: 'console.log("Hello, World!");',
    language: 'javascript',
    theme: 'vs-dark'
  });
  editors.javascript.getContainerDomNode().style.display = 'none';

  window.switchTab = function (tab) {
    if (currentTab !== tab) {
      editors[currentTab].getContainerDomNode().style.display = 'none';
      editors[tab].getContainerDomNode().style.display = 'block';
      editors[tab].layout();
      currentTab = tab;
    }
  };

  window.saveFile = function () {
    const blob = new Blob([editors[currentTab].getValue()], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${currentTab}.txt`;
    a.click();
  };

  window.openFile = function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/plain';
    input.onchange = function (e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e) {
        editors[currentTab].setValue(e.target.result);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  window.runCode = function () {
    const htmlContent = editors.html.getValue();
    const cssContent = `<style>${editors.css.getValue()}</style>`;
    const jsContent = `<script>${editors.javascript.getValue()}<\/script>`;

    const previewFrame = document.getElementById('preview');
    const preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    preview.write(htmlContent + cssContent + jsContent);
    preview.close();
  };
});
