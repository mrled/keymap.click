Big WIP commit. Lots of progress. Some notes.

I have changed a lot of the code.
Some of it is good refactored, but plenty of the refactoring was probably not helpful.
Should go back through and see what was really needed.
All my debugging / experimentation code has been since
`3e00aed009f13645131df596041a7d8fd7e49419`.
Compare against that.

The latest eureka moment was the second useEffect in the Keyboard component,
the one that passes `[pressedKey]`.
Josh helped me a TON with this one, thank uuuuuu.

In there I have a big array of lines.
(Actually, a big array of 2-item arrays of coordinates.)

I think what I need to do next is set state on my canvas component.
To do that I think I will need to convert it to a class rather than functional component.
<https://reactjs.org/docs/state-and-lifecycle.html>.

Side note, Josh suggested querying the DOM for all elements that have the class name I want.
But he also said I could use contexts to accomplish the same thing,
but it would be more complicated.

> Okay. We still could use refs here, however, it would get complicated. We would need to store them in context so they could be accessed globally, and it would just be a whole thing. Because you just want the coordinates, you can just use an ID on the element.

Might be worth reading more about context?
Maybe start here?
<https://reactjs.org/docs/context.html>

I didn't really understand React hooks that well.
<https://reactjs.org/docs/hooks-rules.html>,
<https://reactjs.org/docs/hooks-reference.html>.
Might be worth reading more.
Also, might be worth understanding that the rules can be broken sometimes.
<https://inventingwithmonster.io/20190207-break-the-rules-of-react-hooks/>

I had also found this stuff on "lifting state up" that might be worth a closer look.
<https://reactjs.org/docs/lifting-state-up.html>.

I found this helpful:
<https://reactjs.org/docs/refs-and-the-dom.html>

## update 20200602 - partially working

Holy shit, it's partially working.

It looks like the lines are not getting drawn in the right place.
But they ARE getting drawn at the right length and angle.
This means they look offset from where they should be.

They also don't change on scroll, which is a problem.

## update 20200606

More thoughts

### Adjust DOMRect for scroll position

<https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect>

> If you need the bounding rectangle relative to the top-left corner of the document, just add the current scrolling position to the top and left properties (these can be obtained using window.scrollX and window.scrollY) to get a bounding rectangle which is independent from the current scrolling position.

Maybe I could do that like this?

```js
export function absolutifyBoundingClientRect(rect) {
  const abs = DOMRect.fromRect(rect)
  abs.x += window.scrollX
  abs.y += window.scrollY
  return abs
}
```

Status: not yet implemented

### I'm not redrawing the canvas based on scroll position

I think I don't need to do this - but if different parts of the page scroll differently,
like if the info panel is scrolling separately from the page,
I might need to.

### getClientRects()

Not sure if this is going to be useful or not, but there is also this API call.

<https://developer.mozilla.org/en-US/docs/Web/API/Range/getClientRects>

Right now I'm using `.getBoundingClientRect()`,
which returns a bounding rectangle for the entire element.
In the case of text that spans more than one line,
it may start on the right side of the upper line and continues on the left side of the lower line,
meaning the upper left corner is not actually touching the textual reference.

From reading this documentation,
it looks like `.getClientRects()` will return an array of bounding rects,
where split text will get one for the upper and one for the lower line.
This would let me connect my line to the text directly.

### Should connect to a different place on the key / text

Right now it's connecting to the upper left corner;
I think it would be nice to connect to lower corner, bottom middle, or something else,
especially for the text references.

### getBoundingClientRect() is supposed to return post-transform values

Here's a bug from 10 years ago

<https://bugzilla.mozilla.org/show_bug.cgi?id=591718>

Seems to indicate that my expectation that `getBoundingClientRect` ought to return the _post_
transform values is correct.

### Should I use transform instead of position relative?

Here's what I was doing before:

```css
.keyboard-left-thumb-cluster {
  position: relative;
  top: calc(var(--keyboard-grid-unit) * 6);
  right: calc(var(--keyboard-grid-unit) * 2);
  transform-origin: 0 calc(var(--keyboard-grid-unit) * 2);
  transform: rotate(25deg);
}
```

Here's what I'm doing now:

```css
.keyboard-left-thumb-cluster {
  transform:
    translateX(calc(var(--keyboard-grid-unit) * -2))
    translateY(calc(var(--keyboard-grid-unit) * 6))
    rotate(25deg);
  transform-origin: 0 calc(var(--keyboard-grid-unit) * 2);
}
```

I don't think that changed anything, but it's hard to know for sure.

Although, it did highlight that I was using `right:` before
and it would be been less confusing to use `left:`.

### Visual formatting model

It's probably worth understanding this in detail.
<https://developer.mozilla.org/en-US/docs/Web/CSS/Visual_formatting_model>

### I think the canvas is the wrong size

<https://permadi.com/2009/04/usng-html-5-canvas-to-draw-over-my-web-page-part-2/>

From my testing, getBoundingClientRect() returns absolute positioning, not within some div or something.
I can verify this with the rulers in Chrome's dev tools, for example.

So what I need is what is described in that article -
a `<canvas>` that is the size of the entire screen.
Then I think my numbers will all be correct!

#### I updated the canvas that way

First/original attempt:

```js
    const origBoundingRect = canvas.getBoundingClientRect()
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.width = origBoundingRect.width
    canvas.height = origBoundingRect.height
```

Second attempt:

```js
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
```

Third attempt
(I also had to add a ref to div that contains the canvas element):

```js
    const container = this.refs.container
    ...
    canvas.style.width = `${container.scrollWidth}px`
    canvas.style.height = `${container.scrollHeight}px`
    canvas.width = container.scrollWidth
    canvas.height = container.scrollHeight
```

That seems to be _correct_! Holy shit.

### Debug function

I used this `keybDebug()` debug function to good effect
when I was trying to figure out where all the elements were and why my lines were wrong.

I add it inside of useEffect() in the Keyboard component.
useEffect takes 2 arguments here - my arrow function and an empty array.
Passing it the empty array means it runs on every page load.

```js
  useEffect(() => {
    document.keybDebug = () => {
      const r = (num) => {
        // Round to integer, append with _ if wasn't integer to begin with
        // useful bc rotate-xform'd elements have positions in very tiny fractions of pixels,
        // which I don't care about in this fucking debug function
        const rounded = Math.round(num)
        return num === rounded ? `${rounded}` : `${rounded}_`
      }
      const gbrbi = (id) => {
        const br = document.getElementById(id).getBoundingClientRect();
        return `${id}: ${r(br.x)},${r(br.y)} (${r(br.width)}x${r(br.height)}) ([${r(br.left)}..${r(br.right)}]x[${r(br.top)}..${r(br.bottom)}])`
      }
      console.log(gbrbi('keyblay-debug-canvas'));
      console.log(gbrbi('keyblay-debug-canvas-container'));
      console.log(gbrbi('keyblay-debug-content-wrapper-div'));
      console.log(gbrbi('keyblay-debug-outer-wrapper-div'));
      console.log(gbrbi('l-f-1-1'));
    }
  }, [])
```