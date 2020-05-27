const normalLayoutInfo = "Unchanged from normal QWERTY keyboard layout"
const arrowKeyInfo = "The default arrow key location is fine but not mandatory. It's nice that you can easily hit arrow keys without moving your hands, and I think it actually makes Emacs/vim keybindings less necessary in apps because of that. Still, surely anyone buying an Ergodox has been using computers long enough to configure Emacs/vim keybindings everywhere. I use these, but don't find them indispensable."
const pageUpDownHomeEndInfo = "An ok position for Page Up/Down and Home/End. I am thinking of these two pairs of keys though, since I'm used to MacBook where Fn+up/down is Page Up/Down, and the up/down arrows are on the right side of my ErgoDox, and swapping would probably help me remember. You may or may not find these keys necessary - they tend to be heavily used on Windows (and also in VS Code), and much less useful on macOS. That said, with shift and space on opposite hands, Page Up is the only way you can scroll up one page with only one hand on the keyboard. (On a regular keyboard, shift+space will do this.)"
const guiKeyInfo = "The GUI key, which is either the CMD key on macOS or the Windows key on Windows. The default Ergo layout has this in the upper right of the left-hand thumb cluster - a crazy location for either operating system, in my opinion. It's worse on macOS, where every application shortcut uses it. Keeping the GUI key here makes it very easy to hit any application shortcut without remapping or straining your hands. The default value for this key is 'Hyper', which is only useful for user-defined shortcuts. While those are certainly useful if available, for my workflow, they are by no means mandatory, and I think there are many other places for a Hyper key if you truly desire one."
const bracketKeyInfo = "On a regular keyboard, this is a shift key. I desperately needed to shift without using my pinky, and mapping another key shift but leaving this as a useful shift key gave me too much of a crutch. At the same time, on the Ergodox default layout the [] keys are in an awkward place anyway, and the shift keys are actually easier to reach than the default location for [], under the . and / keys. A win in both directions. The only time I miss a shift key on the right is when I'm using the mouse and need to shift on the right side of the keyboard with my left hand - which is pretty rare."

