import Style from './EditorConfigPanel.less';
import CommonStyle from '../styles/common.less';
import React from "react";
import classNames from "classnames";
import Aphrodite from "../../aphrodite/aphrodite";
import AphroditeComponent from "../../aphrodite/component";

interface TabProps {
  name: string,
  index: number,
  focus: number,
  switchTab: (index: number) => void
}

class Tab extends React.Component<TabProps, any> {

  constructor(props: TabProps) {
    super(props);
  }

  render() {
    return (
      <li key={this.props.index} className={
        this.props.focus == this.props.index
          ? classNames(Style.editorConfigPanelTabItem, Style.editorConfigPanelTabItemFocus)
          : Style.editorConfigPanelTabItem
      } onClick={(e) => {
        e.stopPropagation()
        this.props.switchTab(this.props.index)}
      }>
        {this.props.name}
        <div className={classNames(Style.editorConfigPanelTabPanel, CommonStyle.scrollBar)} style={{
          display: this.props.index == this.props.focus ? undefined : "none"
        }}>
          {this.props.children}
        </div>
      </li>
    );
  }
}

interface EditorConfigPanelProps {
  aphrodite: Aphrodite
}

interface EditorConfigPanelState {
  focus: number
  backgroundColor: string
}

export default class EditorConfigPanel extends React.Component<EditorConfigPanelProps, EditorConfigPanelState> {
  private ac: AphroditeComponent = new AphroditeComponent({})

  constructor(props: EditorConfigPanelProps | any) {
    super(props);
    this.state = {
      focus: 3,
      backgroundColor: ""
    }
  }

  switchTab = (index: number) => {
    this.setState({
      focus: index
    })
  }

  setAphroditeComponent = (ac: AphroditeComponent) => {
    this.setState({
      backgroundColor: ac.state.style.background.color,
    })
    this.ac = ac
  }

  render() {
    return (
      <div className={Style.editorConfigPanel}>
        <ul className={Style.editorConfigPanelTab}>
          <Tab name={"样式"} index={0} focus={this.state.focus} switchTab={this.switchTab}>
            <p className={Style.editorConfigPanelTabTitle}>背景</p>
            <div className={Style.backgroundSelect}>
              <div className={Style.colorCard} style={{backgroundColor: this.state.backgroundColor}}/>
              <input type={"text"} className={Style.colorInput} placeholder={"#FFFFFF"} value={this.state.backgroundColor} onChange={(e) => {
                this.ac.setStyle(((style, update) => {
                  style.background.color = e.target.value
                  update(style)
                }))
                this.setState({
                  backgroundColor: e.target.value
                })
              }}/>
              <input type={"text"} className={Style.colorInputTransparent} placeholder={"100%"}/>
            </div>
          </Tab>
          <Tab name={"效果"} index={1} focus={this.state.focus} switchTab={this.switchTab}>

          </Tab>
          <Tab name={"事件"} index={2} focus={this.state.focus} switchTab={this.switchTab}>

          </Tab>
          {/* 无焦点页面 */}
          <Tab name={""} index={3} focus={this.state.focus} switchTab={this.switchTab}>

          </Tab>
        </ul>
      </div>
    );
  }
}
