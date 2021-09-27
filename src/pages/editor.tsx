import EditorStyle from '../styles/editor.less';
import Aphrodite from "../../aphrodite/aphrodite";
import React from "react";
import {buildStandardStyle} from "../../aphrodite/style";
import AphroditeComponent from "../../aphrodite/component";
import EditorConfigPanel from "@/components/EditorConfigPanel";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHashtag, faSquare} from "@fortawesome/fontawesome-free-solid";
import {IconProp} from "@fortawesome/fontawesome-svg-core";



class EditorVariable<P, S> extends React.Component<P, S> {
  // 画布容器ID
  public static readonly CANVAS_CONTAINER_ID = "canvas-container"
  // 画布ID
  public static readonly CANVAS_ID = "aphrodite"

  public MOUSE_LOCATION_DOWN_LEFT_X: number = 0                     // 编辑器内鼠标按下的屏幕位置
  public MOUSE_LOCATION_DOWN_COMPONENT_X: number = 0                // 编辑器内鼠标按下时组件位置
  public MOUSE_LOCATION_DOWN_LEFT_Y: number = 0                     // 编辑器内鼠标按下的屏幕位置
  public MOUSE_LOCATION_DOWN_COMPONENT_Y: number = 0                // 编辑器内鼠标按下时组件位置
  public MOUSE_LOCATION_UP_LEFT_X: number = 0                       // 编辑器内鼠标抬起的屏幕位置
  public MOUSE_LOCATION_UP_LEFT_Y: number = 0                       // 编辑器内鼠标抬起的屏幕位置
  public MOUSE_LOCATION_X: number = 0                               // 编辑器内鼠标当前的屏幕位置
  public MOUSE_LOCATION_Y: number = 0                               // 编辑器内鼠标当前的屏幕位置
  public MOUSE_EVENT_DOWN_LEFT: boolean = false                     // 编辑器内鼠标左键是否按下
  public MOUSE_EVENT_UP_LEFT: boolean = false                       // 编辑器内鼠标左键是否放开

  // 编辑器内当前拥有焦点的组件
  public MOUSE_LOCATION_COMPONENT_FOCUS: AphroditeComponent | null = null
  // 编辑器内鼠标位置的组件
  public MOUSE_LOCATION_COMPONENT: AphroditeComponent | null = null
  // 组件悬停暗示持有HTML元素
  public MODE_COMPONENT_HOVER_HINT_ELEMENT: HTMLElement | null = null

  public MODE_RECTANGLE_CREATE_EDIT: boolean = false                // 当前是否为矩形创建编辑模式
  public MODE_RECTANGLE_CREATE_OPEN: boolean = false                // 当前矩形创建编辑模式是否开启
  public MODE_RECTANGLE_CREATE_FINISH: boolean = false              // 当前是否为矩形创建编辑完成模式

  public MODE_MOVE_MOUSE_DOWN_LOCK: boolean = false                 // 组件移动时第一次按下后确保穿透不会将焦点去除
}

class EditorEvent<P, S> extends EditorVariable<P, S> {
  public static readonly EVENT_MOUSE_DOWN_LEFT = "mousedown_0"
  public static readonly EVENT_MOUSE_UP_LEFT = "mouseup_0"
  public static readonly EVENT_MOUSE_MOVE = "mousemove_0"
  public static readonly EVENT_MOUSE_ENTER = "mouseenter_0"
  public static readonly EVENT_MOUSE_LEAVE = "mouseleave_0"
  public static readonly EVENT_MOUSE_CLICK = "click_0"