export const leftHandKeys = [
  // number row
  {
    legend: "= +",
    board: ['left', 'finger'],
    size: [3, 2],
    startPos: [1, 1],
    info: "Takes a little getting used to up here, but is normal for other Ergodox layouts, and isn't too bad."
  },
  { legend: "1", board: ['left', 'finger'], startPos: [4, 1], info: normalLayoutInfo},
  { legend: "2", board: ['left', 'finger'], startPos: [6, 1], info: normalLayoutInfo},
  { legend: "3", board: ['left', 'finger'], startPos: [8, 1], info: normalLayoutInfo},
  { legend: "4", board: ['left', 'finger'], startPos: [10, 1], info: normalLayoutInfo},
  { legend: "5", board: ['left', 'finger'], startPos: [12, 1], info: normalLayoutInfo},
  {
    legend: "⎋",
    legendText: "escape",
    board: ['left', 'finger'],
    startPos: [14, 1],
    fontSize: "text-lg",
    info: "In my experience this is a MUCH better use of this key than the default layout of a left arrow."
  },

  // top alpha row
  {
    legend: "` ~",
    board: ['left', 'finger'],
    size: [3, 2],
    startPos: [1, 3],
    info: "Slightly different from the location of this key on a normal keyboard at [[l-f-1-1]], but more convenient than the default location for this key in the ErgoDox-EZ default layout at [[l-f-2-9]]. You could theoretically swap it with the = key at [[l-f-1-1]], but I decided I preferred that + key and the - key at [[r-f-13-1]] to mirror each other on opposite sides of the keyboard so I would remember them easier. That leaves this space as the best fit for this key. Additionally, while this is the location for the tab key on a normal keyboard, that key is much better suited for a non-pinky finger at [[l-f-14-3]]."
  },
  { legend: "Q", board: ['left', 'finger'], startPos: [4, 3], info: normalLayoutInfo},
  { legend: "W", board: ['left', 'finger'], startPos: [6, 3], info: normalLayoutInfo},
  { legend: "E", board: ['left', 'finger'], startPos: [8, 3], info: normalLayoutInfo},
  { legend: "R", board: ['left', 'finger'], startPos: [10, 3], info: normalLayoutInfo},
  { legend: "T", board: ['left', 'finger'], startPos: [12, 3], info: normalLayoutInfo},
  {
    legend: "⇥",
    legendText: "tab",
    board: ['left', 'finger'],
    size: [2, 3],
    startPos: [14, 3],
    fontSize: "text-lg",
    info: "This is a very natural place for the tab key. It's so easy to hit, and the index finger is much stronger than the pinky - for such a commonly used key, remapping it here is a good return for the mental remapping cost."
  },

  // middle / home alpha row
  {
    unset: true,
    legendText: "Unset",
    board: ['left', 'finger'],
    size: [3, 2],
    startPos: [1, 5],
    info: "I have nothing mapped here and I don't miss it. I guess you could put a real capslock key here if you want? On a normal keyboard, I remap capslock to ctrl, but that's not necessary on for this layout. Removing the ctrl mapping helped me remember the new ctrl location, which is why it's blank now."
  },
  { legend: "A", board: ['left', 'finger'], startPos: [4, 5], info: normalLayoutInfo},
  { legend: "S", board: ['left', 'finger'], startPos: [6, 5], info: normalLayoutInfo},
  { legend: "D", board: ['left', 'finger'], startPos: [8, 5], info: normalLayoutInfo},
  { legend: "F", board: ['left', 'finger'], startPos: [10, 5], info: normalLayoutInfo},
  { legend: "G", board: ['left', 'finger'], startPos: [12, 5], info: normalLayoutInfo},

  // bottom alpha row
  {
    legend: "[ {",
    board: ['left', 'finger'],
    size: [3, 2],
    startPos: [1, 7],
    info: bracketKeyInfo
  },
  { legend: "Z", board: ['left', 'finger'], startPos: [4, 7], info: normalLayoutInfo},
  { legend: "X", board: ['left', 'finger'], startPos: [6, 7], info: normalLayoutInfo},
  { legend: "C", board: ['left', 'finger'], startPos: [8, 7], info: normalLayoutInfo},
  { legend: "V", board: ['left', 'finger'], startPos: [10, 7], info: normalLayoutInfo},
  { legend: "B", board: ['left', 'finger'], startPos: [12, 7], info: normalLayoutInfo},
  {
    legend: "⌘",
    legendText: "GUI",
    board: ['left', 'finger'],
    size: [2, 3],
    startPos: [14, 6],
    fontSize: 'text-lg',
    info: guiKeyInfo
  },

  // the function row at the very bottom
  {
    legend: "⎆f",
    legendText: "function layer",
    board: ['left', 'finger'],
    startPos: [2, 9],
    info: "A tap/toggle key for the LAYER_FUNC layer, which contains F1-20 as well as keys like insert and pause/break."
  },
  {
    legend: "⎆m",
    legendText: "media layer",
    board: ['left', 'finger'],
    startPos: [4, 9],
    info: "A tap/toggle key for the LAYER_MEDIA layer, which contains keys like play/pause, skip track, and volume up/down/mute."
  },
  {
    legend: "⎆c",
    legendText: "color layer",
    board: ['left', 'finger'],
    startPos: [6, 9],
    info: "A tap/toggle key for the LAYER_COLOR layer, which changes the color of the underglow light. This layer is hardly a necessity and I rarely use it."
  },
  {
    legend: "←",
    legendText: "left arrow",
    board: ['left', 'finger'],
    startPos: [8, 9],
    info: arrowKeyInfo
  },
  {
    legend: "→",
    legendText: "right arrow",
    board: ['left', 'finger'],
    startPos: [10, 9],
    info: arrowKeyInfo
  },
]

