const normalLayoutInfo = "Unchanged from normal QWERTY keyboard layout"
const arrowKeyInfo = "The default arrow key location is fine but not mandatory. It's nice that you can easily hit arrow keys without moving your hands, and I think it actually makes Emacs/vim keybindings less necessary in apps because of that. Still, surely anyone buying an Ergodox has been using computers long enough to configure Emacs/vim keybindings everywhere. I use these, but don't find them indispensable."
const pageUpDownHomeEndInfo = "An ok position for Page Up/Down and Home/End. I am thinking of these two pairs of keys though, since I'm used to MacBook where Fn+up/down is Page Up/Down, and the up/down arrows are on the right side of my ErgoDox, and swapping would probably help me remember. You may or may not find these keys necessary - they tend to be heavily used on Windows (and also in VS Code), and much less useful on macOS. That said, with shift and space on opposite hands, Page Up is the only way you can scroll up one page with only one hand on the keyboard. (On a regular keyboard, shift+space will do this.)"
const guiKeyInfo = "The GUI key, which is either the CMD key on macOS or the Windows key on Windows. The default Ergo layout has this in the upper right of the left-hand thumb cluster - a crazy location for either operating system, in my opinion. It's worse on macOS, where every application shortcut uses it. Keeping the GUI key here makes it very easy to hit any application shortcut without remapping or straining your hands. The default value for this key is 'Hyper', which is only useful for user-defined shortcuts. While those are certainly useful if available, for my workflow, they are by no means mandatory, and I think there are many other places for a Hyper key if you truly desire one."
const bracketKeyInfo = "On a regular keyboard, this is a shift key. I desperately needed to shift without using my pinky, and mapping another key shift but leaving this as a useful shift key gave me too much of a crutch. At the same time, on the Ergodox default layout the [] keys are in an awkward place anyway, and the shift keys are actually easier to reach than the default location for [], under the . and / keys. A win in both directions. The only time I miss a shift key on the right is when I'm using the mouse and need to shift on the right side of the keyboard with my left hand - which is pretty rare."

export const leftHandKeys = [
  // number row
  {
    key: "= +",
    size: [3, 2],
    startPos: [1, 1],
    info: "Takes a little getting used to up here, but is normal for other Ergodox layouts, and isn't too bad."
  },
  { key: "1", startPos: [4, 1], info: normalLayoutInfo},
  { key: "2", startPos: [6, 1], info: normalLayoutInfo},
  { key: "3", startPos: [8, 1], info: normalLayoutInfo},
  { key: "4", startPos: [10, 1], info: normalLayoutInfo},
  { key: "5", startPos: [12, 1], info: normalLayoutInfo},
  {
    key: "⎋",
    startPos: [14, 1],
    info: "In my experience this is a MUCH better use of this key than the default layout of a left arrow."
  },

  // top alpha row
  {
    key: "` ~",
    size: [3, 2],
    startPos: [1, 3],
    info: "Slightly different than the default location for this key. You could theoretically swap it with the = key above it, but I decided I preferred the + and - keys to mirror each other on opposite sides of the keyboard so I would remember them easier, leaving this space as the best fit for this key. And the tab key is much better suited for a non-pinky finger, so this isn't a good place for it."
  },
  { key: "Q", startPos: [4, 3], info: normalLayoutInfo},
  { key: "W", startPos: [6, 3], info: normalLayoutInfo},
  { key: "E", startPos: [8, 3], info: normalLayoutInfo},
  { key: "R", startPos: [10, 3], info: normalLayoutInfo},
  { key: "T", startPos: [12, 3], info: normalLayoutInfo},
  {
    key: "↹",
    size: [2, 3],
    startPos: [14, 3],
    fontSize: "text-3xl",
    info: "This is a very natural place for the tab key. It's so easy to hit, and the index finger is much stronger than the pinky - for such a commonly used key, remapping it here is a good return for the mental remapping cost."
  },

  // middle / home alpha row
  {
    unset: true,
    size: [3, 2],
    startPos: [1, 5],
    info: "I have nothing mapped here and I don't miss it. I guess you could put a real capslock key here if you want? On a normal keyboard, I remap capslock to ctrl, but that's not necessary on for this layout. Removing the ctrl mapping helped me remember the new ctrl location, which is why it's blank now."
  },
  { key: "A", startPos: [4, 5], info: normalLayoutInfo},
  { key: "S", startPos: [6, 5], info: normalLayoutInfo},
  { key: "D", startPos: [8, 5], info: normalLayoutInfo},
  { key: "F", startPos: [10, 5], info: normalLayoutInfo},
  { key: "G", startPos: [12, 5], info: normalLayoutInfo},

  // bottom alpha row
  {
    key: "[ {",
    size: [3, 2],
    startPos: [1, 7],
    info: bracketKeyInfo
  },
  { key: "Z", startPos: [4, 7], info: normalLayoutInfo},
  { key: "X", startPos: [6, 7], info: normalLayoutInfo},
  { key: "C", startPos: [8, 7], info: normalLayoutInfo},
  { key: "V", startPos: [10, 7], info: normalLayoutInfo},
  { key: "B", startPos: [12, 7], info: normalLayoutInfo},
  {
    key: "⌘",
    size: [2, 3],
    startPos: [14, 6],
    fontSize: 'text-2xl',
    info: guiKeyInfo
  },

  // the function row at the very bottom
  {
    key: null,
    size: [1, 2],
    startPos: [1, 9],
    info: null
  },
  {
    key: "Layer Func",
    startPos: [2, 9],
    fontSize: "text-sm",
    info: "A tap/toggle key for the LAYER_FUNC layer, which contains F1-20 as well as keys like insert and pause/break."
  },
  {
    key: "Layer Med",
    startPos: [4, 9],
    fontSize: "text-sm",
    info: "A tap/toggle key for the LAYER_MEDIA layer, which contains keys like play/pause, skip track, and volume up/down/mute."
  },
  {
    key: "Layer Col",
    startPos: [6, 9],
    fontSize: "text-sm",
    info: "A tap/toggle key for the LAYER_COLOR layer, which changes the color of the underglow light. This layer is hardly a necessity and I rarely use it."
  },
  {
    key: "←",
    startPos: [8, 9],
    info: arrowKeyInfo
  },
  {
    key: "→",
    startPos: [10, 9],
    info: arrowKeyInfo
  },
  {
    key: null,
    size: [4, 2],
    startPos: [12, 9],
    info: null
  }
]

