const UnicodeLegends = {
  "=": { glyph: { value: ["=", "+"] } },
  "1": { glyph: { value: "1" } },
  "2": { glyph: { value: "2" } },
  "3": { glyph: { value: "3" } },
  "4": { glyph: { value: "4" } },
  "5": { glyph: { value: "5" } },
  "esc": { glyph: { value: "⎋" }, },
  "`": { glyph: { value: ["`", "~"] } },
  "q": { glyph: { value: "Q" } },
  "w": { glyph: { value: "W" } },
  "e": { glyph: { value: "E" } },
  "r": { glyph: { value: "R" } },
  "t": { glyph: { value: "T" } },
  "tab": { glyph: { value: "⇥" }, },
  "a": { glyph: { value: "A" } },
  "s": { glyph: { value: "S" } },
  "d": { glyph: { value: "D" } },
  "f": { glyph: { value: "F" } },
  "g": { glyph: { value: "G" } },
  "[": { glyph: { value: ["[", "{"] } },
  "z": { glyph: { value: "Z" } },
  "x": { glyph: { value: "X" } },
  "c": { glyph: { value: "C" } },
  "v": { glyph: { value: "V" } },
  "b": { glyph: { value: "B" } },

  "gui": {
    glyph: {
      value: "⌘",
      fontSize: "text-base md:text-lg",
    },
  },

  "layer_func": { glyph: { value: "⎆f" }, },
  "arrow_left": { glyph: { value: "←" }, },
  "arrow_right": { glyph: { value: "→", }, },
  "del": {
    glyph: {
      value: "⌦",
      fontSize: "text-base md:text-lg",
    },
  },
  "home": { text: { value: "Home", } },
  "shift": {
    glyph: {
      value: "⇧",
      fontSize: "text-lg md:text-xl",
    },
  },
  "backspace": {
    glyph: {
      value: "⌫",
      fontSize: "text-base md:text-lg",
    },
  },
  "end": { text: { value: "End", } },
  "ctrl": {
    glyph: {
      value: "⌃",
      fontSize: "text-sm md:text-base"
    },
  },

  // number row
  "leader": { glyph: { value: "⎆l" } },
  "6": { glyph: { value: "6" } },
  "7": { glyph: { value: "7" } },
  "8": { glyph: { value: "8" } },
  "9": { glyph: { value: "9" } },
  "0": { glyph: { value: "0" } },
  "-": { glyph: { value: ["-", "_"] } },
  "layer_mouse": { glyph: { value: "⎆m" }, },
  "y": { glyph: { value: "Y" } },
  "u": { glyph: { value: "U" } },
  "i": { glyph: { value: "I" } },
  "o": { glyph: { value: "O" } },
  "p": { glyph: { value: "P" } },
  "\\": { glyph: { value: ["\\", "|"] } },
  "h": { glyph: { value: "H" } },
  "j": { glyph: { value: "J" } },
  "k": { glyph: { value: "K" } },
  "l": { glyph: { value: "L" } },
  ";": { glyph: { value: [";", ":"] } },
  "'": { glyph: { value: ['"', "'"] } },

  "n": { glyph: { value: "N" } },
  "m": { glyph: { value: "M" } },
  ",": { glyph: { value: [",", "<"] } },
  ".": { glyph: { value: [".", ">"] } },
  "/": { glyph: { value: ["/", "?"] } },
  "]": { glyph: { value: ["]", "}"] } },

  "arrow_up": { glyph: { value: "↑", }, },
  "arrow_down": { glyph: { value: "↓", }, },
  "vol_down": { text: { value: "VOL-" }, },
  "vol_up": { text: { value: "VOL+", }, },
  "vol_mute": { text: { value: "VOL0", }, },
  "pgup": { text: { value: "PgUp", } },
  "menu": { glyph: { value: "☰", }, },
  "pgdn": { text: { value: "PgDn", }, },
  "enter": {
    glyph: {
      value: "⏎",
      fontSize: "text-lg md:text-xl",
    },
  },
  "space": {
    glyph: {
      value: "␣",
      fontSize: "text-lg md:text-xl",
    },
  },
  "opt": {
    glyph: {
      value: "⌥",
      fontSize: "text-sm md:text-base",
    },
  },
  "capslock": {
    glyph: { value: "⇪" }
  },
  "layer_arrow": {
    text: { value: "←↑↓→" }
  }
}

export default UnicodeLegends;
