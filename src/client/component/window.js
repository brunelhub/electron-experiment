/**
 * Component test with ViperHTML
 */

module.exports = (render, model) => render`

  <!DOCTYPE html>
  <html lang="${model.language}">
    <head>
      <title>${model.title}</title>
    </head>
    <body>
      <div>${model.main}</div>
      <div>${model.button}</div>
    </body>
  </html>
  
`;


