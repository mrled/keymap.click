import { useEffect, useLayoutEffect } from "react";

/* Call useEffect when run on the server and useLayoutEffect when run on the client.
 *
 * We could just useLayoutEffect on the client,
 * but this generates errors when NextJS tries to render the page on the server,
 * which it does by default for the first page load.
 *
 * If we can, it's better to call useEffect which will work the same on client and server.
 * But if the UI looks broken when we do that,
 * that means this will generate broken UI on the server (with useEffect).
 * If possible, better to refactor the code to not need this hook.
 */
export const useIsomorphicLayoutEffect =
  typeof window === "object" ? useLayoutEffect : useEffect;