export const leftThumbKeys = [
  {
    key: null,
    size: [2, 2],
    startPos: [1, 1],
    info: null
  },
  {
    key: "Spc Cad (",
    size: [2, 2],
    startPos: [3, 1],
    fontSize: "text-xs",
    info: "Undecided what I'll do here long term. Currently space cadet shift, but it isn't a good place for a shift key and I don't see much benefit over the normal location for () over 8/9."
  },
  {
    key: "Page Up",
    size: [2, 2],
    startPos: [5, 1],
    fontSize: "text-sm",
    info: pageUpDownHomeEndInfo
  },
  {
    key: "⇧",
    size: [2, 4],
    startPos: [1, 3],
    info: "I've found this to be a really good place for shift. I can easily reach any key necessary - the longest reach is to the = key for +, and I can do that easily, repeatedly, painlessly, and with room to spare. I did have to remap the normal shift key location (next to Z and ?) in order to train my hands to use this one, but after a day or two of that it feels very fast and natural."
  },
  {
    key: "⌫",
    size: [2, 4],
    startPos: [3, 3],
    info: "The default ErgoDox-EZ location for backspace. Works great, and having this super commonly used key under a strong thumb is a huge improvement over having it under a weak pinky finger."
  },
  {
    key: "Page Down",
    size: [2, 2],
    startPos: [5, 3],
    fontSize: "text-sm",
    info: pageUpDownHomeEndInfo
  },
  {
    key: "^",
    size: [2, 2],
    startPos: [5, 5],
    info: "Ctrl works really well here. It's a very commonly used key, and even moreso for Emacs users. Every key on the keyboard is reachable this way, and the key is very easy to find. I did have to remap the key next to A (Capslock on a normal QWERTY keyboard, which I typically remap to Ctrl) to keep me from falling back to old habits. Once I did that, this key works very naturally."
  }
]

