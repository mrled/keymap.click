import log from 'loglevel';

export class Diagram extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  setConnections(connections) {
    this.setState({connections: connections});
  }

  updateCanvas() {
    const canvas = this.refs.canvas
    const container = this.refs.container
    const context = canvas.getContext('2d')

    /* Without setting the h/w here, canvas will be some arbitrary small size
     * canvas.style.{w/h} is the CSS 'style' property of the element in the DOM,
     * while canvas.{w/h} is the _internal_ dimensions for drawing on.
     * We want our canvas to cover the entire screen,
     * so this relies on the container being position: absolute in the top left
     * and width/height at 100%,
     * while the canvas should also be position: absolute and overflow: visible.
     */
    canvas.style.width = `${container.scrollWidth}px`
    canvas.style.height = `${container.scrollHeight}px`
    canvas.width = container.scrollWidth
    canvas.height = container.scrollHeight

    /* Clear the canvas completely before drawing
      * Without this, fast refresh during development will show old paths and new paths
      * until you fully reload the page (e.g. with ctrl-r)
      */
    context.clearRect(0, 0, canvas.width, canvas.height);

    /* Draw each connection
     * Now that the canvas is the size of the entire screen,
     * we can easily just draw lines connecting the bounding rectangles of the sources/targets.
     */
    log.debug(`The lines object is a ${typeof this.state.connections}, and it logs as:`)
    log.debug(this.state.connections)
    if (!this.state.connections) {
      log.debug("No connections to set")
      return;
    }
    context.strokeStyle = "green"
    context.lineWidth = 1
    context.beginPath()
    this.state.connections.forEach(connection => {
      const [source, target] = connection
      context.moveTo(source.x, source.y)
      context.lineTo(target.x, target.y)
    })
    context.stroke()
  }

  componentDidMount() {
    this.updateCanvas()
  }

  componentDidUpdate() {
    this.updateCanvas()
  }

  render() {
    return (
      <div ref="container" id="keyblay-debug-canvas-container" className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <canvas ref="canvas" id="keyblay-debug-canvas" className="absolute overflow-visible" />
      </div>
    )
  }

}
