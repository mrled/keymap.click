/* A simple component containing the introduction text
 */
export const IntroText = () => {
  return (
    <div className="pb-20">
      <h1 className="text-3xl pb-8 mb-8">
        keyblay: Experiments in keyboard layouts
      </h1>
      <p className="p-1">This is a work in progress.</p>
      <p className="p-1">
        I am building this to show off keyboard layouts for my ErgoDox, and
        provide explanations for why I made the layout decisions I made. The
        ErgoDox-EZ has been a huge part of my strategy for dealing with RSI,
        and I want to be able to visually explain to others how it helped
        me.
      </p>
      <p className="p-1">
        I am building it on GitHub. Issues and contributions welcome.{" "}
        <a
          className="text-blue-600 undere"
          href="https://github.com/mrled/keyblay"
        >
          https://github.com/mrled/keyblay
        </a>
      </p>
    </div>
  );
};
