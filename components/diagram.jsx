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

    /* Test code: draw a red circle where the line starts
     */
    context.lineWidth = 10
    context.strokeStyle = "red"
    context.save()
    let origCircle = new Path2D()
    origCircle.arc(0, 0, 10, 0, 2 * Math.PI);
    context.stroke(origCircle)

    /* Test code: draw a red line down the left side of the element, 10px in
     */
    context.lineWidth = 5
    context.strokeStyle = "red"
    context.save()
    context.beginPath()
    context.lineTo(10, 10)
    context.lineTo(10, 2000)
    context.stroke()

    /* Test code: draw some green lines at different places
     */
    context.lineWidth = 3
    //context.fillStyle = '#c6f6d5'
    //context.shadowColor = '#c6f6d5'
    context.strokeStyle = '#68d391'
    context.shadowBlur = 20
    context.save()
    context.beginPath()
    context.lineTo(50, 100)
    context.lineTo(100, 50)
    context.lineTo(640, 480)
    context.lineTo(640, 1024)
    context.lineTo(0, 0)
    context.stroke()

    context.beginPath()
    console.log(`The lines object is a ${typeof this.state.connections}`)
    console.log(this.state.connections)
    if (!this.state.connections) {
      console.log("No connections to set")
      return;
    }
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
    /*
    context.beginPath()
    console.log(`The lines object is a ${typeof lines}`)
    console.log(lines)
    this.props.connections.forEach(connection => {
      const [source, target] = connection
      context.moveTo(source.x, source.y)
      context.lineTo(target.x, target.y)
    })
    context.stroke()
    */
  }

  render() {
    return (
      <canvas ref="canvas" />
    )
  }

}

/* Draw lines on the canvas between coordinates
 * lines: A list of pairs of DOMRect or Point objects as you might get from getBoundingClientRect()
 */
export const LineCanvas = ({ lines=null }) => {

  if (!lines) lines = [];

  /* useRef(null) seems to return a ref to this component
   */
  const canvasRef = useRef(null)

  /* note to self: useEffect() in a functional React component
   * can be used to accomplish the same thing as componentDidMount()
   * in a class-based React component
   */
  useEffect(() => {

    /* Sometimes this isn't set for some reason?
     */
    if(!canvasRef.current) {
      return
    }

    const canvas = canvasRef.current
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

    /* Test code: draw a red circle where the line starts
     */
    context.lineWidth = 10
    context.strokeStyle = "red"
    context.save()
    let origCircle = new Path2D()
    origCircle.arc(0, 0, 10, 0, 2 * Math.PI);
    context.stroke(origCircle)

    /* Test code: draw a red line down the left side of the element, 10px in
     */
    context.lineWidth = 5
    context.strokeStyle = "red"
    context.save()
    context.beginPath()
    context.lineTo(10, 10)
    context.lineTo(10, 2000)
    context.stroke()

    /* Test code: draw some green lines at different places
     */
    context.lineWidth = 3
    //context.fillStyle = '#c6f6d5'
    //context.shadowColor = '#c6f6d5'
    context.strokeStyle = '#68d391'
    context.shadowBlur = 20
    context.save()
    context.beginPath()
    context.lineTo(50, 100)
    context.lineTo(100, 50)
    context.lineTo(640, 480)
    context.lineTo(640, 1024)
    context.lineTo(0, 0)
    context.stroke()

    context.beginPath()
    console.log(`The lines object is a ${typeof lines}`)
    console.log(lines)
    lines.forEach(line => {
      let [source, target] = line
      context.moveTo(source.x, source.y)
      context.lineTo(target.x, target.y)
    })
    context.stroke()

  }, [canvasRef])
  return (
    <canvas ref={canvasRef} />
  )
}