  constructor(props: P) {
    super(props);
    this.onMouseEvent = this.onMouseEvent.bind(this)
    this.onMouseDownLeft = this.onMouseDownLeft.bind(this)
    this.onMouseUpLeft = this.onMouseUpLeft.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  private eventKey = (e: React.MouseEvent<HTMLElement>): string => {
    return e.type + "_" + e.button
  }

  protected onMouseEvent(e: React.MouseEvent<HTMLElement>) {
    e.stopPropagation()

    switch (this.eventKey(e)) {
      case EditorEvent.EVENT_MOUSE_DOWN_LEFT: this.onMouseDownLeft(e); break;
      case EditorEvent.EVENT_MOUSE_UP_LEFT: this.onMouseUpLeft(e); break;
      case EditorEvent.EVENT_MOUSE_MOVE: this.onMouseMove(e); break;
      case EditorEvent.EVENT_MOUSE_ENTER: this.onMouseEnter(e); break;
      case EditorEvent.EVENT_MOUSE_LEAVE: this.onMouseLeave(e); break;
      case EditorEvent.EVENT_MOUSE_CLICK: this.onMouseClick(e); break;
      default:
        // console.log(e)
    }

  }

  protected onMouseClick(e: React.MouseEvent<HTMLElement>) {

  }

  protected onMouseDownLeft(e: React.MouseEvent<HTMLElement>) {
    this.MOUSE_LOCATION_DOWN_LEFT_X = e.clientX
    this.MOUSE_LOCATION_DOWN_LEFT_Y = e.clientY
    this.MOUSE_EVENT_DOWN_LEFT = true
    this.MOUSE_EVENT_UP_LEFT = false
    if (this.MOUSE_LOCATION_COMPONENT_FOCUS != null) {
      this.MOUSE_LOCATION_DOWN_COMPONENT_X = this.MOUSE_LOCATION_COMPONENT_FOCUS.state.style.location.x
      this.MOUSE_LOCATION_DOWN_COMPONENT_Y = this.MOUSE_LOCATION_COMPONENT_FOCUS.state.style.location.y
    }
  }

  protected onMouseUpLeft(e: React.MouseEvent<HTMLElement>) {
    this.MOUSE_LOCATION_UP_LEFT_X = e.clientX
    this.MOUSE_LOCATION_UP_LEFT_Y = e.clientY
    this.MOUSE_EVENT_DOWN_LEFT = false
    this.MOUSE_EVENT_UP_LEFT = true
  }

  protected onMouseMove(e: React.MouseEvent<HTMLElement>) {
    this.MOUSE_LOCATION_X = e.clientX
    this.MOUSE_LOCATION_Y = e.clientY
  }

  protected onMouseEnter(e: React.MouseEvent<HTMLElement>) {
    this.onMouseUpLeft(e)
  }

  protected onMouseLeave(e: React.MouseEvent<HTMLElement>) {
    this.onMouseUpLeft(e)
  }
}

interface EditorPageStatus {

}

export default class EditorPage extends EditorEvent<any, EditorPageStatus> {
  // 画板组件
  private canvas: AphroditeComponent = new AphroditeComponent({from: "aphrodite"})
  // 设置面板
  private editorConfigPanel: EditorConfigPanel = new EditorConfigPanel({})
  // 矩形创建模式框选元素
  private rectangleCreateElement: HTMLElement = document.createElement("div")
  // Aphrodite实例（将在Aphrodite.run执行后得到）
  private aphrodite: Aphrodite = new Aphrodite({})
  // AphroditeJSX元素对象（渲染该对象即可）
  private aphroditeJSXElement = Aphrodite.run((aph: Aphrodite) => {
    this.aphrodite = aph
  }, canvas => {
    this.canvas = canvas
  }, function () {
    let style = buildStandardStyle()
    style.size.width = 100
    style.size.widthCountingUnit = "%"
    style.size.height = 100
    style.size.heightCountingUnit = "%"
    style.background.color = "#699BF7"
    return style
  })

  // 构造函数
  constructor(props: any) {
    super(props);
  }

  protected onMouseDownLeft(e: React.MouseEvent<HTMLElement>) {
    super.onMouseDownLeft(e);
    this.startRectangleCreatePreview()

    if (!this.MODE_MOVE_MOUSE_DOWN_LOCK) {
      this.MOUSE_LOCATION_COMPONENT_FOCUS = null
      this.editorConfigPanel.switchTab(3)
      this.clearFocusHint()
    }

    this.MODE_MOVE_MOUSE_DOWN_LOCK = false
  }

  protected onMouseMove(e: React.MouseEvent<HTMLElement>) {
    super.onMouseMove(e);

    this.drawRectangleCreatePreview()
    this.resizeCursorDraw(e.clientX, e.clientY)

    // 组件移动
    if (this.MOUSE_LOCATION_COMPONENT_FOCUS != null && this.MOUSE_EVENT_DOWN_LEFT && !this.MODE_RECTANGLE_CREATE_OPEN) {
      const nowComponentEl = document.getElementById(this.MOUSE_LOCATION_COMPONENT_FOCUS.id)
      if (nowComponentEl != null) {
        nowComponentEl.style.cursor = "move"
        let offsetLeft = this.MOUSE_LOCATION_DOWN_LEFT_X - this.MOUSE_LOCATION_DOWN_COMPONENT_X
        let offsetTop = this.MOUSE_LOCATION_DOWN_LEFT_Y - this.MOUSE_LOCATION_DOWN_COMPONENT_Y
        this.MOUSE_LOCATION_COMPONENT_FOCUS.setStyle(((style, update) => {
          style.location.x = e.clientX - offsetLeft
          style.location.y = e.clientY - offsetTop
          update(style)
        }))
      }
    }

  }

