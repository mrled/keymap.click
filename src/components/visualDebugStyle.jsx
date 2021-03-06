import React from "react";

const VisualDebugStyleEnabled = () => {
  return (
    <style jsx global>
      {`
        .debug-border-red {
          border-color: #fed7d7;
          border-style: solid;
          border-width: 1px;
        }
        .debug-border-green {
          border-color: #c6f6d5;
          border-style: solid;
          border-width: 1px;
        }
        .debug-border-purple {
          border-color: #e9d8fd;
          border-style: solid;
          border-width: 1px;
        }
        .debug-border-orange {
          border-color: #ea9904;
          border-style: solid;
          border-width: 1px;
        }
        .debug-border-teal {
          border-color: #b2f5ea;
          border-style: solid;
          border-width: 1px;
        }
        .debug-border-yellow {
          border-color: #fdf874;
          border-style: solid;
          border-width: 1px;
        }
        .debug-bg-red {
          background-color: #fed7d7;
        }
        .debug-bg-green {
          background-color: #c6f6d5;
        }
        .debug-bg-purple {
          background-color: #e9d8fd;
        }
        .debug-bg-orange {
          background-color: #feebc8;
        }
        .debug-trans-bg-orange {
          background-color: rgba(254, 235, 200, 0.2);
        }
        .debug-bg-teal {
          background-color: #b2f5ea;
        }
        .debug-bg-yellow {
          background-color: #fefcbf;
        }
        .debug-trans-bg-yellow {
          background-color: rgba(254, 252, 191, 0.2);
        }
      `}
    </style>
  );
};

const VisualDebugStyleDisabled = () => {
  return <style jsx global>{``}</style>;
};

export const VisualDebugStyle = ({ enableDebug }) => {
  return enableDebug ? (
    <VisualDebugStyleEnabled />
  ) : (
    <VisualDebugStyleDisabled />
  );
};