export const leftThumbKeys = [
  {
    legend: "SPCR",
    legendText: "space cadet shift (",
    board: ['left', 'thumb'],
    size: [2, 2],
    startPos: [3, 1],
    info: "Undecided what I'll do here long term. Currently space cadet shift, but it isn't a good place for a shift key and I don't see much benefit over the normal location for () over 8/9."
  },
  {
    legend: "PgUp",
    legendText: "page up",
    board: ['left', 'thumb'],
    fontSize: "text-xs",
    size: [2, 2],
    startPos: [5, 1],
    info: pageUpDownHomeEndInfo
  },
  {
    legend: "⇧",
    legendText: "shift",
    board: ['left', 'thumb'],
    size: [2, 4],
    startPos: [1, 3],
    fontSize: "text-xl",
    info: "I've found this to be a really good place for shift. I can easily reach any key necessary - the longest reach is to the = key for +, and I can do that easily, repeatedly, painlessly, and with room to spare. I did have to remap the normal shift key location (next to Z and ?) in order to train my hands to use this one, but after a day or two of that it feels very fast and natural."
  },
  {
    legend: "⌫",
    legendText: "backspace",
    board: ['left', 'thumb'],
    size: [2, 4],
    startPos: [3, 3],
    fontSize: "text-xl",
    info: "The default ErgoDox-EZ location for backspace. Works great, and having this super commonly used key under a strong thumb is a huge improvement over having it under a weak pinky finger."
  },
  {
    legend: "PgDn",
    legendText: "page down",
    fontSize: "text-xs",
    board: ['left', 'thumb'],
    size: [2, 2],
    startPos: [5, 3],
    info: pageUpDownHomeEndInfo
  },
  {
    legend: "⌃",
    legendText: "control",
    fontSize: "text-base",
    board: ['left', 'thumb'],
    size: [2, 2],
    startPos: [5, 5],
    info: "Ctrl works really well here. It's a very commonly used key, and even moreso for Emacs users. Every key on the keyboard is reachable this way, and the key is very easy to find. I did have to remap the key next to A (Capslock on a normal QWERTY keyboard, which I typically remap to Ctrl) to keep me from falling back to old habits. Once I did that, this key works very naturally."
  }
]

export const rightHandKeys = [
  // number row
  {
    legend: "⎆l",
    legendText: "leader key",
    board: ['right', 'finger'],
    startPos: [1, 1],
    info: "The Leader Key. Not actually a layer, despite the symbol. I don't use this much, but I do keep it as a common escape key for any layer except for the base layer."
  },
  { legend: "6", board: ['right', 'finger'], startPos: [3, 1], info: normalLayoutInfo},
  { legend: "7", board: ['right', 'finger'], startPos: [5, 1], info: normalLayoutInfo},
  { legend: "8", board: ['right', 'finger'], startPos: [7, 1], info: normalLayoutInfo},
  { legend: "9", board: ['right', 'finger'], startPos: [9, 1], info: normalLayoutInfo},
  { legend: "0", board: ['right', 'finger'], startPos: [11, 1], info: normalLayoutInfo},
  {
    legend: "- _",
    board: ['right', 'finger'],
    size: [3, 2],
    startPos: [13, 1],
    info: normalLayoutInfo
  },

  // top alpha row
  {
    legend: "⎆p",
    legendText: "mouse layer",
    board: ['right', 'finger'],
    size: [2, 3],
    startPos: [1, 3],
    info: "Tap/Toggle key for my mouse / \"pointer\" layer. I don't use this all the time, BUT when my right arm is feeling particularly in pain or strained, it can be nice not to have to reach further to the right for the mouse."
  },
  { legend: "Y", board: ['right', 'finger'], startPos: [3, 3], info: normalLayoutInfo},
  { legend: "U", board: ['right', 'finger'], startPos: [5, 3], info: normalLayoutInfo},
  { legend: "I", board: ['right', 'finger'], startPos: [7, 3], info: normalLayoutInfo},
  { legend: "O", board: ['right', 'finger'], startPos: [9, 3], info: normalLayoutInfo},
  { legend: "P", board: ['right', 'finger'], startPos: [11, 3], info: normalLayoutInfo},
  {
    legend: "\\ |",
    board: ['right', 'finger'],
    size: [3, 2],
    startPos: [13, 3],
    info: normalLayoutInfo
  },

  // middle / home alpha row
  { legend: "H", board: ['right', 'finger'], startPos: [3, 5], info: normalLayoutInfo},
  { legend: "J", board: ['right', 'finger'], startPos: [5, 5], info: normalLayoutInfo},
  { legend: "K", board: ['right', 'finger'], startPos: [7, 5], info: normalLayoutInfo},
  { legend: "L", board: ['right', 'finger'], startPos: [9, 5], info: normalLayoutInfo},
  { legend: ";", board: ['right', 'finger'], startPos: [11, 5], info: normalLayoutInfo},
  {
    legend: "\" '",
    board: ['right', 'finger'],
    size: [3, 2],
    startPos: [13, 5],
    info: normalLayoutInfo
  },

  // bottom alpha row
  {
    legend: "⌘",
    legendText: "GUI",
    board: ['right', 'finger'],
    size: [2, 3],
    startPos: [1, 6],
    fontSize: 'text-lg',
    info: guiKeyInfo
  },
  { legend: "N", board: ['right', 'finger'], startPos: [3, 7], info: normalLayoutInfo},
  { legend: "M", board: ['right', 'finger'], startPos: [5, 7], info: normalLayoutInfo},
  { legend: ", <", board: ['right', 'finger'], startPos: [7, 7], info: normalLayoutInfo},
  { legend: ". >", board: ['right', 'finger'], startPos: [9, 7], info: normalLayoutInfo},
  { legend: "/ ?", board: ['right', 'finger'], startPos: [11, 7], info: normalLayoutInfo},
  {
    legend: "] }",
    board: ['right', 'finger'],
    size: [3, 2],
    startPos: [13, 7],
    info: bracketKeyInfo
  },

  // the function row at the very bottom
  {
    legend: "↑",
    legendText: "up arrow",
    board: ['right', 'finger'],
    size: [2, 2],
    startPos: [5, 9],
    info: arrowKeyInfo
  },
  {
    legend: "↓",
    legendText: "down arrow",
    board: ['right', 'finger'],
    startPos: [7, 9],
    info: arrowKeyInfo
  },
  {
    legend: "⎆t",
    legendText: "test layer",
    board: ['right', 'finger'],
    startPos: [9, 9],
    info: "A tap/toggle key for the LAYER_TEST layer, which I can use for testing out layout changes to my main layer without changing the actual main layer I have gotten used to. I used this a lot at first, and then much less often as I got a layer I was more comfortable with, and bought a macropad for testing dances and other more advanced QMK functionality."
  },
  {
    unset: true,
    board: ['right', 'finger'],
    startPos: [11, 9],
    info: "I have room for more layers here, but I haven't needed any more yet."
  },
  {
    unset: true,
    board: ['right', 'finger'],
    startPos: [13, 9],
    info: "I have room for more layers here, but I haven't needed any more yet."
  },
]

