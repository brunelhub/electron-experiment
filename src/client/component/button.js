/**
 * Component test with ViperHTML
 */

module.exports = (render, model) => render`

  <button onclick="${(e) => { e.preventDefault(); console.log('Hi there'); }}">Press me</button>
  
`;