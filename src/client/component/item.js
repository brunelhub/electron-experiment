/**
 * Component test with ViperHTML
 */

module.exports = (render, model) => render`

  <article class="item">
    <h1>${model.body}</h1>
  </article>
  
`;