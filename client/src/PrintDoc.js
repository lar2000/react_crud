// print.js
export const printContent = (content) => {
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Content</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .container { max-width: 600px; margin: auto; }
          .d-flex { display: flex; justify-content: space-between; padding: 8px 0; }
          .fw-bold { font-weight: bold; }
          .border-bottom { border-bottom: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          ${content}
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };