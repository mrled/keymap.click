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
const ctrlKeyInfo =
  "<kbd>ctrl</kbd> works really well here. It's a very commonly used key, and even moreso for Emacs users. Every key on the keyboard is reachable while holding down this key, and it's very easy to find. On a normal keyboard, I remap the key in the [[l-f-1-5|<kbd>capslock</kbd>]] position to <kbd>ctrl</kbd>; for this layout, I had to remove that mapping to stop me from falling back to old habits. Once I did that, this key works very naturally.";
const optKeyInfo =
  "Option (macOS) or Alt (Windows) works great here. It's easy to hit with your thumb, and having two of them means you don't have to stretch much. As <kbd>opt</kbd> + a left/right arrow key is a very common chord, it's worth noting that this placement works well with my [[l-f-8-9|left side]] and [[r-f-7-9|right side]] arrow layer keys.";
const arrowLayerKeyInfo = "Enter an arrow layer, where [[l-f-8-3|<kbd>e</kbd>]] [[l-f-6-5|<kbd>s</kbd>]] [[l-f-8-5|<kbd>d</kbd>]] [[l-f-10-5|<kbd>f</kbd>]] and [[r-f-7-3|<kbd>i</kbd>]] [[r-f-5-5|<kbd>j</kbd>]] [[r-f-7-5|<kbd>k</kbd>]] [[r-f-9-5|<kbd>l</kbd>]] are arrow keys.";


const arrowKeySelection = ["l-f-8-9", "l-f-10-9", "r-f-5-9", "r-f-7-9"];
const volKeySelection = ["r-f-9-9", "r-f-11-9", "r-f-13-9"];
const bracketKeySelection = ["l-f-1-7", "r-f-13-7"];
const pageUpDownHomeEndSelection = ["l-t-5-1", "l-t-5-3", "r-t-1-1", "r-t-1-3"];
const guiKeySelection = ["l-f-14-6", "r-f-1-6"];
const ctrlKeySelection = ["l-t-5-5", "r-t-1-5"];
const optKeySelection = ["l-f-10-9", "r-f-5-9"];
const arrowLayerKeySelection = ["l-f-8-9", "r-f-7-9"];
const qwertySelection = [
  "l-f-4-1", "l-f-6-1", "l-f-8-1", "l-f-10-1", "l-f-12-1",
  "l-f-4-3", "l-f-6-3", "l-f-8-3", "l-f-10-3", "l-f-12-3",
  "l-f-4-5", "l-f-6-5", "l-f-8-5", "l-f-10-5", "l-f-12-5",
  "l-f-4-7", "l-f-6-7", "l-f-8-7", "l-f-10-7", "l-f-12-7",

  "r-f-3-1", "r-f-5-1", "r-f-7-1", "r-f-9-1", "r-f-11-1", "r-f-13-1",
  "r-f-3-3", "r-f-5-3", "r-f-7-3", "r-f-9-3", "r-f-11-3", "r-f-13-3",
  "r-f-3-5", "r-f-5-5", "r-f-7-5", "r-f-9-5", "r-f-11-5", "r-f-13-5",
  "r-f-3-7", "r-f-5-7", "r-f-7-7", "r-f-9-7", "r-f-11-7",
];
const pinkyReliefSelection = [
  "l-f-14-1", // escape
  "l-f-14-3", // tab
  "l-t-1-3", // shift
  "l-t-3-3", // backspace
  "l-t-5-5", "r-t-1-5", // ctrl
  "r-t-3-3", // return
];
const movedQwertyNonReliefSelection = [
  "l-f-1-1", // =+
  "l-f-1-3", // `~
  "l-f-1-7", // [{
  "r-f-13-7", // ]}
  "l-f-14-6", "r-f-1-6", // GUI
  "l-f-8-9", "r-f-5-9", // option
];
const extraFeaturesSelection = [
  "l-f-2-9", // function layer
  "l-f-8-9", "r-f-7-9", // arrow layer
  "r-f-1-1", // leader key
  "r-f-1-3", // mouse layer
  "r-f-9-9", "r-f-11-9", "r-f-13-9", // volume keys
];

