import { useRef, useEffect, useState } from "react";
import { useWindowSize } from "~/lib/hooks";
import log from "loglevel";

export const Diagram = ({ connections }) => {
  const canvas = useRef();
  const container = useRef();
  const [docHeight, setDocHeight] = useState(0);
  const currentBrowserWidth = useWindowSize();

  const updateCanvas = () => {
    if (!canvas) return;
    if (!canvas.current) return;

    const context = canvas.current.getContext("2d");
    console.log("updateCanvas");

    /* Without setting the h/w here, canvas will be some arbitrary small size
     * canvas.style.{w/h} is the CSS 'style' property of the element in the DOM,
     * while canvas.{w/h} is the _internal_ dimensions for drawing on.
     * We want our canvas to cover the entire screen,
     * so this relies on the container being position: absolute in the top left
     * and width/height at 100%,
     * while the canvas should also be position: absolute and overflow: visible.
     */
    canvas.current.style.width = `${container.current.scrollWidth}px`;
    canvas.current.style.height = `${container.current.scrollHeight}px`;
    canvas.current.width = container.current.scrollWidth;
    canvas.current.height = container.current.scrollHeight;

    /* Clear the canvas completely before drawing
     * Without this, fast refresh during development will show old paths and new paths
     * until you fully reload the page (e.g. with ctrl-r)
     */
    context.clearRect(0, 0, canvas.current.width, canvas.current.height);

    /* Draw each connection
     * Now that the canvas is the size of the entire screen,
     * we can easily just draw lines connecting the bounding rectangles of the sources/targets.
     */
    log.debug(`The lines object is a ${typeof connections}, and it logs as:`);
    log.debug(connections);
    if (!connections) {
      log.debug("No connections to set");
      return;
    }
    context.strokeStyle = "#68d391";
    context.lineWidth = 1;
    context.beginPath();
    connections.forEach((connection) => {
      const [source, target] = connection;
      context.moveTo(source.x, source.y);
      context.lineTo(target.x, target.y);
    });
    context.stroke();
  };

  useEffect(() => {
    const body = document.body,
      html = document.documentElement;

    // https://stackoverflow.com/a/1147768
    const height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    setDocHeight(height);
  }, [currentBrowserWidth]);

  useEffect(() => void updateCanvas(), []);
  useEffect(() => {
    updateCanvas();
  }, [connections]);

  return (
    <div
      ref={container}
      id="keyblay-debug-canvas-container"
      style={{ height: docHeight, width: "100%" }}
      className="absolute top-0 left-0 w-full pointer-events-none z-50"
    >
      <canvas
        ref={canvas}
        id="keyblay-debug-canvas"
        className="absolute overflow-visible h-full w-screen"
      />
    </div>
  );
};
