const normalLayoutInfo = [`Unchanged from normal QWERTY keyboard layout`];

const pageUpDownHomeEndInfo = [
  `
    I keep the four <kbd>page up</kbd>, <kbd>page down</kbd>, <kbd>home</kbd>,
    and <kbd>end</kbd> keys here. I find them useful, but not mandatory. They
    tend to be heavily used on Windows and other Microsoft products like
    Outlook and VS Code, and much less useful on macOS.
  `,
  `
    These keys are difficult for me to use without actually looking down at
    the keyboard.
  `,
];

const guiKeyInfo = [
  `
      This key represents either <kbd>cmd</kbd>/<kbd>⌘</kbd> on macOS or
      <kbd>win</kbd> on Windows. Keeping it in this location makes it very easy
      to hit any application shortcut without remapping them in the operating
      system or straining your hands.
    `,
];

const bracketKeyInfo = [
  `
      Brackets work really well for me here, and shift keys work really poorly
      for me here, so this odd key placement is a win-win for me.
    `,
  `
      The most important aspect of this placement is that it is <em>not</em> a
      <kbd>shift</kbd> key. When I first got my ErgoDox, using shift with either
      hand had become excruciating, and I desperately needed to shift without
      using my pinky. To accomplish this, I remapped
      <key-indicator id="l-t-1-3">
        <kbd>shift</kbd>
      </key-indicator>
      to under the thumb. However, moving shift to a new location without
      removing the normal QWERTY shift mapping gave me too much of a crutch, so
      I needed to remove shift from its normal location.
    `,
  `
      Even so, why brackets? On the ErgoDox default layout, the brackets are in
      an awkward place anyway, and the shift keys are actually easier to reach
      than the default location for
      <key-indicator id="r-f-9-9">
        <kbd>[</kbd>
      </key-indicator>
      and
      <key-indicator id="r-f-11-9">
        <kbd>]</kbd>
      </key-indicator>
      .
    `,
];

const volumeControlInfo = [
  `
    It&apos;s nice to have dedicated volume keys, but isn&apos;t a necessity.
    I&apos;ve also experimented with using these keys to enter different
    function layers, which works well too.
  `,
];

const ctrlKeyInfo = [
  `
      Keeping this key out from under my pinky is vital &mdash;
      <em>especially</em> since I can&apos;t seem to break two decades of Emacs
      habits.
    `,
  `
      Happily, this is a really excellent location for <kbd>ctrl</kbd>, much
      better than the default QWERTY location, and only possible on an ErgoDox,
      because it&apos;s easier to chord with any key on the board.
    `,
  `
      On a normal keyboard, I remap the key in the
      <key-indicator id="l-f-1-5">
        <kbd>capslock</kbd>
      </key-indicator>
      position to <kbd>ctrl</kbd>; for this layout, I had to remove that mapping
      to stop me from falling back to old habits.
    `,
];

const optKeyInfo = [
  `
      This key represents either <kbd>opt</kbd>/<kbd> ⌥</kbd> on macOS or
      <kbd>alt</kbd> on Windows. This location is easy to hit with your thumb,
      and having two of them means you don&apos;t have to stretch much.
    `,
  `
      As <kbd>opt</kbd> + a left/right arrow key is a very common chord,
      it&apos;s worth noting that this placement works well with my
      <key-indicator id="l-f-8-9">left side</key-indicator> and
      <key-indicator id="r-f-7-9">right side</key-indicator> arrow layer keys.
      I can chord <kbd>opt</kbd>+<kbd>arrow layer</kbd> with one thumb without
      any strain, and use the other hand to move the cursor with the arrow keys.
    `,
];

