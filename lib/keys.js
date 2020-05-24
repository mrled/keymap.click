export const keys = [
  // number row
  {
    key: "=",
    size: [3, 2],
    info: "Takes a little getting used to up here, but is normal for other Ergodox layouts, and isn't too bad."
  },
  { key: "1", info: ""},
  { key: "2", info: ""},
  { key: "3", info: ""},
  { key: "4", info: ""},
  { key: "5", info: ""},
  {
    key: "esc",
    size: [2, 2],
    info: "In my experience this is a MUCH better use of this key than the default layout of a left arrow."
  },

  // top alpha row
  {
    key: "`",
    size: [3, 2],
    info: "Slightly different than the default location for this key. You could theoretically swap it with the = key above it, but I decided I preferred the + and - keys to mirror each other on opposite sides of the keyboard so I would remember them easier, leaving this space as the best fit for this key. And the tab key is much better suited for a non-pinky finger, so this isn't a good place for it."
  },
  { key: "Q", info: ""},
  { key: "W", info: ""},
  { key: "E", info: ""},
  { key: "R", info: ""},
  { key: "T", info: ""},
  {
    key: "TAB",
    size: [2, 3],
    info: "This is a very natural place for the tab key. It's so easy to hit, and the index finger is much stronger than the pinky - for such a commonly used key, remapping it here is a good return for the mental remapping cost."
  },

  // middle / home alpha row
  {
    key: "",
    size: [3, 2],
    info: "I have nothing mapped here and I don't miss it. I guess you could put a real capslock key here if you want? On a normal keyboard, I remap capslock to ctrl, but that's not necessary on for this layout. Removing the ctrl mapping helped me remember the new ctrl location, which is why it's blank now."
  },
  { key: "A", info: ""},
  { key: "S", info: ""},
  { key: "D", info: ""},
  { key: "F", info: ""},
  { key: "G", info: ""},

  // bottom alpha row
  {
    key: "[",
    size: [3, 2],
    info: "On a regular keyboard, this is a shift key. I desperately needed to shift without using my pinky, and mapping another key shift but leaving this as a useful shift key gave me too much of a crutch. At the same time, on the Ergodox default layout the [] keys are in an awkward place anyway, and the shift keys are actually easier to reach than the default location for [], under the . and / keys. A win in both directions."
  },
  { key: "Z", info: ""},
  { key: "X", info: ""},
  { key: "C", info: ""},
  { key: "V", info: ""},
  { key: "B", info: ""},
  {
    key: "GUI",
    size: [2, 3],
    startPos: [14, 6],
    info: "The GUI key, which is either the CMD key on macOS or the Windows key on Windows. The default Ergo layout has this in the upper right of the left-hand thumb cluster - a crazy location for either operating system, in my opinion. It's worse on macOS, where every application shortcut uses it. Keeping the GUI key here makes it very easy to hit any application shortcut without remapping or straining your hands. The default value for this key is 'Hyper', which is only useful for user-defined shortcuts. While those are certainly useful if available, for my workflow, they are by no means mandatory, and I think there are many other places for a Hyper key if you truly desire one."
  },

  // the function row at the very bottom
  {
    key: null,
    size: [1, 2],
    info: null
  },
  {
    key: "Layer: function",
    size: [2, 2],
    info: "A tap/toggle key for the LAYER_FUNC layer, which contains F1-20 as well as keys like insert and pause/break."
  },
  {
    key: "Layer: media",
    size: [2, 2],
    info: "A tap/toggle key for the LAYER_MEDIA layer, which contains keys like play/pause, skip track, and volume up/down/mute."
  },
  {
    key: "Layer: color",
    size: [2, 2],
    info: "A tap/toggle key for the LAYER_COLOR layer, which changes the color of the underglow light. This layer is hardly a necessity and I rarely use it."
  },
  {
    key: "<-",
    size: [2, 2],
    info: "The default arrow key location is fine but not mandatory. It's nice that you can easily hit arrow keys without moving your hands, and I think it actually makes Emacs/vim keybindings less necessary in apps because of that. Still, surely anyone buying an Ergodox has been using computers long enough to configure Emacs/vim keybindings everywhere. I use these, but don't find them indispensable."
  },
  {
    key: "->",
    size: [2, 2],
    info: "See the notes for the left arrow key."
  },
  {
    key: null,
    size: [4, 2],
    info: null
  }
]