  protected onMouseUpLeft(e: React.MouseEvent<HTMLElement>) {
    super.onMouseUpLeft(e);
    this.MODE_RECTANGLE_CREATE_FINISH = true
    this.drawRectangleCreatePreview((x, y, width, height) => {
      // 生成组件，并进行初始化
      this.aphrodite.createComponent(this.canvas, (ac) => {
        this.MOUSE_LOCATION_COMPONENT_FOCUS = ac
        let style = buildStandardStyle()
        style.size.width = width
        style.size.height = height
        style.location.x = x
        style.location.y = y
        style.zIndex = 9999
        ac.setStyle(style)

        ac.state.events.onClick.push((e, ac) => {
          return false
        })

        ac.state.events.onMouseDown.push((e, ac) => {
          this.MOUSE_LOCATION_COMPONENT_FOCUS = ac

          this.addFocusHint(e.currentTarget, ac, false)

          return false
        })

        ac.state.events.onMouseUp.push((e, ac) => {
          e.currentTarget.style.cursor = "default"
          return false
        })

        ac.state.events.onMouseEnter.push((e, ac) => {
          this.MOUSE_LOCATION_COMPONENT = ac
          return false
        })

        ac.state.events.onMouseLeave.push((e, ac) => {
          this.MOUSE_LOCATION_COMPONENT = null
          e.currentTarget.style.cursor = "default"

          return false
        })

        const el = document.getElementById(ac.id)
        if (el != null) this.addFocusHint(el, ac, true)
      })
    })
  }

  // 添加组件激活焦点暗示
  addFocusHint = (e: HTMLElement, ac: AphroditeComponent, clearFocusLock: boolean) => {
    this.editorConfigPanel.setAphroditeComponent(ac)
    this.editorConfigPanel.switchTab(0)
    this.MODE_MOVE_MOUSE_DOWN_LOCK = !clearFocusLock
    if (this.MODE_COMPONENT_HOVER_HINT_ELEMENT != null) {
      this.MODE_COMPONENT_HOVER_HINT_ELEMENT.className = this.MODE_COMPONENT_HOVER_HINT_ELEMENT.className.replaceAll(" " + EditorStyle.componentHoverHint, "")
    }
    this.MODE_COMPONENT_HOVER_HINT_ELEMENT = e
    this.MODE_COMPONENT_HOVER_HINT_ELEMENT.className = this.MODE_COMPONENT_HOVER_HINT_ELEMENT.className + " " + EditorStyle.componentHoverHint
  }

  // 清空组件激活焦点暗示
  clearFocusHint = () => {
    if (this.MODE_COMPONENT_HOVER_HINT_ELEMENT != null) {
      this.MODE_COMPONENT_HOVER_HINT_ELEMENT.className = this.MODE_COMPONENT_HOVER_HINT_ELEMENT.className.replaceAll(" " + EditorStyle.componentHoverHint, "")
    }
  }

  // 组件缩放光标渲染
  resizeCursorDraw = (x: number, y: number) => {
    if (this.MOUSE_LOCATION_COMPONENT == null) return
    const eac = this.MOUSE_LOCATION_COMPONENT
    const ace = document.getElementById(this.MOUSE_LOCATION_COMPONENT.id)
    let acLeft = eac.state.style.location.x
    let acRight = eac.state.style.location.x + eac.state.style.size.width
    let acTop = eac.state.style.location.y
    let acBottom = eac.state.style.location.y + eac.state.style.size.height

    if (ace != null) {
      if (x > acLeft && x - acLeft <= 5 && x - acLeft >= 0) {
        ace.style.cursor = "col-resize"
      }else if (y > acTop && y - acTop <= 5 && y - acTop >= 0) {
        ace.style.cursor = "row-resize"
      }else if (x < acRight && acRight - x <= 5 && acRight - x >= 0) {
        ace.style.cursor = "col-resize"
      }else if (y < acBottom && acBottom - y <= 5 && acBottom - y >= 0) {
        ace.style.cursor = "row-resize"
      }else ace.style.cursor = "default"
    }

  }

  // 开始矩形创建预览
  startRectangleCreatePreview = () => {
    if (this.MODE_RECTANGLE_CREATE_OPEN) {
      this.MODE_RECTANGLE_CREATE_EDIT = true
      this.MODE_RECTANGLE_CREATE_FINISH = false

      this.rectangleCreateElement.style.height = "0px"
      this.rectangleCreateElement.style.width = "0px"
    }
  }

