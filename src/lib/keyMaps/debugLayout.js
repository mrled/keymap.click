const normalLayoutInfo = "Unchanged from normal QWERTY keyboard layout";
const arrowKeyInfo =
  "The default arrow key location is fine but not mandatory. It's nice that you can easily hit arrow keys without moving your hands, and I think it actually makes Emacs/vim keybindings less necessary in apps because of that. Still, surely anyone buying an Ergodox has been using computers long enough to configure Emacs/vim keybindings everywhere. I use these, but don't find them indispensable.";
const pageUpDownHomeEndInfo =
  "An ok position for <kbd>Page Up</kbd>, <kbd>Page Down</kbd>, <kbd>Home</kbd>, and <kbd>End</kbd>. Much better than the default Ergodox layout, which shifts these keys down by one, consuming extremely valuable keys [[l-t-5-5|here]] and [[r-t-1-5|here]]. You may or may not find these keys necessary - they tend to be heavily used on Windows (and also in VS Code), and much less useful on macOS. That said, with <kbd>shift</kbd> and <kbd>space</kbd> on opposite hands, <kbd>Page Up</kbd> is the only way you can scroll up one page with only one hand on the keyboard (while on a regular keyboard, <kbd>shift</kbd>+<kbd>space</kbd> will do this).";
const guiKeyInfo =
  '<kbd>GUI</kbd>, which is either <kbd>cmd</kbd>/<kbd>⌘</kbd> on macOS or <kbd>win</kbd> on Windows. The default Ergo layout has this [[l-t-5-1|here]] — a crazy location for either operating system, in my opinion. It\'s worse on macOS, where every application shortcut uses it. Keeping <kbd>GUI</kbd> here makes it very easy to hit any application shortcut without remapping or straining your hands. The default value for this key is <kbd>hyper</kbd> (as <a class="underline" href="https://brettterpstra.com/2012/12/08/a-useful-caps-lock-key/">described by Brett Terpstra</a>), which is only useful for user-defined shortcuts. While those are certainly useful if available, for my workflow, they are by no means mandatory, and I think there are many other places for a <kbd>hyper</kbd> key if you truly desire one.';
const bracketKeyInfo =
  "On a regular keyboard, this is a shift key. I desperately needed to shift without using my pinky, so I mapped it here: [[l-t-1-3|<kbd>shift</kbd>]]. However, mapping another key shift but leaving this as a useful shift key gave me too much of a crutch. At the same time, on the Ergodox default layout the <kbd>[</kbd> and <kbd>]</kbd> keys are in an awkward place anyway, and the shift keys are actually easier to reach than the default location for [[r-f-9-9|<kbd>[</kbd>]] and [[r-f-11-9|<kbd>]</kbd>]]. A win in both directions. The only time I miss a shift key on the right is when I'm using the mouse and need to shift on the right side of the keyboard with my left hand - which is pretty rare.";
const volumeControlInfo =
  "It's nice to have dedicated volume keys, but isn't a necessity. I've also experimented with using these keys to enter different function layers, which works well too. The default location of the bracket keys <kbd>[</kbd> and <kbd>]</kbd>, where I have <kbd>🔈▽</kbd> and <kbd>🔈△</kbd>, is unwieldy - at least as a programmer, I don't think that's a good spot for them. (I've moved the brackets [[l-f-1-7|here]] and [[r-f-13-7|here]]";

const arrowKeySelection = ["l-f-8-9", "l-f-10-9", "r-f-5-9", "r-f-7-9"];
const volKeySelection = ["r-f-9-9", "r-f-11-9", "r-f-13-9"];
const bracketKeySelection = ["l-f-1-7", "r-f-13-7"];
const pageUpDownHomeEndSelection = ["l-t-5-1", "l-t-5-3", "r-t-1-1", "r-t-1-3"];
const guiKeySelection = ["l-f-14-6", "r-f-1-6"];