export const rightThumbKeys = [
  {
    legend: "Home",
    fontSize: "text-xs",
    board: ['right', 'thumb'],
    size: [2, 2],
    startPos: [1, 1],
    info: pageUpDownHomeEndInfo
  },
  {
    legend: "SPCR",
    legendText: "space cadet shift )",
    fontSize: "text-xs",
    board: ['right', 'thumb'],
    size: [2, 2],
    startPos: [3, 1],
    info: "Undecided what I'll do here long term. Currently space cadet shift, but it isn't a good place for a shift key and I don't see much benefit over the normal location for () over 8/9."
  },
  {
    legend: "End",
    fontSize: "text-xs",
    board: ['right', 'thumb'],
    size: [2, 2],
    startPos: [1, 3],
    info: pageUpDownHomeEndInfo
  },
  {
    legend: "⏎",
    legendText: "return",
    fontSize: "text-xl",
    board: ['right', 'thumb'],
    size: [2, 4],
    startPos: [3, 3],
    info: "A good place for the return key. The default layout has it one key over, but I liked space better over there, so I moved return here."
  },
  {
    legend: "␣",
    legendText: "space",
    fontSize: "text-xl",
    board: ['right', 'thumb'],
    size: [2, 4],
    startPos: [5, 3],
    info: "A great place for the space key. I initially had mirrored space keys, one under each thumb, but eventually moved the left thumb to be shift, which was immediately a huge positive for me. That left the right thumb for space."
  },
  {
    legend: "⌥",
    legendText: "option",
    board: ['right', 'thumb'],
    fontSize: "text-base",
    size: [2, 2],
    startPos: [1, 5],
    info: "Option (macOS) or Alt (Windows) works great here as a mirror to Ctrl in the mirror position under the left thumb. The same benefits apply - it's commonly used, and every key on the keyboard is accessible while chording it."
  }
]
