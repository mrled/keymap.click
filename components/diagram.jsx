import { useRef, useEffect } from "react";

export class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

export class ConnectorCanvas extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  setConnections(connections) {
    this.setState({connections: connections});
  }

  updateCanvas() {
    const canvas = this.refs.canvas
    const context = canvas.getContext('2d')

    /* Without setting the h/w here, canvas will be some arbitrary small size
     * canvas.style.{w/h} is the CSS 'style' property of the element in the DOM,
     * while canvas.{w/h} is the _internal_ dimensions for drawing on.
     * The following code scales all pixels on the canvas properly to the DOM's pixel size.
     */
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    /* Clear the canvas completely before drawing
      * Without this, fast refresh during development will show old paths and new paths
      * until you fully reload the page (e.g. with ctrl-r)
      */
    context.clearRect(0, 0, canvas.width, canvas.height);

    /* Draw each connection
     */
    console.log(`The lines object is a ${typeof this.state.connections}`)
    console.log(this.state.connections)
    if (!this.state.connections) {
      console.log("No connections to set")
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
      <canvas ref="canvas" />
    )
  }

}
