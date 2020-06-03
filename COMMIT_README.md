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