import StandardStyle from './core/styles/standard.less'
import React from "react";
import AphroditeComponent from "./component";
import AphroditeComponentStyle, {buildStandardStyle} from "./style";
import {Property} from "csstype";

interface AphroditeStatus {
  componentElements: Array<JSX.Element>
}

function newAphroditeStatus(): AphroditeStatus {
  return {
    componentElements: new Array<JSX.Element>(),

  }
}

export default class Aphrodite extends React.Component<any, AphroditeStatus> {
  // HTML元素
  private element: HTMLElement = document.createElement("div")
  // 子组件渲染完毕后将注册到该数组
  private components: Array<AphroditeComponent> = new Array<AphroditeComponent>()
  // 所有通过该Aphrodite创建的组件
  private componentsMap: Map<string, AphroditeComponent> = new Map<string, AphroditeComponent>()
  // 工作画布样式
  private style: AphroditeComponentStyle = buildStandardStyle()

  constructor(props: any) {
    super(props);
    this.state = newAphroditeStatus()
  }

  // 获取整块区域宽度
  getWidth = (): number => {
    return window.document.body.clientWidth
  }

  // 获取整块区域高度
  getHeight = (): number => {
    return window.document.body.clientHeight
  }

  // 获取一个组件
  getComponent = (key: string | HTMLElement): AphroditeComponent | undefined => {
    if (typeof key == "string") {
      return this.componentsMap.get(key)
    }else {
      return this.componentsMap.get(key.id)
    }
  }

  // 创建一个组件，并且指定领导者为谁
  createComponent = (leader: "aphrodite" | AphroditeComponent, callback: (ac: AphroditeComponent) => void) => {
    if (leader == "aphrodite") {
      const ces = this.state.componentElements;
      ces.push(
        <AphroditeComponent key={Math.random()} from={"aphrodite"} ref={
          (c) => {
            if (c != null) {
              c.init(this)
              this.components.push(c)
              this.componentsMap.set(c.id, c)
              callback(c)
            }
          }
        }/>
      )
      this.setState({
        componentElements: ces
      })
    }else {
      leader.createComponent(this.componentsMap, callback)
    }
  }

  // TODO: 性能优化
  onResize = () => {
    this.components.map(function (v) {
      v.refresh()
    })
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  static run(getAphrodite: (aph: Aphrodite) => void,
             getCanvas: (canvas: AphroditeComponent) => void,
             style?: () => AphroditeComponentStyle): JSX.Element {
    document.head.innerHTML = document.head.innerHTML + "<styles> *, *::before, *::after {box-sizing: content-box !important;} *, *::before, *::after {box-sizing: content-box !important;} </styles>"

    return <Aphrodite ref={
      (aphrodite) => {
        if (aphrodite != null) {
          if (style != undefined) aphrodite.style = style()
          getAphrodite(aphrodite)
          aphrodite.view(getCanvas)
        }
      }
    }/>
  }

  view = (getCanvas: (ac: AphroditeComponent) => void) => {
    this.createComponent("aphrodite", (ac) => {
      ac.setStyle(this.style)
      getCanvas(ac)
    })
  }

  render() {
    return (
      <div id={"aphrodite"} className={StandardStyle.aphrodite} ref={
        (element) => {
          if (element != null) {
            this.element = element
          }
        }
      }>
        {
          this.state.componentElements.map(function (v) {
            return v
          })
        }
      </div>
    );
  }
}