const MrlMainLayer = {
  fullName: "Main layer",
  defaultGuide: "mrlGuide",
  guides: {
    mrlGuide: {
      fullName: "Guide to MrlMainLayout",
      steps: [
        {
          title: "Welcome to the guide to my main keyboard layout",
          text: "This is a guide to the layout for my ErgoDox keyboard. See the help button or the menu for more information about this site, how it's built, who I am, or what this keyboard is. Note the navigation buttons above this text, and click next when you're ready to see the next step in the guide. Note that you can exit the guide at any time with the 'Exit' button, or by clicking on any key on the keyboard.",
        },
        {
          title: "Following the guide",
          text: "<p>Some steps of the guide, like the previous intro step, will contain text in the bottom information panel, but won't be highlighting a specific key. Other steps of the guide will highlight a key or a group of keys. In this example, the <kbd>mute</kbd> key is highlighted in orange, which shows. You may also see other keys highlighted in lighter orange, such as in this case the other volume-related keys in the layout. Finally some keys might be referenced in the text. These will be highlighted in green and have a green line drawn to them. For instance, I can't put my volume keys on the other side of the board, because I'm using [[l-f-2-9|this key]] for my function layer.</p><p>That's about all you need to know about how the guide works. Next I'll show you the details of the board in broad strokes, and after that I'll get into specific keys.<p>",
          key: "r-f-9-9",
          selection: volKeySelection,
        },
        {
          title: "QWERTY keys",
          text: "Most of the keys on this keyboard are in their default QWERTY location. Even so, there is something special about the ErgoDox style keyboard. The keys are <em>ortholinear</em>, which means that they are arrayed in neat columns rather than offset like a traditional QWERTY keyboard. Along with the split boards that can be moved independently (connected by a cable), this means your fingers extend straight out, or curl straight in, to hit any key.",
          selection: qwertySelection,
        },
        {
          title: "Relieving my pinky",
          text: "<p>I remapped all of these keys in order to relieve what became intense, painful strain on the pinky fingers of both hands. I am not the first to notice that these keys &mdash; <kbd>esc</kbd>, <kbd>tab</kbd>, <kbd>shift</kbd>, <kbd>backspace</kbd>, <kdb>ctrl</kbd>, and <kbd>return</kbd> &mdash; are some of the most commonly used keys on the board, and yet we use them with our weakest fingers. Changing the location of these keys has made a massive difference in my day to day life on a keyboard, and it was easy to learn.</p><p>At its worst, the tendon on the outside of each forearm from pinky-side of the palm to the elbow would be swollen, rock hard, and painful to touch. Touching any keys with my pinkies would feel like tiny stabs of pain. It was miserable.</>",
          selection: pinkyReliefSelection,
        },
        { key: "l-f-14-1" },
        { key: "l-f-14-3" },
        { key: "l-t-1-3" },
        { key: "l-t-3-3" },
        {
          key: "l-t-5-5",
          selection: ctrlKeySelection,
        },
        { key: "r-t-3-3" },
        {
          title: "Other remapped keys",
          text: "Due to the layout of the ErgoDox, some keys had to be moved from their normal QWERTY positions.",
          selection: movedQwertyNonReliefSelection,
        },
        { key: "l-f-1-1" },
        { key: "l-f-1-3" },
        {
          key: "r-f-13-7",
          selection: bracketKeySelection,
        },
        {
          key: "r-f-1-6",
          selection: guiKeySelection,
        },
        {
          key: "r-f-5-9",
          selection: optKeySelection,
        },
        {
          title: "Layers and extra features",
          text: "Since the board is powered by QMK, I can also get extra features besides just moving keys around.",
          selection: extraFeaturesSelection,
        },
        { key: "l-f-2-9" },
        { key: "r-f-7-9" },
        { key: "r-f-1-1" },
        { key: "r-f-1-3" },
        {
          key: "r-f-11-9",
          selection: volKeySelection,
        },
        {
          title: "The end",
          text: "Thanks for all the clicks.",
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
      info:
        "Takes a little getting used to up here, but is normal for other Ergodox layouts, and isn't too bad.",
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
        "In my experience this is a MUCH better use of this key than the default layout of a left arrow. Reduces pinky strain compared to its [[l-f-1-1|default]] QWERTY position",
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
      legend: "capslock",
      name: "capslock",
      board: ["left", "finger"],
      size: [3, 2],
      startPos: [1, 5],
      info:
        "Mapped to <kbd>capslock</kbd> for fun, even though I don't use it much. On a normal keyboard, I remap <kbd>capslock</kbd> to <kbd>ctrl</kbd>, but that's not necessary on for this layout. Removing the <kbd>ctrl</kbd> mapping helped me remember the new <kbd>ctrl</kbd> location, which is why it's blank now.",
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
      legend: "layer_arrow",
      name: "arrow layer",
      board: ["left", "finger"],
      startPos: [8, 9],
      info: arrowLayerKeyInfo,
      selection: arrowLayerKeySelection,
    },
    {
      legend: "opt",
      name: "option",
      board: ["left", "finger"],
      startPos: [10, 9],
      info: optKeyInfo,
      selection: optKeySelection,
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
      info: ctrlKeyInfo,
      selection: ctrlKeySelection,
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
        "The Leader Key. Not actually a layer, despite the symbol. I don't use this much, but I do keep it as a common escape key for any layer except for the base layer.",
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
      legend: "opt",
      name: "option",
      board: ["right", "finger"],
      startPos: [5, 9],
      info: optKeyInfo,
      selection: optKeySelection,
    },
    {
      legend: "layer_arrow",
      name: "arrow layer",
      board: ["right", "finger"],
      startPos: [7, 9],
      info: arrowLayerKeyInfo,
      selection: arrowLayerKeySelection,
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
      legend: "ctrl",
      name: "control",
      board: ["right", "thumb"],
      size: [2, 2],
      startPos: [1, 5],
      info: ctrlKeyInfo,
      selection: ctrlKeySelection,
    },
  ]
};

export default MrlMainLayer;