const arrowLayerKeyInfo = [
  `
      Enter an arrow layer, where
      <key-indicator id="l-f-8-3">
        <kbd>e</kbd>
      </key-indicator>
      <key-indicator id="l-f-6-5">
        <kbd>s</kbd>
      </key-indicator>
      <key-indicator id="l-f-8-5">
        <kbd>d</kbd>
      </key-indicator>
      <key-indicator id="l-f-10-5">
        <kbd>f</kbd>
      </key-indicator>
      and
      <key-indicator id="r-f-7-3">
        <kbd>i</kbd>
      </key-indicator>
      <key-indicator id="r-f-5-5">
        <kbd>j</kbd>
      </key-indicator>
      <key-indicator id="r-f-7-5">
        <kbd>k</kbd>
      </key-indicator>
      <key-indicator id="r-f-9-5">
        <kbd>l</kbd>
      </key-indicator>
      are arrow keys.
    `,
  `
      This is a fantastically useful idea that I did not invent. I got
      <a href="https://tonsky.me/blog/cursor-keys/">the original vision</a> from
      <a href="https://tonsky.me/">Nikita</a>, who has a much nicer website than
      I do. His solution is really good, but I cannot use <kbd>capslock</kbd> to
      activate the arrow layer; on a normal QWERTY keyboard, I must remap that
      key to <kbd>ctrl</kbd>, and more importantly I want to avoid chording keys
      with my pinky as much as possible.
    `,
  `
      People more accustomed to the vim way of doing things might prefer
      <kbd>H</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> instead of the
      inverted-T arrow placement I use, to which I say, go wild man, be free.
    `,
];

// const arrowKeySelection = ["l-f-8-9", "l-f-10-9", "r-f-5-9", "r-f-7-9"];
const volKeySelection = ["r-f-9-9", "r-f-11-9", "r-f-13-9"];
const bracketKeySelection = ["l-f-1-7", "r-f-13-7"];
const pageUpDownHomeEndSelection = ["l-t-5-1", "l-t-5-3", "r-t-1-1", "r-t-1-3"];
const guiKeySelection = ["l-f-14-6", "r-f-1-6"];
const ctrlKeySelection = ["l-t-5-5", "r-t-1-5"];
const optKeySelection = ["l-f-10-9", "r-f-5-9"];
const arrowLayerKeySelection = ["l-f-8-9", "r-f-7-9"];
const qwertySelection = [
  "l-f-4-1",
  "l-f-6-1",
  "l-f-8-1",
  "l-f-10-1",
  "l-f-12-1",
  "l-f-4-3",
  "l-f-6-3",
  "l-f-8-3",
  "l-f-10-3",
  "l-f-12-3",
  "l-f-4-5",
  "l-f-6-5",
  "l-f-8-5",
  "l-f-10-5",
  "l-f-12-5",
  "l-f-4-7",
  "l-f-6-7",
  "l-f-8-7",
  "l-f-10-7",
  "l-f-12-7",

  "r-f-3-1",
  "r-f-5-1",
  "r-f-7-1",
  "r-f-9-1",
  "r-f-11-1",
  "r-f-13-1",
  "r-f-3-3",
  "r-f-5-3",
  "r-f-7-3",
  "r-f-9-3",
  "r-f-11-3",
  "r-f-13-3",
  "r-f-3-5",
  "r-f-5-5",
  "r-f-7-5",
  "r-f-9-5",
  "r-f-11-5",
  "r-f-13-5",
  "r-f-3-7",
  "r-f-5-7",
  "r-f-7-7",
  "r-f-9-7",
  "r-f-11-7",
];
const pinkyReliefSelection = [
  "l-f-14-1", // escape
  "l-f-14-3", // tab
  "l-t-1-3", // shift
  "l-t-3-3", // backspace
  "l-t-5-5",
  "r-t-1-5", // ctrl
  "r-t-3-3", // return
];
const movedQwertyNonReliefSelection = [
  "l-f-1-1", // =+
  "l-f-1-3", // `~
  "l-f-1-7", // [{
  "r-f-13-7", // ]}
  "l-f-14-6",
  "r-f-1-6", // GUI
  "l-f-10-9",
  "r-f-5-9", // option
];
const extraFeaturesSelection = [
  "l-f-2-9", // function layer
  "l-f-8-9",
  "r-f-7-9", // arrow layer
  "r-f-1-1", // leader key
  "r-f-1-3", // mouse layer
  "r-f-9-9",
  "r-f-11-9",
  "r-f-13-9", // volume keys
];

