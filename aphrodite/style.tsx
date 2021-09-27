import {Property} from "csstype";

export type CountingUnit = "px" | "%" | "em"

export default interface AphroditeComponentStyle {
  cursor: Property.Cursor
  zIndex: number,
  size: {
    width: number
    height: number
    lineHeight: number | undefined
    widthCountingUnit: CountingUnit
    heightCountingUnit: CountingUnit
    lineHeightCountingUnit: CountingUnit
  }
  location: {
    x: number
    y: number
    xCountingUnit: CountingUnit
    yCountingUnit: CountingUnit
    xReverse: boolean
    yReverse: boolean
  }
  text: {
    size: number
    sizeCountingUnit: CountingUnit
    align: Property.TextAlign
    verticalAlign: Property.VerticalAlign
    color: Property.Color
    letterSpacing: number
    letterSpacingCountingUnit: CountingUnit
  }
  background: {
    color: Property.Color
    img: string
  }
  padding: {
    top: number
    bottom: number
    left: number
    right: number
    topCountingUnit: CountingUnit
    bottomCountingUnit: CountingUnit
    leftCountingUnit: CountingUnit
    rightCountingUnit: CountingUnit
  }
  margin: {
    top: number
    bottom: number
    left: number
    right: number
    topCountingUnit: CountingUnit
    bottomCountingUnit: CountingUnit
    leftCountingUnit: CountingUnit
    rightCountingUnit: CountingUnit
  }
  border: {
    top: {
      style: "solid" | "dotted" | "double" | "dashed",
      width: number
      color: Property.Color
      countingUnit: CountingUnit
    }
    bottom: {
      style: "solid" | "dotted" | "double" | "dashed",
      width: number
      color: Property.Color
      countingUnit: CountingUnit
    }
    left: {
      style: "solid" | "dotted" | "double" | "dashed",
      width: number
      color: Property.Color
      countingUnit: CountingUnit
    }
    right: {
      style: "solid" | "dotted" | "double" | "dashed",
      width: number
      color: Property.Color
      countingUnit: CountingUnit
    }
  }
}

export const buildStandardStyle = (): AphroditeComponentStyle => {
  return {
    zIndex: 0,
    cursor: "default",
    text: {
      align: "left",
      color: "#000",
      letterSpacing: 0,
      letterSpacingCountingUnit: "px",
      size: 12,
      sizeCountingUnit: "px",
      verticalAlign: "baseline"
    },
    size: {
      width: 100,
      height: 30,
      widthCountingUnit: "px",
      heightCountingUnit: "px",
      lineHeight: undefined,
      lineHeightCountingUnit: "px"

    },
    location: {
      x: 0,
      y: 0,
      xCountingUnit: "px",
      yCountingUnit: "px",
      xReverse: false,
      yReverse: false,
    },
    background: {
      color: "#fff",
      img: "none",
    },
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      topCountingUnit: "px",
      leftCountingUnit: "px",
      rightCountingUnit: "px",
      bottomCountingUnit: "px",
    },
    margin: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      topCountingUnit: "px",
      leftCountingUnit: "px",
      bottomCountingUnit: "px",
      rightCountingUnit: "px",
    },
    border: {
      top: {
        style: "solid",
        width: 0,
        color: "#00000000",
        countingUnit: "px"
      },
      bottom: {
        style: "solid",
        width: 0,
        color: "#00000000",
        countingUnit: "px"
      },
      left: {
        style: "solid",
        width: 0,
        color: "#00000000",
        countingUnit: "px"
      },
      right: {
        style: "solid",
        width: 0,
        color: "#00000000",
        countingUnit: "px"
      },
    }
  }
}
