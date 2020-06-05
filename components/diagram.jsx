import { useRef, useEffect } from "react";

import log from 'loglevel';

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
    const origBoundingRect = canvas.getBoundingClientRect()
    log.debug(
      "Original canvas dimensions:",
      "canvas.style.width:", canvas.style.width, ";",
      "canvas.style.height:", canvas.style.height, ";",
      "canvas.width:", canvas.width, ";",
      "canvas.height:", canvas.height, ";",
      "canvas.offsetWidth:", canvas.offsetWidth, ";",
      "canvas.offsetHeight:", canvas.offsetHeight, ";",
      "canvas.getBoundingClientRect():", origBoundingRect, ";",
    )
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    //canvas.width = canvas.offsetWidth
    //canvas.height = canvas.offsetHeight
    canvas.width = origBoundingRect.width
    canvas.height = origBoundingRect.height
    log.debug(
      "Updated canvas dimensions:",
      "canvas.style.width:", canvas.style.width, ";",
      "canvas.style.height:", canvas.style.height, ";",
      "canvas.width:", canvas.width, ";",
      "canvas.height:", canvas.height, ";",
      "canvas.offsetWidth:", canvas.offsetWidth, ";",
      "canvas.offsetHeight:", canvas.offsetHeight, ";",
      "canvas.getBoundingClientRect():", canvas.getBoundingClientRect(), ";",
    )

    /* Clear the canvas completely before drawing
      * Without this, fast refresh during development will show old paths and new paths
      * until you fully reload the page (e.g. with ctrl-r)
      */
    context.clearRect(0, 0, canvas.width, canvas.height);

    /* Draw each connection
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
      <canvas ref="canvas" />
    )
  }

}
