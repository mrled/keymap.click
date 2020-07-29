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

export const leftHandKeys = [
  // number row
  {
    legendText: "= +",
    board: ["left", "finger"],
    size: [3, 2],
    startPos: [1, 1],
    info:
      "Takes a little getting used to up here, but is normal for other Ergodox layouts, and isn't too bad.",
  },
  {
    legendText: "1",
    board: ["left", "finger"],
    startPos: [4, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "2",
    board: ["left", "finger"],
    startPos: [6, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "3",
    board: ["left", "finger"],
    startPos: [8, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "4",
    board: ["left", "finger"],
    startPos: [10, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "5",
    board: ["left", "finger"],
    startPos: [12, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "Esc",
    legendSymbol: "⎋",
    legendImageName: "wikimedia/escape.svg",
    name: "escape",
    board: ["left", "finger"],
    startPos: [14, 1],
    info:
      "In my experience this is a MUCH better use of this key than the default layout of a left arrow. Reduces pinky strain compared to its [[l-f-1-1|default]] QWERTY position",
  },

  // top alpha row
  {
    legendText: "` ~",
    board: ["left", "finger"],
    size: [3, 2],
    startPos: [1, 3],
    info:
      "Slightly different from the location of this key on a normal keyboard, but more convenient than the [[l-f-2-9|ErgoDox default]]. You could theoretically swap it with [[l-f-1-1|<kbd>=/+</kbd>]], but I decided I preferred that key to mirror [[r-f-13-1|<kbd>-/_</kbd>]] on opposite sides of the keyboard so I would remember them easier. That leaves this space as the best fit for this key. Additionally, while this is the location for the tab key on a normal keyboard, that key is much better suited for a non-pinky finger, e.g. [[l-f-14-3|<kbd>tab</kbd>]].",
  },
  {
    legendText: "Q",
    board: ["left", "finger"],
    startPos: [4, 3],
    info: normalLayoutInfo,
  },
  {
    legendText: "W",
    board: ["left", "finger"],
    startPos: [6, 3],
    info: normalLayoutInfo,
  },
  {
    legendText: "E",
    board: ["left", "finger"],
    startPos: [8, 3],
    info: normalLayoutInfo,
  },
  {
    legendText: "R",
    board: ["left", "finger"],
    startPos: [10, 3],
    info: normalLayoutInfo,
  },
  {
    legendText: "T",
    board: ["left", "finger"],
    startPos: [12, 3],
    info: normalLayoutInfo,
  },
  {
    legendSymbol: "⇥",
    legendText: "Tab",
    legendImageName: "iconmoon/tab.svg",
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
    legendText: "A",
    board: ["left", "finger"],
    startPos: [4, 5],
    info: normalLayoutInfo,
  },
  {
    legendText: "S",
    board: ["left", "finger"],
    startPos: [6, 5],
    info: normalLayoutInfo,
  },
  {
    legendText: "D",
    board: ["left", "finger"],
    startPos: [8, 5],
    info: normalLayoutInfo,
  },
  {
    legendText: "F",
    board: ["left", "finger"],
    startPos: [10, 5],
    info: normalLayoutInfo,
  },
  {
    legendText: "G",
    board: ["left", "finger"],
    startPos: [12, 5],
    info: normalLayoutInfo,
  },

  // bottom alpha row
  {
    legendText: "[ {",
    board: ["left", "finger"],
    size: [3, 2],
    startPos: [1, 7],
    info: bracketKeyInfo,
    selection: bracketKeySelection,
  },
  {
    legendText: "Z",
    board: ["left", "finger"],
    startPos: [4, 7],
    info: normalLayoutInfo,
  },
  {
    legendText: "X",
    board: ["left", "finger"],
    startPos: [6, 7],
    info: normalLayoutInfo,
  },
  {
    legendText: "C",
    board: ["left", "finger"],
    startPos: [8, 7],
    info: normalLayoutInfo,
  },
  {
    legendText: "V",
    board: ["left", "finger"],
    startPos: [10, 7],
    info: normalLayoutInfo,
  },
  {
    legendText: "B",
    board: ["left", "finger"],
    startPos: [12, 7],
    info: normalLayoutInfo,
  },
  {
    legendSymbol: "⌘",
    legendText: "Gui",
    legendImageName: "iconmoon/command.svg",
    name: "GUI",
    board: ["left", "finger"],
    size: [2, 3],
    startPos: [14, 6],
    legendSymbolSize: "text-base md:text-lg",
    info: guiKeyInfo,
    selection: guiKeySelection,
  },

  // the function row at the very bottom
  {
    legendText: "Func",
    legendImageName: "iconmoon/stack.svg",
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
    legendText: "←",
    legendImageName: "iconmoon/arrow-left2.svg",
    name: "left arrow",
    board: ["left", "finger"],
    startPos: [8, 9],
    info: arrowKeyInfo,
    selection: arrowKeySelection,
  },
  {
    legendText: "→",
    legendImageName: "iconmoon/arrow-right2.svg",
    name: "right arrow",
    board: ["left", "finger"],
    startPos: [10, 9],
    info: arrowKeyInfo,
    selection: arrowKeySelection,
  },
];

export const leftThumbKeys = [
  {
    legendSymbol: "⌦",
    legendText: "Del",
    legendImageName: "modified/mrl_material_ic_backspace_48px_REVERSED.svg",
    name: "forward delete",
    board: ["left", "thumb"],
    size: [2, 2],
    startPos: [3, 1],
    legendSymbolFontSize: "text-base md:text-lg",
    info:
      "Some people will use this all the time; others might use <kbd>ctrl</kbd>-<kbd>d</kbd> instead and not need it much. Nice to at least have available for <kbd>ctrl</kbd>-<kbd>alt</kbd>-<kbd>delete</kbd>.",
  },
  {
    legendText: "Home",
    name: "home",
    board: ["left", "thumb"],
    size: [2, 2],
    startPos: [5, 1],
    info: pageUpDownHomeEndInfo,
    selection: pageUpDownHomeEndSelection,
  },
  {
    legendSymbol: "⇧",
    legendText: "Shft",
    legendImageName: "iconmoon/shift.svg",
    name: "shift",
    board: ["left", "thumb"],
    size: [2, 4],
    startPos: [1, 3],
    legendSymbolFontSize: "text-lg md:text-xl",
    info:
      "I've found this to be a really good place for <kbd>shift</kbd>. I can easily reach any key necessary - the longest reach is to the <kbd>=</kbd> key for <kbd>+</kbd>, and I can do that easily, repeatedly, painlessly, and with room to spare. I did have to remap the normal <kbd>shift</kbd> key location (next to <kbd>Z</kbd> and <kbd>?</kbd>) in order to train my hands to use this one, but after a day or two of that it feels very fast and natural.",
  },
  {
    legendSymbol: "⌫",
    legendText: "Bksp",
    legendImageName: "material/ic_backspace_48px.svg",
    name: "backspace",
    board: ["left", "thumb"],
    size: [2, 4],
    startPos: [3, 3],
    legendSymbolFontSize: "text-base md:text-lg",
    info:
      "The default ErgoDox-EZ location. Works great, and having this super commonly used key under a strong thumb is a huge improvement over having it under a weak pinky finger.",
  },
  {
    legendText: "End",
    name: "end",
    board: ["left", "thumb"],
    size: [2, 2],
    startPos: [5, 3],
    info: pageUpDownHomeEndInfo,
    selection: pageUpDownHomeEndSelection,
  },
  {
    legendText: "Ctrl",
    legendSymbol: "⌃",
    legendImageName: "iconmoon/ctrl.svg",
    name: "control",
    legendSymbolFontSize: "text-sm md:text-base",
    board: ["left", "thumb"],
    size: [2, 2],
    startPos: [5, 5],
    info:
      "<kbd>ctrl</kbd> works really well here. It's a very commonly used key, and even moreso for Emacs users. Every key on the keyboard is reachable while holding down this key, and it's very easy to find. On a normal keyboard, I remap the key in the [[l-f-1-5|<kbd>capslock</kbd>]] position to <kbd>ctrl</kbd>; for this layout, I had to remove that mapping to stop me from falling back to old habits. Once I did that, this key works very naturally.",
  },
];

export const rightHandKeys = [
  // number row
  {
    legendText: "LEAD",
    // legendSymbol: "⎆l",
    legendImageName: "material/ic_send_48px.svg",
    name: "leader key",
    board: ["right", "finger"],
    startPos: [1, 1],
    info:
      "The Leader Key. Not actually a layer, despite the symbol. I don't use this much, but I do keep it as a common escape key for any layer except for the base layer.",
  },
  {
    legendText: "6",
    board: ["right", "finger"],
    startPos: [3, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "7",
    board: ["right", "finger"],
    startPos: [5, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "8",
    board: ["right", "finger"],
    startPos: [7, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "9",
    board: ["right", "finger"],
    startPos: [9, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "0",
    board: ["right", "finger"],
    startPos: [11, 1],
    info: normalLayoutInfo,
  },
  {
    legendText: "- _",
    board: ["right", "finger"],
    size: [3, 2],
    startPos: [13, 1],
    info: normalLayoutInfo,
  },

  // top alpha row
  {
    legendText: "Mous",
    legendSymbol: "⎆m",
    legendImageName: "material/ic_mouse_24px.svg",
    name: "mouse layer",
    board: ["right", "finger"],
    size: [2, 3],
    startPos: [1, 3],
    info:
      "Tap/Toggle key for my mouse / layer. I don't use this all the time, BUT when my right arm is feeling particularly in pain or strained, it can be nice not to have to reach further to the right for the mouse.",
  },
  {
    legendText: "Y",
    board: ["right", "finger"],
    startPos: [3, 3],
    info: normalLayoutInfo,
  },
  {
    legendText: "U",
    board: ["right", "finger"],
    startPos: [5, 3],
    info: normalLayoutInfo,
  },
  {
    legendText: "I",
    board: ["right", "finger"],
    startPos: [7, 3],
    info: normalLayoutInfo,
  },
  {
    legendText: "O",
    board: ["right", "finger"],
    startPos: [9, 3],
    info: normalLayoutInfo,
  },
  {
    legendText: "P",
    board: ["right", "finger"],
    startPos: [11, 3],
    info: normalLayoutInfo,
  },
  {
    legendText: "\\ |",
    board: ["right", "finger"],
    size: [3, 2],
    startPos: [13, 3],
    info: normalLayoutInfo,
  },

  // middle / home alpha row
  {
    legendText: "H",
    board: ["right", "finger"],
    startPos: [3, 5],
    info: normalLayoutInfo,
  },
  {
    legendText: "J",
    board: ["right", "finger"],
    startPos: [5, 5],
    info: normalLayoutInfo,
  },
  {
    legendText: "K",
    board: ["right", "finger"],
    startPos: [7, 5],
    info: normalLayoutInfo,
  },
  {
    legendText: "L",
    board: ["right", "finger"],
    startPos: [9, 5],
    info: normalLayoutInfo,
  },
  {
    legendText: ";",
    board: ["right", "finger"],
    startPos: [11, 5],
    info: normalLayoutInfo,
  },
  {
    legendText: "\" '",
    board: ["right", "finger"],
    size: [3, 2],
    startPos: [13, 5],
    info: normalLayoutInfo,
  },

  // bottom alpha row
  {
    legendSymbol: "⌘",
    legendText: "Gui",
    legendImageName: "iconmoon/command.svg",
    name: "GUI",
    board: ["right", "finger"],
    size: [2, 3],
    startPos: [1, 6],
    legendSymbolSize: "text-base md:text-lg",
    info: guiKeyInfo,
    selection: guiKeySelection,
  },
  {
    legendText: "N",
    board: ["right", "finger"],
    startPos: [3, 7],
    info: normalLayoutInfo,
  },
  {
    legendText: "M",
    board: ["right", "finger"],
    startPos: [5, 7],
    info: normalLayoutInfo,
  },
  {
    legendText: ", <",
    board: ["right", "finger"],
    startPos: [7, 7],
    info: normalLayoutInfo,
  },
  {
    legendText: ". >",
    board: ["right", "finger"],
    startPos: [9, 7],
    info: normalLayoutInfo,
  },
  {
    legendText: "/ ?",
    board: ["right", "finger"],
    startPos: [11, 7],
    info: normalLayoutInfo,
  },
  {
    legendText: "] }",
    board: ["right", "finger"],
    size: [3, 2],
    startPos: [13, 7],
    info: bracketKeyInfo,
    selection: bracketKeySelection,
  },

  // the function row at the very bottom
  {
    legendText: "↑",
    name: "up arrow",
    legendImageName: "iconmoon/arrow-up2.svg",
    board: ["right", "finger"],
    size: [2, 2],
    startPos: [5, 9],
    info: arrowKeyInfo,
    selection: arrowKeySelection,
  },
  {
    legendText: "↓",
    legendImageName: "iconmoon/arrow-down2.svg",
    name: "down arrow",
    board: ["right", "finger"],
    startPos: [7, 9],
    info: arrowKeyInfo,
    selection: arrowKeySelection,
  },
  {
    legendText: "VOL-",
    legendImageName: "iconmoon/volume-decrease.svg",
    // legendImageName: "material/ic_volume_down_48px.svg",
    name: "volume down",
    board: ["right", "finger"],
    startPos: [9, 9],
    info: volumeControlInfo,
    selection: volKeySelection,
  },
  {
    legendText: "VOL+",
    legendImageName: "iconmoon/volume-increase.svg",
    // legendImageName: "material/ic_volume_up_48px.svg",
    name: "volume up",
    board: ["right", "finger"],
    startPos: [11, 9],
    info: volumeControlInfo,
    selection: volKeySelection,
  },
  {
    legendText: "VOL0",
    legendImageName: "iconmoon/volume-mute2.svg",
    // legendImageName: "material/ic_volume_off_48px.svg",
    name: "mute",
    board: ["right", "finger"],
    startPos: [13, 9],
    info: volumeControlInfo,
    selection: volKeySelection,
  },
];

export const rightThumbKeys = [
  {
    legendText: "PgUp",
    name: "page up",
    board: ["right", "thumb"],
    size: [2, 2],
    startPos: [1, 1],
    info: pageUpDownHomeEndInfo,
    selection: pageUpDownHomeEndSelection,
  },
  {
    legendSymbol: "☰",
    legendText: "App",
    legendImageName: "misc/menu-key.svg",
    name: "application / menu",
    board: ["right", "thumb"],
    size: [2, 2],
    startPos: [3, 1],
    info:
      "Not a very important key, but it's useful sometimes on Windows and I wasn't using this space for anything anyway.",
  },
  {
    legendText: "PgDn",
    name: "page down",
    board: ["right", "thumb"],
    size: [2, 2],
    startPos: [1, 3],
    info: pageUpDownHomeEndInfo,
    selection: pageUpDownHomeEndSelection,
  },
  {
    legendSymbol: "⏎",
    legendText: "Entr",
    legendImageName: "material/ic_keyboard_return_48px.svg",
    name: "return",
    legendSymbolFontSize: "text-lg md:text-xl",
    board: ["right", "thumb"],
    size: [2, 4],
    startPos: [3, 3],
    info:
      "A good place for the return key. The default layout has it one key over, but I liked space better over there, so I moved return here.",
  },
  {
    legendSymbol: "␣",
    legendText: "Spc",
    name: "space",
    legendSymbolFontSize: "text-lg md:text-xl",
    board: ["right", "thumb"],
    size: [2, 4],
    startPos: [5, 3],
    info:
      "A great place for <kbd>space</kbd>. I initially had mirrored <kbd>space</kbd> keys, one under each thumb, but eventually moved the left thumb to be <kbd>shift</kbd>, which was immediately a huge positive for me.",
  },
  {
    legendSymbol: "⌥",
    legendText: "Opt",
    legendImageName: "iconmoon/opt.svg",
    name: "option",
    board: ["right", "thumb"],
    legendSymbolFontSize: "text-sm md:text-base",
    size: [2, 2],
    startPos: [1, 5],
    info:
      "Option (macOS) or Alt (Windows) works great here as a mirror to Ctrl in the mirror position under the left thumb. The same benefits apply - it's commonly used, and every key on the keyboard is accessible while chording it.",
  },
];

const buildAllKeys = () => {
  const allKeys = leftHandKeys
    .slice(0)
    .concat(leftThumbKeys, rightHandKeys, rightThumbKeys);
  allKeys.forEach((keyData, idx) => {
    const side = keyData.board[0] == "right" ? "r" : "l";
    const cluster = keyData.board[1] == "finger" ? "f" : "t";
    const keyId = `${side}-${cluster}-${keyData.startPos[0]}-${keyData.startPos[1]}`;
    keyData.reactKey = keyId;
    keyData.id = keyId;
  });
  return allKeys;
};
export const allKeys = buildAllKeys();

const buildAllKeysById = () => {
  var result = {};
  allKeys.forEach((keyData, idx) => {
    result[keyData.id] = keyData;
  });
  return result;
};
export const allKeysById = buildAllKeysById();
