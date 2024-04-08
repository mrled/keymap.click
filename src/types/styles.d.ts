/* *.css type definition
 *
 * Import CSS as raw string, which allows us to do this and get the CSS as a string:
 *    import cssString from 'index.css';
 *    const style = document.createElement('style');
 *    style.innerHTML = cssString;
 *
 * This goes with the '--loader:.css=text' argument to esbuild.
 */
declare module "*.css" {
  const content: string;
  export default content;
}

/* This provides similar typing for Vite-specific ?inline CSS imports,
 * which is Vite's way of importing CSS as a plain text string.
 * TODO: when we switch from Vite to esbuild for the main site, remove this.
 */
declare module "*.css?inline" {
  const content: string;
  export default content;
}
