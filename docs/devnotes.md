# Development notes and to do items

At the top are active to do items.

In the second section are finished to-do items and also some general dev notes.
This section isn't well organized.

# Active to do items

## Nicer legend for the leader key

Currently this is the Material Design Send Email icon (a paper airplane).
What should I put there instead?

## Nicer legend for the escape key

Currently this is an SVG from Wikimedia Commons, and it looks like shit.
What should I use instead?

I'm mad that the Microsoft Segoe UI font has such a stupid license.
It has the only escape key legend I really like,
and it's not available for this use.
What the fuck good does it do them? Ugh.

## Nicer legend for the app/menu key

Currently this is an SVG, but it doesn't belong with the other icons and is blurry.
What should I use instead?

I was using a Unicode hamburger glyph,
but it was not very clear what it was until you clicked there.
Microsoft keyboards tend to use something that looks like a menu,
so I'll probably have to find something like that.

## Fix mobile view

I broke it ages ago, going to have to dive in deep there probably

Update: recent changes have improved this,
but the biggest problem is that it's not drawing lines on the canvas that extends past the view port.

20200729 Update: I think all the lines are drawing correctly now,
and when I moved the KeyInfo panel back to the bottom,
this is mostly OK?
But I'm still seeing problems with two of the green lines when I select the `[]` keys,
only on mobile.

## Add content for all the keys I want

Fill out key info content with references.
Edit all the content.

## Improve diagram lines

Would be nice if they didn't overlap text, but instead were drawn underneath it.
Maybe hard?

## Add place for more general info

What is an ergodox, why did it help me generally, etc.

Probably will have lots of these.

Maybe an FAQ style section, if I can't think of anything better.

They should be linkable with URL fragments too.

## Need to show other layers and layouts

- Show my function layer, just for fun(ction)
- Show the Ergodox default layout

How will I show all this info?
Won't be able to see it all at once...

## Have a per-key preview image for slack/twitter/etc

Now that I can link to individual keys, seems like I really ought to have a preview image for each one.

Also should change the page title.

# Development notes and completed to do items

This was originally added as part of a big wip commit.

I have changed a lot of the code.
Some of it is good refactored, but plenty of the refactoring was probably not helpful.
Should go back through and see what was really needed.
All my debugging / experimentation code has been since
`3e00aed009f13645131df596041a7d8fd7e49419`.
Compare against that.

✅ not going to bother with that - just move forward lol

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

✅ this is all solved with some state in a class component and understanding refs and hooks better

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
  const abs = DOMRect.fromRect(rect);
  abs.x += window.scrollX;
  abs.y += window.scrollY;
  return abs;
}
```

✅ Done

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

✅ Done

### Should connect to a different place on the key / text

Right now it's connecting to the upper left corner;
I think it would be nice to connect to lower corner, bottom middle, or something else,
especially for the text references.

✅ Done

### getBoundingClientRect() is supposed to return post-transform values

Here's a bug from 10 years ago

<https://bugzilla.mozilla.org/show_bug.cgi?id=591718>

Seems to indicate that my expectation that `getBoundingClientRect` ought to return the _post_
transform values is correct.

✅ this does seem to work now that I've fixed my canvas size

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
  transform: translateX(calc(var(--keyboard-grid-unit) * -2)) translateY(
      calc(var(--keyboard-grid-unit) * 6)
    )
    rotate(25deg);
  transform-origin: 0 calc(var(--keyboard-grid-unit) * 2);
}
```

I don't think that changed anything, but it's hard to know for sure.

Although, it did highlight that I was using `right:` before
and it would be been less confusing to use `left:`.

✅ This does work

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

I tried this a few ways.

First/original attempt:

```js
const origBoundingRect = canvas.getBoundingClientRect();
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.width = origBoundingRect.width;
canvas.height = origBoundingRect.height;
```

Second attempt:

```js
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
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

✅ Done

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
      const rounded = Math.round(num);
      return num === rounded ? `${rounded}` : `${rounded}_`;
    };
    const gbrbi = (id) => {
      const br = document.getElementById(id).getBoundingClientRect();
      return `${id}: ${r(br.x)},${r(br.y)} (${r(br.width)}x${r(
        br.height
      )}) ([${r(br.left)}..${r(br.right)}]x[${r(br.top)}..${r(br.bottom)}])`;
    };
    console.log(gbrbi("keyblay-debug-canvas"));
    console.log(gbrbi("keyblay-debug-canvas-container"));
    console.log(gbrbi("keyblay-debug-content-wrapper-div"));
    console.log(gbrbi("keyblay-debug-outer-wrapper-div"));
    console.log(gbrbi("l-f-1-1"));
  };
}, []);
```

✅ No longer necessary

## more

### Fix the info box covering up the keyboard

It does this, especially for long texts.

Might consider having the key info box cover the initial info section?
I don't think people need to see that all the time.
Then that could just resize properly based on the key info content,
and the close button could get it back to the intro.

I could have that section scroll independently maybe?
Actually that would probably make the canvas drawing a lot harder tho,
to only draw to key pointers that were on screen, so maybe not.
But maybe it could just resize automatically.

Decided to put it above the keyboard for now.

✅ Done