const DebugLayout = {
  fullName: "Debug layout",
  guides: {
    exampleGuide: {
      fullName: "Example guide",
      steps: [
        {
          key: "l-f-8-9",
        },
        {
          key: "r-f-9-9",
        },
        {
          key: "l-t-5-1",
        },
        {
          key: "l-f-1-7",
        },
      ],
    },
    otherExample: {
      fullName: "Other example",
      steps: [
        {
          key: "l-f-8-9",
        },
        {
          key: "r-f-9-9",
        },
      ],
    },
    lolThirdOne: {
      fullName: "Lol third one",
      steps: [
        {
          key: "l-f-8-9",
        },
        {
          key: "r-f-9-9",
        },
      ],
    },
  },
  leftHandKeys: [
    // number row
    {
      legend: "=",
      board: ["left", "finger"],
      size: [3, 2],
      startPos: [1, 1],
      info: [
        "<p>",
        normalLayoutInfo,
        arrowKeyInfo,
        pageUpDownHomeEndInfo,
        guiKeyInfo,
        bracketKeyInfo,
        volumeControlInfo,
        "</p>",
      ].join("</p>\n<p>"),
      selection: [].concat(
        arrowKeySelection,
        volKeySelection,
        bracketKeySelection,
        pageUpDownHomeEndSelection,
        guiKeySelection,
      )
    },
    {
      legend: "1",
      board: ["left", "finger"],
      startPos: [4, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "2",
      board: ["left", "finger"],
      startPos: [6, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "3",
      board: ["left", "finger"],
      startPos: [8, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "4",
      board: ["left", "finger"],
      startPos: [10, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "5",
      board: ["left", "finger"],
      startPos: [12, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "esc",
      name: "escape",
      board: ["left", "finger"],
      startPos: [14, 1],
      info:
        "[[l-f-1-1|This will be]] asdf [[l-f-4-1|a pathological key]] [[l-f-6-1|that has]] [[l-f-8-1|too many]] [[l-f-10-1|references]]",
    },

    // top alpha row
    {
      legend: "`",
      board: ["left", "finger"],
      size: [3, 2],
      startPos: [1, 3],
      info:
        "Slightly different from the location of this key on a normal keyboard, but more convenient than the [[l-f-2-9|ErgoDox default]]. You could theoretically swap it with [[l-f-1-1|<kbd>=/+</kbd>]], but I decided I preferred that key to mirror [[r-f-13-1|<kbd>-/_</kbd>]] on opposite sides of the keyboard so I would remember them easier. That leaves this space as the best fit for this key. Additionally, while this is the location for the tab key on a normal keyboard, that key is much better suited for a non-pinky finger, e.g. [[l-f-14-3|<kbd>tab</kbd>]].",
    },
    {
      legend: "q",
      board: ["left", "finger"],
      startPos: [4, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "w",
      board: ["left", "finger"],
      startPos: [6, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "e",
      board: ["left", "finger"],
      startPos: [8, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "r",
      board: ["left", "finger"],
      startPos: [10, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "t",
      board: ["left", "finger"],
      startPos: [12, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "tab",
      name: "tab",
      board: ["left", "finger"],
      size: [2, 3],
      startPos: [14, 3],
      info:
        "This is a very natural place for the tab key. It's so easy to hit, and the index finger is much stronger than the pinky - for such a commonly used key, remapping it here is a good return for the mental remapping cost.",
    },

    // middle / home alpha row
    {
      unset: true,
      name: "Unset",
      board: ["left", "finger"],
      size: [3, 2],
      startPos: [1, 5],
      info:
        "I have nothing mapped here and I don't miss it. I guess you could put a real <kbd>capslock</kbd> key here if you want? On a normal keyboard, I remap <kbd>capslock</kbd> to <kbd>ctrl</kbd>, but that's not necessary on for this layout. Removing the <kbd>ctrl</kbd> mapping helped me remember the new <kbd>ctrl</kbd> location, which is why it's blank now.",
    },
    {
      legend: "a",
      board: ["left", "finger"],
      startPos: [4, 5],
      info: normalLayoutInfo,
    },
    {
      legend: "s",
      board: ["left", "finger"],
      startPos: [6, 5],
      info: normalLayoutInfo,
    },
    {
      legend: "d",
      board: ["left", "finger"],
      startPos: [8, 5],
      info: normalLayoutInfo,
    },
    {
      legend: "f",
      board: ["left", "finger"],
      startPos: [10, 5],
      info: normalLayoutInfo,
    },
    {
      legend: "g",
      board: ["left", "finger"],
      startPos: [12, 5],
      info: normalLayoutInfo,
    },

    // bottom alpha row
    {
      legend: "[",
      board: ["left", "finger"],
      size: [3, 2],
      startPos: [1, 7],
      info: bracketKeyInfo,
      selection: bracketKeySelection,
    },
    {
      legend: "z",
      board: ["left", "finger"],
      startPos: [4, 7],
      info: normalLayoutInfo,
    },
    {
      legend: "x",
      board: ["left", "finger"],
      startPos: [6, 7],
      info: normalLayoutInfo,
    },
    {
      legend: "c",
      board: ["left", "finger"],
      startPos: [8, 7],
      info: normalLayoutInfo,
    },
    {
      legend: "v",
      board: ["left", "finger"],
      startPos: [10, 7],
      info: normalLayoutInfo,
    },
    {
      legend: "b",
      board: ["left", "finger"],
      startPos: [12, 7],
      info: normalLayoutInfo,
    },
    {
      legend: "gui",
      name: "GUI",
      board: ["left", "finger"],
      size: [2, 3],
      startPos: [14, 6],
      info: guiKeyInfo,
      selection: guiKeySelection,
    },

    // the function row at the very bottom
    {
      legend: "layer_func",
      name: "function layer",
      board: ["left", "finger"],
      startPos: [2, 9],
      info:
        "A tap/toggle key for the LAYER_FUNC layer, which contains F1-20, keys like insert and pause/break, media keys, and can also enter other layers to control keyboard backlight color and for testing.",
    },
    {
      unset: true,
      name: "Unset",
      board: ["left", "finger"],
      startPos: [4, 9],
      info:
        "I haven't found anything useful to map here. In the past I've used it to enter other layers.",
    },
    {
      unset: true,
      name: "Unset",
      board: ["left", "finger"],
      startPos: [6, 9],
      info:
        "I haven't found anything useful to map here. In the past I've used it to enter other layers.",
    },
    {
      legend: "arrow_left",
      name: "left arrow",
      board: ["left", "finger"],
      startPos: [8, 9],
      info: arrowKeyInfo,
      selection: arrowKeySelection,
    },
    {
      legend: "arrow_right",
      name: "right arrow",
      board: ["left", "finger"],
      startPos: [10, 9],
      info: arrowKeyInfo,
      selection: arrowKeySelection,
    },
  ],
  leftThumbKeys: [
    {
      legend: "del",
      name: "forward delete",
      board: ["left", "thumb"],
      size: [2, 2],
      startPos: [3, 1],
      info:
        "Some people will use this all the time; others might use <kbd>ctrl</kbd>-<kbd>d</kbd> instead and not need it much. Nice to at least have available for <kbd>ctrl</kbd>-<kbd>alt</kbd>-<kbd>delete</kbd>.",
    },
    {
      legend: "home",
      name: "home",
      board: ["left", "thumb"],
      size: [2, 2],
      startPos: [5, 1],
      info: pageUpDownHomeEndInfo,
      selection: pageUpDownHomeEndSelection,
    },
    {
      legend: "shift",
      name: "shift",
      board: ["left", "thumb"],
      size: [2, 4],
      startPos: [1, 3],
      info:
        "I've found this to be a really good place for <kbd>shift</kbd>. I can easily reach any key necessary - the longest reach is to the <kbd>=</kbd> key for <kbd>+</kbd>, and I can do that easily, repeatedly, painlessly, and with room to spare. I did have to remap the normal <kbd>shift</kbd> key location (next to <kbd>Z</kbd> and <kbd>?</kbd>) in order to train my hands to use this one, but after a day or two of that it feels very fast and natural.",
    },
    {
      legend: "backspace",
      name: "backspace",
      board: ["left", "thumb"],
      size: [2, 4],
      startPos: [3, 3],
      info:
        "The default ErgoDox-EZ location. Works great, and having this super commonly used key under a strong thumb is a huge improvement over having it under a weak pinky finger.",
    },
    {
      legend: "end",
      name: "end",
      board: ["left", "thumb"],
      size: [2, 2],
      startPos: [5, 3],
      info: pageUpDownHomeEndInfo,
      selection: pageUpDownHomeEndSelection,
    },
    {
      legend: "ctrl",
      name: "control",
      board: ["left", "thumb"],
      size: [2, 2],
      startPos: [5, 5],
      info:
        "<kbd>ctrl</kbd> works really well here. It's a very commonly used key, and even moreso for Emacs users. Every key on the keyboard is reachable while holding down this key, and it's very easy to find. On a normal keyboard, I remap the key in the [[l-f-1-5|<kbd>capslock</kbd>]] position to <kbd>ctrl</kbd>; for this layout, I had to remove that mapping to stop me from falling back to old habits. Once I did that, this key works very naturally.",
    },
  ],
  rightHandKeys: [
    // number row
    {
      legend: "leader",
      name: "leader key",
      board: ["right", "finger"],
      startPos: [1, 1],
      info:
        "[[l-f-1-7|This]] [[l-f-4-7|will]] [[l-f-6-7|be]] [[l-f-8-7|another]] [[l-f-10-7|pathological]] [[l-f-12-7|key]] [[l-f-14-6|with]] [[l-f-2-9|way]] [[l-f-4-9|too]] [[l-f-6-9|many]] [[l-f-8-9|connections]] [[l-f-10-9|to]] [[l-t-1-3|possibly]] [[l-t-3-1|make]] [[l-t-3-3|sense]]. [[l-t-5-1|What a]] [[l-t-5-3|fun]] [[l-t-5-5|time]].",
    },
    {
      legend: "6",
      board: ["right", "finger"],
      startPos: [3, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "7",
      board: ["right", "finger"],
      startPos: [5, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "8",
      board: ["right", "finger"],
      startPos: [7, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "9",
      board: ["right", "finger"],
      startPos: [9, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "0",
      board: ["right", "finger"],
      startPos: [11, 1],
      info: normalLayoutInfo,
    },
    {
      legend: "-",
      board: ["right", "finger"],
      size: [3, 2],
      startPos: [13, 1],
      info: normalLayoutInfo,
    },

    // top alpha row
    {
      legend: "layer_mouse",
      name: "mouse layer",
      board: ["right", "finger"],
      size: [2, 3],
      startPos: [1, 3],
      info:
        "Tap/Toggle key for my mouse / layer. I don't use this all the time, BUT when my right arm is feeling particularly in pain or strained, it can be nice not to have to reach further to the right for the mouse.",
    },
    {
      legend: "y",
      board: ["right", "finger"],
      startPos: [3, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "u",
      board: ["right", "finger"],
      startPos: [5, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "i",
      board: ["right", "finger"],
      startPos: [7, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "o",
      board: ["right", "finger"],
      startPos: [9, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "p",
      board: ["right", "finger"],
      startPos: [11, 3],
      info: normalLayoutInfo,
    },
    {
      legend: "\\",
      board: ["right", "finger"],
      size: [3, 2],
      startPos: [13, 3],
      info: normalLayoutInfo,
    },

    // middle / home alpha row
    {
      legend: "h",
      board: ["right", "finger"],
      startPos: [3, 5],
      info: normalLayoutInfo,
    },
    {
      legend: "j",
      board: ["right", "finger"],
      startPos: [5, 5],
      info: normalLayoutInfo,
    },
    {
      legend: "k",
      board: ["right", "finger"],
      startPos: [7, 5],
      info: normalLayoutInfo,
    },
    {
      legend: "l",
      board: ["right", "finger"],
      startPos: [9, 5],
      info: normalLayoutInfo,
    },
    {
      legend: ";",
      board: ["right", "finger"],
      startPos: [11, 5],
      info: normalLayoutInfo,
    },
    {
      legend: "'",
      board: ["right", "finger"],
      size: [3, 2],
      startPos: [13, 5],
      info: normalLayoutInfo,
    },

    // bottom alpha row
    {
      legend: "gui",
      name: "GUI",
      board: ["right", "finger"],
      size: [2, 3],
      startPos: [1, 6],
      info: guiKeyInfo,
      selection: guiKeySelection,
    },
    {
      legend: "n",
      board: ["right", "finger"],
      startPos: [3, 7],
      info: normalLayoutInfo,
    },
    {
      legend: "m",
      board: ["right", "finger"],
      startPos: [5, 7],
      info: normalLayoutInfo,
    },
    {
      legend: ",",
      board: ["right", "finger"],
      startPos: [7, 7],
      info: normalLayoutInfo,
    },
    {
      legend: ".",
      board: ["right", "finger"],
      startPos: [9, 7],
      info: normalLayoutInfo,
    },
    {
      legend: "/",
      board: ["right", "finger"],
      startPos: [11, 7],
      info: normalLayoutInfo,
    },
    {
      legend: "]",
      board: ["right", "finger"],
      size: [3, 2],
      startPos: [13, 7],
      info: bracketKeyInfo,
      selection: bracketKeySelection,
    },

    // the function row at the very bottom
    {
      legend: "arrow_up",
      name: "up arrow",
      board: ["right", "finger"],
      size: [2, 2],
      startPos: [5, 9],
      info: arrowKeyInfo,
      selection: arrowKeySelection,
    },
    {
      legend: "arrow_down",
      name: "down arrow",
      board: ["right", "finger"],
      startPos: [7, 9],
      info: arrowKeyInfo,
      selection: arrowKeySelection,
    },
    {
      legend: "vol_down",
      name: "volume down",
      board: ["right", "finger"],
      startPos: [9, 9],
      info: volumeControlInfo,
      selection: volKeySelection,
    },
    {
      legend: "vol_up",
      name: "volume up",
      board: ["right", "finger"],
      startPos: [11, 9],
      info: volumeControlInfo,
      selection: volKeySelection,
    },
    {
      legend: "vol_mute",
      name: "mute",
      board: ["right", "finger"],
      startPos: [13, 9],
      info: volumeControlInfo,
      selection: volKeySelection,
    },
  ],
  rightThumbKeys: [
    {
      legend: "pgup",
      name: "page up",
      board: ["right", "thumb"],
      size: [2, 2],
      startPos: [1, 1],
      info: pageUpDownHomeEndInfo,
      selection: pageUpDownHomeEndSelection,
    },
    {
      legend: "menu",
      name: "application / menu",
      board: ["right", "thumb"],
      size: [2, 2],
      startPos: [3, 1],
      info:
        "Not a very important key, but it's useful sometimes on Windows and I wasn't using this space for anything anyway.",
    },
    {
      legend: "pgdn",
      name: "page down",
      board: ["right", "thumb"],
      size: [2, 2],
      startPos: [1, 3],
      info: pageUpDownHomeEndInfo,
      selection: pageUpDownHomeEndSelection,
    },
    {
      legend: "enter",
      name: "enter / return",
      board: ["right", "thumb"],
      size: [2, 4],
      startPos: [3, 3],
      info:
        "A good place for the return key. The default layout has it one key over, but I liked space better over there, so I moved return here.",
    },
    {
      legend: "space",
      name: "space",
      board: ["right", "thumb"],
      size: [2, 4],
      startPos: [5, 3],
      info:
        "A great place for <kbd>space</kbd>. I initially had mirrored <kbd>space</kbd> keys, one under each thumb, but eventually moved the left thumb to be <kbd>shift</kbd>, which was immediately a huge positive for me.",
    },
    {
      legend: "opt",
      name: "option",
      board: ["right", "thumb"],
      size: [2, 2],
      startPos: [1, 5],
      info:
        "Option (macOS) or Alt (Windows) works great here as a mirror to Ctrl in the mirror position under the left thumb. The same benefits apply - it's commonly used, and every key on the keyboard is accessible while chording it.",
    },
  ]
};

export default DebugLayout;
