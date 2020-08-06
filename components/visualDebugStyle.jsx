import React from "react";

const VisualDebugStyleEnabled = () => {
  return <style jsx global>
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
        border-color: #feebc8;
        border-style: solid;
        border-width: 1px;
      }
      .debug-border-teal {
        border-color: #b2f5ea;
        border-style: solid;
        border-width: 1px;
      }
      .debug-border-yellow {
        border-color: #fefcbf;
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
      .debug-bg-teal {
        background-color: #b2f5ea;
      }
      .debug-bg-yellow {
        background-color: #fefcbf;
      }
    `}
  </style>
}

const VisualDebugStyleDisabled = () => {
  return <style jsx global>{``}</style>
}

export const VisualDebugStyle = ({ enableDebug }) => {
  return enableDebug ? <VisualDebugStyleEnabled /> : <VisualDebugStyleDisabled />
}