const MrlMainLayer = {
  fullName: "Main layer",
  welcome: [
    `Welcome to my keymap. I wrote this guide to explain how my ErgoDox helped my RSI.`,
  ],
  defaultGuide: "mrlGuide",
  guides: {
    mrlGuide: {
      fullName: "Guide to MrlMainLayout",
      steps: [
        {
          title: "Welcome to the guide to my main keyboard layout",
          text: [
            `
                Keys highlighted in orange have been moved from their
                traditional QWERTY location to relieve pain.
              `,
            `
                You&apos;ll note that all of them are moved inward, such that
                they are within reach of either the index finger or the thumb.
                <strong>
                  This is the biggest benefit of the ErgoDox for me.
                </strong>
              `,
            `
                I remapped all of these keys in order to relieve what became
                intense, painful strain on the pinky fingers of both hands. At
                its worst, the tendon on the outside of each forearm from
                pinky-side of the palm to the elbow would be swollen, rock hard,
                and painful to touch. Touching any keys with my pinkies would
                feel like tiny stabs of pain. It was miserable.
              `,
            `
                I am not the first to notice that these keys &mdash;
                <kbd>esc</kbd>, <kbd>tab</kbd>, <kbd>shift</kbd>,
                <kbd>backspace</kbd>, <kbd>ctrl</kbd>, and <kbd>return</kbd>
                &mdash; are some of the most commonly used keys on the board,
                and yet we use them with our pinkies, which are the weakest
                fingers we have. Changing the location of these keys has made a
                massive difference in my day to day life on a keyboard, and it
                was easy to learn.
              `,
            `Once I changed these keys, my pain decreased drastically.`,
          ],
          selection: pinkyReliefSelection,
        },
        {
          title: "QWERTY keys",
          text: [
            `
                While the most significant benefit of the ErgoDox is the ability
                to remap keys, see how many keys remain in their default QWERTY
                position. The benefits I got were cheap. I could keep most of
                what I knew from regular keyboards.
              `,
            `
                Even for these QWERTY keys, though, there is something special
                about the ErgoDox layout. The keys are <em>ortholinear</em>,
                which means that they are arrayed in neat columns rather than
                offset like a traditional QWERTY keyboard. This way, my fingers
                extend straight out, or curl straight in, to hit any key.
              `,
            `
                Towards the center and tilted at an angle, you will notice the
                <em>thumb clusters</em>. This design lets you use the powerful
                muscles in your thumbs to strike the most commonly used keys.
              `,
            `
                Additionally, you can see that the keyboard is actually two
                independent boards. They are connected by a flexible cable, and
                can be positioned straight in front of your arms. This helps
                keep correct posture and relaxed shoulders.
              `,
          ],
          selection: qwertySelection,
        },
        {
          title: "Changing key locations to relieve my pinky",
          text: [
            `
                Here are the most important keys I moved again. This is just the
                same group of keys as on step one.
              `,
            `In the following steps, we will examine them individually.`,
          ],
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
          text: [
            `
                Due to the layout of the ErgoDox, some keys had to be moved from
                their normal QWERTY positions.
              `,
            `
                Changing the location of these keys did not impact my RSI, but
                some of the new locations might be surprising, so it&apos;s
                worth examining what has changed and why.
              `,
          ],
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
          text: [
            `
                Since the board is powered by
                <a href="https://qmk.fm/">QMK</a>, I can also get extra
                features besides just moving keys around. See the next few steps
                of the guide for special keys and cool tricks.
              `,
          ],
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
          text: [`Thanks for all the clicks.`],
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
        `
            This placement takes a little getting used to, but it&apos;s normal
            for other Ergodox layouts, and honestly isn&apos;t too bad. It helps
            me to remember that it mirrors
            <key-indicator id="r-f-13-1">
              <kbd>-_</kbd>
            </key-indicator>
            on the opposite side of the board.
          `,
      ],
    },
    {
      legend: "1",
      board: ["left", "finger"],
      startPos: [4, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "2",
      board: ["left", "finger"],
      startPos: [6, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "3",
      board: ["left", "finger"],
      startPos: [8, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "4",
      board: ["left", "finger"],
      startPos: [10, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "5",
      board: ["left", "finger"],
      startPos: [12, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "esc",
      name: "escape",
      board: ["left", "finger"],
      startPos: [14, 1],
      info: [
        `
            Reduces pinky strain compared to its QWERTY position, which is above
            <key-indicator id="l-f-1-1">this key</key-indicator> on a QWERTY
            keyboard &mdash; a position that is not actually available on an
            ErgoDox.
          `,
        `
            <kbd>esc</kbd> is used often enough in computing I think any
            RSI-afflicted user would benefit from this new location, but I
            recommend it especially to heavy vim users.
          `,
        `
            This placement is easy to remember, particularly because the default
            location is unavailable to remind you.
          `,
      ],
    },

    // top alpha row
    {
      legend: "`",
      board: ["left", "finger"],
      size: [3, 2],
      startPos: [1, 3],
      info: [
        `
            Slightly different from the location of this key on a normal QWERTY
            keyboard. You could theoretically swap it with
            <key-indicator id="l-f-1-1">
              <kbd>=/+</kbd>
            </key-indicator>
            to keep the QWERTY position, but I decided I preferred that key to
            mirror <kbd>-/_</kbd> on the opposite side of the keyboard so I
            would remember it more easily. That leaves this space as the best
            fit for this key. Additionally, while this is the location for the
            tab key on a normal keyboard, that key is much better suited for a
            <key-indicator id="l-f-14-3">different location</key-indicator>
            under a stronger finger than the pinky.
          `,
      ],
    },
    {
      legend: "q",
      board: ["left", "finger"],
      startPos: [4, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "w",
      board: ["left", "finger"],
      startPos: [6, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "e",
      board: ["left", "finger"],
      startPos: [8, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "r",
      board: ["left", "finger"],
      startPos: [10, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "t",
      board: ["left", "finger"],
      startPos: [12, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "tab",
      name: "tab",
      board: ["left", "finger"],
      size: [2, 3],
      startPos: [14, 3],
      info: [
        `
            Reduces pinky strain over its default location. This is a very
            natural place for this key, and it&apos;s very easy to hit.
          `,
        `
            A good location for <kbd>tab</kbd> must take into account the
            location of other keys. In this layout, I can easily chord with
            <key-indicator id="l-f-14-6">
              <kbd>cmd</kbd>
            </key-indicator>
            to switch programs on macOS,
            <key-indicator id="l-f-10-9">
              <kbd>alt</kbd>
            </key-indicator>
            to switch programs on Windows along with other keys like
            <kbd>ctrl</kbd>, and <kbd>shift</kbd>.
          `,
      ],
    },

    // middle / home alpha row
    {
      legend: "capslock",
      name: "capslock",
      board: ["left", "finger"],
      size: [3, 2],
      startPos: [1, 5],
      info: [
        `
          I enabled <kbd>capslock</kbd> on this key for fun, even though I
          don&apos;t really use it. On a normal keyboard, I remap this key to
          <kbd>ctrl</kbd>, but I chose not to keep that mapping so I could
          better remember the new
          <key-indicator id="l-t-5-5">
            <kbd>left ctrl</kbd>
          </key-indicator>
          and
          <key-indicator id="r-t-1-5">
            <kbd>right ctrl</kbd>
          </key-indicator>
          locations.
        `,
      ],
    },
    {
      legend: "a",
      board: ["left", "finger"],
      startPos: [4, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "s",
      board: ["left", "finger"],
      startPos: [6, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "d",
      board: ["left", "finger"],
      startPos: [8, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "f",
      board: ["left", "finger"],
      startPos: [10, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "g",
      board: ["left", "finger"],
      startPos: [12, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
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
      selection: qwertySelection,
    },
    {
      legend: "x",
      board: ["left", "finger"],
      startPos: [6, 7],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "c",
      board: ["left", "finger"],
      startPos: [8, 7],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "v",
      board: ["left", "finger"],
      startPos: [10, 7],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "b",
      board: ["left", "finger"],
      startPos: [12, 7],
      info: normalLayoutInfo,
      selection: qwertySelection,
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
      info: [
        `
            Holding this key enters my &ldquo;function layer&rdquo;,
            transforming every key on the board to a special function. For
            instance, while holding down this key, I have access to function
            keys <kbd>F1</kbd> all the way through <kbd>F20</kbd>, as well as
            media keys, keys to control screen brightness, and even keys to
            access even more esoteric layers I use for testing or controlling
            the color of the LEDs underneath the keyboard.
          `,
        `
            For more information on layers, see
            <a href="https://docs.qmk.fm/#/feature_layers">QMK documentation</a>
            .
          `,
      ],
    },
    {
      unset: true,
      name: "Unset",
      board: ["left", "finger"],
      startPos: [4, 9],
      info: [
        `
            I haven&apos;t found anything useful to map here. In the past
            I&apos;ve used it to enter other layers.
          `,
      ],
    },
    {
      unset: true,
      name: "Unset",
      board: ["left", "finger"],
      startPos: [6, 9],
      info: [
        `
            I haven&apos;t found anything useful to map here. In the past
            I&apos;ve used it to enter other layers.
          `,
      ],
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
      info: [
        `
          Some people will use this all the time; others might use
          <kbd>ctrl</kbd>-<kbd>d</kbd> instead and not need it much. Nice to at
          least have available for <kbd>ctrl</kbd>-<kbd>alt</kbd>-
          <kbd>delete</kbd>.
        `,
      ],
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
      info: [
        `
            Moving this key under my thumb was the single most important key
            remap to address my pinky strain.
          `,
        `
            I can easily reach any key necessary &mdash; the longest reach is to
            <key-indicator id="l-f-1-1">
              <kbd>=/+</kbd>
            </key-indicator>
            , and I can do that easily, repeatedly, painlessly, and with room to
            spare.
          `,
        `
            I did have to remap the normal locations for
            <key-indicator id="l-f-1-7">
              <kbd>left shift</kbd>
            </key-indicator>
            and
            <key-indicator id="r-f-13-7">
              <kbd>right shift</kbd>
            </key-indicator>
            to other keys in order to train my hands to use this new location.
            After a day or two the new locations felt very fast and natural.
          `,
      ],
    },
    {
      legend: "backspace",
      name: "backspace",
      board: ["left", "thumb"],
      size: [2, 4],
      startPos: [3, 3],
      info: [
        `
            Having this very commonly used key under a strong thumb is a huge
            improvement over having it under a weak pinky finger. I apparently
            have a habit of hammering this key pretty hard, a fact I learned
            about myself very painfully on a QWERTY keyboard once each press of
            this key started to induce a sharp pain in my right hand.
          `,
        `
            I found this new location easy to get used to, which must be why it
            is also the location in the default ErgoDox-EZ layout.
          `,
      ],
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
      info: [
        `
            This is a cool
            <a href="https://beta.docs.qmk.fm/using-qmk/advanced-keycodes/feature_leader_key">
              feature of the QMK firmware
            </a>
            that I honestly almost never use.
          `,
        `
            It is a key that is designed to work like the vim leader key. You
            can set a key sequence to activate any functionality, including
            holding down several keys at once (perhaps <kbd>ctrl</kbd>
            <kbd>alt</kbd> <kbd>delete</kbd>) or inputting a whole sequence of
            characters.
          `,
        `
            It&apos;s an advanced part of QMK that I hope to spend more time
            with in the future.
          `,
      ],
    },
    {
      legend: "6",
      board: ["right", "finger"],
      startPos: [3, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "7",
      board: ["right", "finger"],
      startPos: [5, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "8",
      board: ["right", "finger"],
      startPos: [7, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "9",
      board: ["right", "finger"],
      startPos: [9, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "0",
      board: ["right", "finger"],
      startPos: [11, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "-",
      board: ["right", "finger"],
      size: [3, 2],
      startPos: [13, 1],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },

    // top alpha row
    {
      legend: "layer_mouse",
      name: "mouse layer",
      board: ["right", "finger"],
      size: [2, 3],
      startPos: [1, 3],
      info: [
        `
            Holding this key activates a mouse layer where
            <key-indicator id="l-f-8-3">
              <kbd>e</kbd>
            </key-indicator>
            <key-indicator id="l-f-6-5">
              <kbd>s</kbd>
            </key-indicator>
            <key-indicator id="l-f-8-5">
              <kbd>d</kbd>
            </key-indicator>
            <key-indicator id="l-f-10-5">
              <kbd>f</kbd>
            </key-indicator>
            control the mouse cursor. I also use some keys under the thumbs for
            clicking
            <key-indicator id="l-t-1-3">
              <kbd>left</kbd>
            </key-indicator>
            and
            <key-indicator id="l-t-3-3">
              <kbd>right</kbd>
            </key-indicator>
            mouse buttons.
          `,
        `
            I don&apos;t use this all the time, however when my right arm is
            feeling particularly in pain or strained, it can be nice not to have
            to reach further to the right for the mouse.
          `,
      ],
    },
    {
      legend: "y",
      board: ["right", "finger"],
      startPos: [3, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "u",
      board: ["right", "finger"],
      startPos: [5, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "i",
      board: ["right", "finger"],
      startPos: [7, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "o",
      board: ["right", "finger"],
      startPos: [9, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "p",
      board: ["right", "finger"],
      startPos: [11, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "\\",
      board: ["right", "finger"],
      size: [3, 2],
      startPos: [13, 3],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },

    // middle / home alpha row
    {
      legend: "h",
      board: ["right", "finger"],
      startPos: [3, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "j",
      board: ["right", "finger"],
      startPos: [5, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "k",
      board: ["right", "finger"],
      startPos: [7, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "l",
      board: ["right", "finger"],
      startPos: [9, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: ";",
      board: ["right", "finger"],
      startPos: [11, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "'",
      board: ["right", "finger"],
      size: [3, 2],
      startPos: [13, 5],
      info: normalLayoutInfo,
      selection: qwertySelection,
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
      selection: qwertySelection,
    },
    {
      legend: "m",
      board: ["right", "finger"],
      startPos: [5, 7],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: ",",
      board: ["right", "finger"],
      startPos: [7, 7],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: ".",
      board: ["right", "finger"],
      startPos: [9, 7],
      info: normalLayoutInfo,
      selection: qwertySelection,
    },
    {
      legend: "/",
      board: ["right", "finger"],
      startPos: [11, 7],
      info: normalLayoutInfo,
      selection: qwertySelection,
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
      info: [
        `
          Not a very important key, but it&apos;s useful sometimes on Windows
          and I wasn&apos;t using this space for anything anyway.
        `,
      ],
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
      info: [
        `
            As with
            <key-indicator id="l-t-3-3">
              <kbd>backspace</kbd>
            </key-indicator>
            , I hit this key pretty hard, so moving it out from under a pinky
            finger eased pain right away.
          `,
        `This was easy to get used to`,
        `
            The default ErgoDox layout has it
            <key-indicator id="r-t-5-3">one key over</key-indicator>, but I
            preferred <kbd>space</kbd> in that spot instead, so I moved return
            here.
          `,
      ],
    },
    {
      legend: "space",
      name: "space",
      board: ["right", "thumb"],
      size: [2, 4],
      startPos: [5, 3],
      info: [
        `
          A great place for <kbd>space</kbd>. I initially had mirrored
          <kbd>space</kbd> keys, one under each thumb, but eventually moved the
          left thumb to be
          <key-indicator id="l-t-1-3">
            <kbd>shift</kbd>
          </key-indicator>
          , which was immediately a huge positive for me.
        `,
      ],
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
  ],
};

export default MrlMainLayer;