  // 绘制矩形创建预览，在模式切换为完成的时候将把产生的位置尺寸参数传入回调函数
  drawRectangleCreatePreview = (finishCallback?: (x: number, y: number, width: number, height: number) => void) => {
    if (this.MODE_RECTANGLE_CREATE_EDIT && this.MODE_RECTANGLE_CREATE_OPEN) {

      let width = this.MOUSE_LOCATION_X - this.MOUSE_LOCATION_DOWN_LEFT_X
      let height = this.MOUSE_LOCATION_Y - this.MOUSE_LOCATION_DOWN_LEFT_Y

      if (!this.MODE_RECTANGLE_CREATE_FINISH) {
        this.rectangleCreateElement.style.display = this.MODE_RECTANGLE_CREATE_EDIT ? "" : "none"
        this.rectangleCreateElement.style.top = this.MODE_RECTANGLE_CREATE_EDIT ? this.MOUSE_LOCATION_DOWN_LEFT_Y + "px" : ""
        this.rectangleCreateElement.style.left = this.MODE_RECTANGLE_CREATE_EDIT ? this.MOUSE_LOCATION_DOWN_LEFT_X + "px" : ""

        if (width < 0) {
          this.rectangleCreateElement.style.left = this.MOUSE_LOCATION_X + "px"
          this.rectangleCreateElement.style.width = this.MOUSE_LOCATION_DOWN_LEFT_X - this.MOUSE_LOCATION_X + "px"
        }else {
          this.rectangleCreateElement.style.left = this.MOUSE_LOCATION_DOWN_LEFT_X + "px"
          this.rectangleCreateElement.style.width = width + "px"
        }
        if (height < 0) {
          this.rectangleCreateElement.style.top = this.MOUSE_LOCATION_Y + "px"
          this.rectangleCreateElement.style.height = this.MOUSE_LOCATION_DOWN_LEFT_Y - this.MOUSE_LOCATION_Y + "px"
        }else {
          this.rectangleCreateElement.style.top = this.MOUSE_LOCATION_DOWN_LEFT_Y + "px"
          this.rectangleCreateElement.style.height = height + "px"
        }

      }else {

        { // 重置绘制状态
          this.MODE_RECTANGLE_CREATE_FINISH = false
          this.MODE_RECTANGLE_CREATE_EDIT = false
          this.MODE_RECTANGLE_CREATE_OPEN = false

          this.rectangleCreateElement.style.height = "0px"
          this.rectangleCreateElement.style.width = "0px"
          this.canvas.setStyle(((style, update) => {
            style.cursor = "default"
            update(style)
          }))
        }

        let x: number, y: number, w: number, h: number
        if (width < 0) {
          x = this.MOUSE_LOCATION_X - this.canvas.state.style.margin.left
          w = this.MOUSE_LOCATION_DOWN_LEFT_X - this.MOUSE_LOCATION_X
        }else {
          x = this.MOUSE_LOCATION_DOWN_LEFT_X - this.canvas.state.style.margin.left
          w = width
        }
        if (height < 0) {
          y = this.MOUSE_LOCATION_Y - this.canvas.state.style.margin.top
          h = this.MOUSE_LOCATION_DOWN_LEFT_Y - this.MOUSE_LOCATION_Y
        }else {
          y = this.MOUSE_LOCATION_DOWN_LEFT_Y - this.canvas.state.style.margin.top
          h = height
        }
        if (finishCallback != undefined) finishCallback(x, y, w, h)
      }
    }

  }

  render() {
    return (
      <div className={EditorStyle.editor} >

        {/* 画布 */}
        <div id={EditorVariable.CANVAS_CONTAINER_ID}
             onMouseDown={this.onMouseEvent}
             onMouseMove={this.onMouseEvent}
             onMouseUp={this.onMouseEvent}
             onMouseLeave={this.onMouseEvent}
             onMouseEnter={this.onMouseEvent}
             onClick={this.onMouseEvent}
        >
          {this.aphroditeJSXElement}
          <div className={EditorStyle.editorCanvasRectangleEditor} ref={(e) => {
            if (e != null) this.rectangleCreateElement = e
          }}>
          </div>
        </div>

        {/* 顶部栏目 */}
        <div className={EditorStyle.editorTopBar}>
          <ul className={EditorStyle.editorTopBarList}>
            <li className={EditorStyle.editorTopBarListItem} onClick={() => {
              this.MODE_RECTANGLE_CREATE_OPEN = !this.MODE_RECTANGLE_CREATE_OPEN
              this.canvas.setStyle(((style, update) => {
                style.cursor = style.cursor == "crosshair" ? "default" : "crosshair"
                update(style)
              }))

            }}>
              <FontAwesomeIcon icon={faSquare as IconProp}/>
            </li>
            <li className={EditorStyle.editorTopBarListItem}>
              <FontAwesomeIcon icon={faHashtag as IconProp}/>
            </li>
          </ul>
        </div>

        {/* 预览菜单 */}
        <div className={EditorStyle.editorLeftBar}>

        </div>

        {/* 配置面板 */}
        <EditorConfigPanel aphrodite={this.aphrodite} ref={(e) => {
          if (e != null) this.editorConfigPanel = e
        }} />

      </div>
    )
  }
}
