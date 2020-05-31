import { useRef, useEffect } from "react";

export const LineCanvas = ({position1, position2}) => {

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
  }, [canvasRef])
  return (
    <canvas ref={canvasRef} />
  )
}
