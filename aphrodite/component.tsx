import StandardStyle from './core/styles/standard.less'
import React from "react";
import AphroditeComponentStyle, {buildStandardStyle} from "./style";
import Aphrodite from "./aphrodite";
import {uuidV4} from "./core/utils/id";

interface AphroditeComponentEvent {
  onClick: Array<(e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean>
  onMouseEnter: Array<(e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean>
  onMouseLeave: Array<(e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean>
  onMouseDown: Array<(e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean>
  onMouseUp: Array<(e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean>
}


interface AphroditeComponentProps {
  from: "aphrodite" | AphroditeComponent
}

interface AphroditeComponentStatus {
  componentElements: Array<JSX.Element>
  type: "root" | "son"
  style: AphroditeComponentStyle
  text: string
  events: AphroditeComponentEvent
}

function newAphroditeStatus(ac: AphroditeComponent): AphroditeComponentStatus {
  return {
    componentElements: new Array<JSX.Element>(),
    type: ac.props.from == "aphrodite" ? "root" : "son",
    style: buildStandardStyle(),
    text: "",
    events: {
      onClick: new Array<((e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean)>(),
      onMouseEnter: new Array<((e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean)>(),
      onMouseDown: new Array<((e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean)>(),
      onMouseLeave: new Array<((e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean)>(),
      onMouseUp: new Array<((e: React.MouseEvent<HTMLElement>, ac: AphroditeComponent) => boolean)>(),
    }
  }
}

export default class AphroditeComponent extends React.Component<AphroditeComponentProps, AphroditeComponentStatus> {
  public readonly id: string = uuidV4()
  private parent: "aphrodite" | AphroditeComponent
  private aphrodite: Aphrodite = new Aphrodite({})
  private components: Array<AphroditeComponent> = new Array<AphroditeComponent>()

  constructor(props: AphroditeComponentProps | any) {
    super(props);
    this.state = newAphroditeStatus(this)

    this.parent = this.props.from
  }

  init = (aphrodite: Aphrodite) => {
    this.aphrodite = aphrodite
  }

  // 创建一个组件，并且指定领导者为该组件
  createComponent = (map: Map<string, AphroditeComponent>, callback: (ac: AphroditeComponent) => void) => {
    const ces = this.state.componentElements;
    ces.push(
      <AphroditeComponent key={Math.random()} from={this} ref={
        (c) => {
          if (c != null) {
            c.init(this.aphrodite)
            this.components.push(c)
            map.set(c.id, c)
            callback(c)
          }
        }
      }/>
    )
    this.setState({
      componentElements: ces
    })
  }

  getText = (): string => this.state.text
  setText = (text: string) => this.setState({text: text})
  setStyle = (style: AphroditeComponentStyle | ((style: AphroditeComponentStyle, update: (style: AphroditeComponentStyle) => void) => void)) => {
    if (typeof style.valueOf() == "object") {
      this.setState({style: style as AphroditeComponentStyle})
    }else {
      let call = style as ((style: AphroditeComponentStyle, update: (style: AphroditeComponentStyle) => void) => void)
      call(this.state.style, (style: AphroditeComponentStyle) => {
        this.setStyle(style)
      })
    }
  }

  calcPaddingLeft = (): number => {
    if (this.state.style.padding.leftCountingUnit == "%") {
      return this.state.style.size.width * (this.state.style.padding.left / 100)
    }
    return this.state.style.padding.left
  }

  calcPaddingRight = (): number => {
    if (this.state.style.padding.rightCountingUnit == "%") {
      return this.state.style.size.width * (this.state.style.padding.right / 100)
    }
    return this.state.style.padding.right
  }

  calcPaddingTop = (): number => {
    if (this.state.style.padding.topCountingUnit == "%") {
      return this.state.style.size.height * (this.state.style.padding.top / 100)
    }
    return this.state.style.padding.top
  }

  calcPaddingBottom = (): number => {
    if (this.state.style.padding.bottomCountingUnit == "%") {
      return this.state.style.size.height * (this.state.style.padding.bottom / 100)
    }
    return this.state.style.padding.bottom
  }

  calcMarginLeft = (): number => {
    if (this.state.style.margin.leftCountingUnit == "%") {
      return this.state.style.size.width * (this.state.style.margin.left / 100)
    }
    return this.state.style.margin.left
  }

  calcMarginRight = (): number => {
    if (this.state.style.margin.rightCountingUnit == "%") {
      return this.state.style.size.width * (this.state.style.margin.right / 100)
    }
    return this.state.style.margin.right
  }

  calcMarginTop = (): number => {
    if (this.state.style.margin.topCountingUnit == "%") {
      return this.state.style.size.height * (this.state.style.margin.top / 100)
    }
    return this.state.style.margin.top
  }

  calcMarginBottom = (): number => {
    if (this.state.style.margin.bottomCountingUnit == "%") {
      return this.state.style.size.height * (this.state.style.margin.bottom / 100)
    }
    return this.state.style.margin.bottom
  }

  calcWidth = (): number => {
    return this.getRealWidth(this) - (
      (
        (this.state.style.border.left.countingUnit == "%"
          ? (this.state.style.size.width * this.state.style.border.left.width) / 100
          : this.state.style.border.left.width) +
        (this.state.style.border.right.countingUnit == "%"
          ? (this.state.style.size.width * this.state.style.border.right.width) / 100
          : this.state.style.border.right.width)
      ) +
      (
        (this.state.style.margin.leftCountingUnit == "%"
          ? (this.state.style.size.width * this.state.style.margin.left) / 100
          : this.state.style.margin.left) +
        (this.state.style.margin.rightCountingUnit == "%"
          ? (this.state.style.size.width * this.state.style.margin.right) / 100
          : this.state.style.margin.right)
      ) +
      (
        (this.state.style.padding.leftCountingUnit == "%"
          ? (this.state.style.size.width * this.state.style.padding.left) / 100
          : this.state.style.padding.left) +
        (this.state.style.padding.rightCountingUnit == "%"
          ? (this.state.style.size.width * this.state.style.padding.right) / 100
          : this.state.style.padding.right)
      )
    )
  }

  calcHeight = (): number => {
    return this.getRealHeight(this) - (
      (
        (this.state.style.border.top.countingUnit == "%"
          ? (this.state.style.size.height * this.state.style.border.top.width) / 100
          : this.state.style.border.top.width) +
        (this.state.style.border.bottom.countingUnit == "%"
          ? (this.state.style.size.height * this.state.style.border.bottom.width) / 100
          : this.state.style.border.bottom.width)
      ) +
      (
        (this.state.style.margin.topCountingUnit == "%"
          ? (this.state.style.size.height * this.state.style.margin.top) / 100
          : this.state.style.margin.top) +
        (this.state.style.margin.bottomCountingUnit == "%"
          ? (this.state.style.size.height * this.state.style.margin.bottom) / 100
          : this.state.style.margin.bottom)
      ) +
      (
        (this.state.style.padding.leftCountingUnit == "%"
          ? (this.state.style.size.height * this.state.style.padding.top) / 100
          : this.state.style.padding.top) +
        (this.state.style.padding.rightCountingUnit == "%"
          ? (this.state.style.size.height * this.state.style.padding.bottom) / 100
          : this.state.style.padding.bottom)
      )
    )
  }


  getRealWidth = (ac: AphroditeComponent): number => {
    if (this.state.style.size.widthCountingUnit != "%") {
      if (ac === this) {
        return this.state.style.size.width
      }
      return this.state.style.size.width - (
        (
          (this.state.style.border.left.countingUnit == "%"
            ? (this.state.style.size.width * this.state.style.border.left.width) / 100
            : this.state.style.border.left.width) +
          (this.state.style.border.right.countingUnit == "%"
            ? (this.state.style.size.width * this.state.style.border.right.width) / 100
            : this.state.style.border.right.width)
        ) +
        (
          (this.state.style.margin.leftCountingUnit == "%"
            ? (this.state.style.size.width * this.state.style.margin.left) / 100
            : this.state.style.margin.left) +
          (this.state.style.margin.rightCountingUnit == "%"
            ? (this.state.style.size.width * this.state.style.margin.right) / 100
            : this.state.style.margin.right)
        ) +
        (
          (this.state.style.padding.leftCountingUnit == "%"
            ? (this.state.style.size.width * this.state.style.padding.left) / 100
            : this.state.style.padding.left) +
          (this.state.style.padding.rightCountingUnit == "%"
            ? (this.state.style.size.width * this.state.style.padding.right) / 100
            : this.state.style.padding.right)
        )
      )
    }
    if (this.parent === "aphrodite") {
      return this.aphrodite.getWidth() * this.state.style.size.width / 100
    }else {
      return (this.parent.getRealWidth(ac) * (this.state.style.size.width / 100))// - this.parent.getWidthPadding()
    }
  }

  getRealHeight = (ac: AphroditeComponent): number => {
    if (this.state.style.size.heightCountingUnit != "%") {
      if (ac === this) {
        return this.state.style.size.height
      }
      return this.state.style.size.height - (
        (
          (this.state.style.border.top.countingUnit == "%"
            ? (this.state.style.size.height * this.state.style.border.top.width) / 100
            : this.state.style.border.top.width) +
          (this.state.style.border.bottom.countingUnit == "%"
            ? (this.state.style.size.height * this.state.style.border.bottom.width) / 100
            : this.state.style.border.bottom.width)
        ) +
        (
          (this.state.style.margin.topCountingUnit == "%"
            ? (this.state.style.size.height * this.state.style.margin.top) / 100
            : this.state.style.margin.top) +
          (this.state.style.margin.bottomCountingUnit == "%"
            ? (this.state.style.size.height * this.state.style.margin.bottom) / 100
            : this.state.style.margin.bottom)
        ) +
        (
          (this.state.style.padding.leftCountingUnit == "%"
            ? (this.state.style.size.height * this.state.style.padding.top) / 100
            : this.state.style.padding.top) +
          (this.state.style.padding.rightCountingUnit == "%"
            ? (this.state.style.size.height * this.state.style.padding.bottom) / 100
            : this.state.style.padding.bottom)
        )
      )
    }
    if (this.parent === "aphrodite") {
      return this.aphrodite.getHeight() * this.state.style.size.height / 100
    }else {
      return (this.parent.getRealHeight(ac) * (this.state.style.size.height / 100))// - this.parent.getHeightPadding()
    }
  }

  refresh = () => {
    this.components.map(function (v) {
      v.refresh()
    })
    this.setState({style: this.state.style})
  }

  render() {

    const typeClassName = this.state.type == "root" ? StandardStyle.aphroditeComponentRoot : StandardStyle.aphroditeComponentSon
    return (
      <div id={this.id} className={StandardStyle.aphroditeComponent + " " + typeClassName}
           onClick={(e: React.MouseEvent<HTMLElement>) => {
             this.state.events.onClick.map((event) => {
               let ac = this.aphrodite.getComponent(e.currentTarget)
               if (ac != null) if (event(e, ac)) e.stopPropagation()
             })
           }}
           onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
             this.state.events.onMouseEnter.map((event) => {
               let ac = this.aphrodite.getComponent(e.currentTarget)
               if (ac != null) if (event(e, ac)) e.stopPropagation()
             })
           }}
           onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
             this.state.events.onMouseLeave.map((event) => {
               let ac = this.aphrodite.getComponent(e.currentTarget)
               if (ac != null) if (event(e, ac)) e.stopPropagation()
             })
           }}
           onMouseDown={(e: React.MouseEvent<HTMLElement>) => {
             this.state.events.onMouseDown.map((event) => {
               let ac = this.aphrodite.getComponent(e.currentTarget)
               if (ac != null) if (event(e, ac)) e.stopPropagation()
             })
           }}
           onMouseUp={(e: React.MouseEvent<HTMLElement>) => {
             this.state.events.onMouseUp.map((event) => {
               let ac = this.aphrodite.getComponent(e.currentTarget)
               if (ac != null) if (event(e, ac)) e.stopPropagation()
             })
           }}

           style={{
             zIndex: this.state.style.zIndex,
             width: this.calcWidth(),
             height: this.calcHeight(),
             lineHeight: this.state.style.size.lineHeight + this.state.style.size.lineHeightCountingUnit,
             top: !this.state.style.location.yReverse ? this.state.style.location.y + this.state.style.location.yCountingUnit : undefined,
             bottom: this.state.style.location.yReverse ? this.state.style.location.y + this.state.style.location.yCountingUnit : undefined,
             left: !this.state.style.location.xReverse ? this.state.style.location.x + this.state.style.location.xCountingUnit: undefined,
             right: this.state.style.location.xReverse ? this.state.style.location.x + this.state.style.location.xCountingUnit : undefined,
             background: this.state.style.background.color,
             paddingLeft: this.calcPaddingLeft(),
             paddingRight: this.calcPaddingRight(),
             paddingTop: this.calcPaddingTop(),
             paddingBottom: this.calcPaddingBottom(),
             marginLeft: this.calcMarginLeft(),
             marginRight: this.calcMarginRight(),
             marginTop: this.calcMarginTop(),
             marginBottom: this.calcMarginBottom(),
             borderTopStyle: this.state.style.border.top.style,
             borderBottomStyle: this.state.style.border.bottom.style,
             borderLeftStyle: this.state.style.border.left.style,
             borderRightStyle: this.state.style.border.right.style,
             borderTopColor: this.state.style.border.top.color,
             borderBottomColor: this.state.style.border.bottom.color,
             borderLeftColor: this.state.style.border.left.color,
             borderRightColor: this.state.style.border.right.color,
             borderTopWidth: this.state.style.border.top.width + this.state.style.border.top.countingUnit,
             borderBottomWidth: this.state.style.border.bottom.width + this.state.style.border.bottom.countingUnit,
             borderLeftWidth: this.state.style.border.left.width + this.state.style.border.left.countingUnit,
             borderRightWidth: this.state.style.border.right.width + this.state.style.border.right.countingUnit,
             textAlign: this.state.style.text.align,
             color: this.state.style.text.color,
             letterSpacing: this.state.style.text.letterSpacing + this.state.style.text.letterSpacingCountingUnit,
             fontSize: this.state.style.text.size + this.state.style.text.sizeCountingUnit,
             verticalAlign: this.state.style.text.verticalAlign,
             cursor: this.state.style.cursor,
           }}
      >
        {this.state.text}
        {
          this.state.componentElements.map(function (v) {
            return v
          })
        }
      </div>
    );
  }
}