### Improve key references in text

Right now they're text like `l-f-1-1`, but it would be nice if they looked like keys or something?
Not sure because I don't want to tie them to the legend;
what's important is their placement.

More thought is required.

Update:

I want to be able to reference key legends.
Maybe start with something like this:
<https://shkspr.mobi/blog/2020/05/better-keyboard-buttons-in-html/>

Then, add a way to tag a legend with an id.
That gets rid of ugly reference IDs, as long as I'm referencing them with a legend.

I could just say "here" with a reference, in order to point to a key without the legend.
That gets rid of the rest of the text reference IDs.

✅ Done!

### Lines don't draw past the current view port

Lines draw just in the viewport.
If the keyInfo panel on the right is very long and goes past the view port,
the line will appear to cut off when I scroll down.

Maybe the line should be drawn past the viewport?
Or maybe I need to redraw on scroll?

Doing more research on this, I'm not sure I understood it properly.
It may not be related to the view port.

Rather, sometimes the canvas doesn't extend as far as the lines that are supposed to be drawn on it.
Not sure why - it's supposed to be the full height of the page.

Further, the height of the canvas appears to change sometimes.
I look at the canvas by mousing over the element in Chrome's dev tools,
and it always stops right where the line ends.

Figure out how to extend the canvas all the way to the end of the content,
and this problem should be fixed.

✅ Done, with Josh's help - although maybe broken again? tracking under mobile.

### Allow selecting multiple keys at once

For instance, would be good to highlight all arrow keys when selecting any one of them.

✅ Done

## Use better name for key pointers / references

I have textual representations of key locations, like `l-f-1-1`.
I don't call them "references" because that's confusing with React refs.
I am currently calling them "pointers" but I think that's awkward
and slightly confusing because a pointer is something else in programming
(though I guess not in JavaScript)
and I don't think communicates what I mean without some explanatory text.

How can I improve this?

✅ done - see physical-key-indicators.md

## Twitter cards

https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started

I added enough so it's better than just a bare link,
but it's not showing my image and I'm not sure why.

✅ Done

Validated with
<https://cards-dev.twitter.com/validator>
but it's not showing up in my actual tweet yet -
might take a week to expire the cache?

## Transformed thumb clusters have the wrong pointer location

E.g. look at the bracket keys `[ { } ]` - it's pointing to the non-transformed location for shift. Ugh.

Update: I see what's happening now.
BoundingClientRect is the rectangle that encompasses the element post-rotation,
but BoundingClientRect doesn't itself rotate.
BoundingClientRect must always have top and bottom edges perpendicular to the X axis.

That is, if you take a square with top and bottom edges perpendicular to the X axis and rotate it 45 degrees,
the BoundingClientRect is now LARGER than it was before.

What I want to do is calculate the location pre-rotation,
then apply the rotation transformation to the calculated result.
Cool, some baby's first linear algebra.

... except why the fuck would I do math when I can just put a tiny `<div>` inside the `<Key>`
and have the existing CSS transform do the math for me.
Derp. SOEZ.

✅ Done

## Add URL fragments for what key I'm referring to

Would be nice for sharing etc

✅ Done! Query string instead of URL fragments, but whatever.

Note that I tried to use dynamic routing with something like `pages/key/[keyId].js`,
but that resulted in full page reloads every time.
The URLs were nicer, but I don't think I'm too worried about it.

## Emphasize selected key more

Currently, selected key is emphasized with a darker gray background.
The green highlights for key indicators are more prominent.
Make the selected key more prominent.

✅ Done, it's a nice orange now, and the other keys in the group are a lighter orange.

## Add tracking

I'm using Fathom for other projects, and I added it today.

✅ Done

## Layout fix: selecting a different key shouldn't move view window around

This is pretty annoying in practice.

✅ This is improved by moving the KeyInfo panel back to the bottom of the screen.

## Better font for key legends

The current font is... _ok_.
Stuff like vol up/down is a hack,
and the backspace/delete/esc/tab keys are all really ugly and pixelated,
especially on non-retina.

20200729 Update:

I had to go to SVGs to fix this, but the result is MUCH better.
I'm not 100% happy with how everything looks yet...
but I'm way happier than I was before.
Some stuff like volume keys just looks like shit with emoji.
Also, Unicode glyphs for computing symbols look like shit compared to SVGs --
maybe because of the fonts I have access to?
It seems like everything might be defaulting to Menlo or GNU FreeFont Mono
because most fonts don't have the escape key symbol.

I improved text/glyph legends by using Roboto Mono,
which looks great and is freely available as a web font I can self-host.

I now differentiate between _glyph_ legends,
which are either one character (`A`) or two characters (`,<`),
_text_ legends, which are words (`Home`) or abbreviations (`Ctrl`),
and _image_ legends, which are SVGs.
Keys may have only one, two, or all three of these;
currently I prefer images, then glyphs, and finally text if nothing else is available,
which is currently the case only for PgUp/PgDn/Home/End.
This made it clear that glyphs should always be the same large size,
and text should always be the same smaller size.
Images should try to match the glyph size, more or less.

I think I'm actually going to call this done,
and add some separate issues for specific icons.

✅ hell yeah