export const rightHandKeys = [
  // number row
  {
    key: "LEAD",
    startPos: [1, 1],
    fontSize: "text-sm",
    info: "The Leader Key. I don't use this much, but I do keep it as a common escape key for any layer except for the base layer."
  },
  { key: "6", startPos: [3, 1], info: normalLayoutInfo},
  { key: "7", startPos: [5, 1], info: normalLayoutInfo},
  { key: "8", startPos: [7, 1], info: normalLayoutInfo},
  { key: "9", startPos: [9, 1], info: normalLayoutInfo},
  { key: "0", startPos: [11, 1], info: normalLayoutInfo},
  {
    key: "- _",
    size: [3, 2],
    startPos: [13, 1],
    info: normalLayoutInfo
  },

  // top alpha row
  {
    key: "Layer Mouse",
    size: [2, 3],
    startPos: [1, 3],
    fontSize: "text-sm",
    info: "Tap/Toggle key for my mouse / \"pointer\" layer. I don't use this all the time, BUT when my right arm is feeling particularly in pain or strained, it can be nice not to have to reach further to the right for the mouse."
  },
  { key: "Y", startPos: [3, 3], info: normalLayoutInfo},
  { key: "U", startPos: [5, 3], info: normalLayoutInfo},
  { key: "I", startPos: [7, 3], info: normalLayoutInfo},
  { key: "O", startPos: [9, 3], info: normalLayoutInfo},
  { key: "P", startPos: [11, 3], info: normalLayoutInfo},
  {
    key: "\\ |",
    size: [3, 2],
    startPos: [13, 3],
    info: normalLayoutInfo
  },

  // middle / home alpha row
  { key: "H", startPos: [3, 5], info: normalLayoutInfo},
  { key: "J", startPos: [5, 5], info: normalLayoutInfo},
  { key: "K", startPos: [7, 5], info: normalLayoutInfo},
  { key: "L", startPos: [9, 5], info: normalLayoutInfo},
  { key: ";", startPos: [11, 5], info: normalLayoutInfo},
  {
    key: "\" '",
    size: [3, 2],
    startPos: [13, 5],
    info: normalLayoutInfo
  },

  // bottom alpha row
  {
    key: "⌘",
    size: [2, 3],
    startPos: [1, 6],
    fontSize: 'text-2xl',
    info: guiKeyInfo
  },
  { key: "N", startPos: [3, 7], info: normalLayoutInfo},
  { key: "M", startPos: [5, 7], info: normalLayoutInfo},
  { key: ", <", startPos: [7, 7], info: normalLayoutInfo},
  { key: ". ,", startPos: [9, 7], info: normalLayoutInfo},
  { key: "/ ?", startPos: [11, 7], info: normalLayoutInfo},
  {
    key: "] }",
    size: [3, 2],
    startPos: [13, 7],
    info: bracketKeyInfo
  },

  // the function row at the very bottom
  {
    key: null,
    size: [4, 2],
    startPos: [1, 9],
    info: null
  },
  {
    key: "↑",
    size: [2, 2],
    startPos: [5, 9],
    info: arrowKeyInfo
  },
  {
    key: "↓",
    startPos: [7, 9],
    info: arrowKeyInfo
  },
  {
    key: "Layer TEST",
    startPos: [9, 9],
    fontSize: "text-sm",
    info: "A tap/toggle key for the LAYER_TEST layer, which I can use for testing out layout changes to my main layer without changing the actual main layer I have gotten used to. I used this a lot at first, and then much less often as I got a layer I was more comfortable with, and bought a macropad for testing dances and other more advanced QMK functionality."
  },
  {
    unset: true,
    startPos: [11, 9],
    info: "I have room for more layers here, but I haven't needed any more yet."
  },
  {
    unset: true,
    startPos: [13, 9],
    info: "I have room for more layers here, but I haven't needed any more yet."
  },
  {
    key: null,
    size: [1, 2],
    startPos: [15, 9],
    info: null
  }
]

export const rightThumbKeys = [
  {
    key: "Home",
    size: [2, 2],
    startPos: [1, 1],
    fontSize: "text-sm",
    info: pageUpDownHomeEndInfo
  },
  {
    key: "Spc Cad )",
    size: [2, 2],
    startPos: [3, 1],
    fontSize: "text-xs",
    info: "Undecided what I'll do here long term. Currently space cadet shift, but it isn't a good place for a shift key and I don't see much benefit over the normal location for () over 8/9."
  },
  {
    key: null,
    size: [2, 2],
    startPos: [1, 5],
    info: null
  },
  {
    key: "End",
    size: [2, 2],
    startPos: [1, 3],
    fontSize: "text-sm",
    info: pageUpDownHomeEndInfo
  },
  {
    key: "⏎",
    size: [2, 4],
    startPos: [3, 3],
    info: "A good place for the return key. The default layout has it one key over, but I liked space better over there, so I moved return here."
  },
  {
    key: "␣",
    size: [2, 4],
    startPos: [5, 3],
    info: "A great place for the space key. I initially had mirrored space keys, one under each thumb, but eventually moved the left thumb to be shift, which was immediately a huge positive for me. That left the right thumb for space."
  },
  {
    key: "⌥",
    size: [2, 2],
    startPos: [1, 5],
    info: "Option (macOS) or Alt (Windows) works great here as a mirror to Ctrl in the mirror position under the left thumb. The same benefits apply - it's commonly used, and every key on the keyboard is accessible while chording it."
  }
]