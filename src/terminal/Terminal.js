import React, { Component } from 'react'
import './terminal.css'

class Terminal extends Component {
  state = {
    dragging: false,
    top: 0,
    left: 0,
    command: '',
    terminalText: '',
    cursor: true
  }

  prompt = '$> '
  terminal = React.createRef()
  terminalBody = React.createRef()
  cursor = React.createRef()

  close = () => {

  }

  toggleWidth = () => {

  }

  blinkCursor = () => this.setState({
    cursor: !this.state.cursor,
    timeout: setTimeout(this.blinkCursor, 400)
  })

  stopCursor = () => {
    clearTimeout(this.state.timeout)

    this.setState({
      timeout: null,
      cursor: true
    })
  }

  startDrag = ({ clientX, clientY }) => this.setState({
    dragging: true,
    startX: clientX,
    startY: clientY
  })

  drag = ({ clientX, clientY }) => {
    const { top, left, startX, startY, dragging } = this.state

    if (!dragging) return

    this.setState({
      top: top + clientY - startY,
      left: left + clientX - startX,
      startX: clientX,
      startY: clientY
    })
  }

  endDrag = () => this.setState({ dragging: false })

  handleInput = ({ key }) => {
    let ignoreKeys = [
      'Meta',
      'Alt',
      'Shift',
      'Control',
      'Escape',
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight'
    ]

    if (key == 'Backspace') {
      this.setState({ command: this.state.command.slice(0, -1) })
    } else if (key == 'Enter') {
      this.handleCommand(this.state.command)
      this.setState({ command: '' })
    } else if (ignoreKeys.includes(key)) {
      return
    } else {
      this.setState({ command: this.state.command + key })
    }
  }

  handleCommand = command => {
    let output

    switch(command) {
      case 'about':
        output = `
I'm a software engineer based in New York City with a passion for technology. I
work mainly in the web development industry, though I have worked in distributed
systems / blockchain as well. My current favorite language is Elixir as it
offers a functional programming paradigm with a syntax which resembles Ruby, and
makes concurrent programming easy.

GitHub: https://github.com/alexdovzhanyn
Twitter: https://twitter.com/alexdovzhanyn`
        break
      case 'skills':
        output = `
LANGUAGES        FRAMEWORKS        DATABASE        OTHER

Elixir           React             Postres         Wordpress
Ruby             Rails             MySQL           AWS
Python           Sinatra           MongoDB         Heroku
PHP              Sass              LevelDB         Git
Javascript       Phoenix
`
        break
      case 'projects':
        output = `
elixium    seven_deadly_sins    zephyre    devrant_gem    essence
pico    alchemy_vm
`
        break
      default:
        output = `Command '${command}' not recognized.`
    }

    this.write(`\n${this.prompt}${command}\n${output}`)
  }

  write = text => {
    this.setState({ terminalText: this.state.terminalText + text + '\n'})
    this.terminalBody.current.scrollTop = this.terminalBody.current.scrollHeight
  }

  componentDidMount() {
    this.terminal.current.focus()
    this.write(`
Welcome to my website. Type one of the following commands to explore:

COMMAND         DESCRIPTION

about           outputs a short blurb about me
projects        projects that I have worked on
project <name>  shows details about a specific project
skills          lists languages and skills that I have learned
    `)
  }

  render() {
    return (
      <div
        className="terminal"
        ref={ this.terminal }
        onKeyDown={ this.handleInput }
        onFocus={ this.blinkCursor }
        onBlur={ this.stopCursor }
        tabIndex="0"
        style={{
          top: this.state.top,
          left: this.state.left
      }}>
        <div
          className="toolbar"
          onMouseDown={ this.startDrag }
          onMouseMove={ this.drag }
          onMouseUp={ this.endDrag }
          style={{
            cursor: this.state.dragging ? 'grabbing' : 'grab',
        }}>
          <div className="buttonContainer">
            <button onClick={ this.close } className="close"/>
            <button onClick={ this.toggleWidth } className="toggle"/>
          </div>

          <p>./alexdovzhanyn.sh</p>
        </div>
        <div className="body" ref={ this.terminalBody }>
          <pre>{ this.state.terminalText }</pre>
          <p className="prompt">
            { this.prompt }
            { this.state.command }
            <span
              className="cursor"
              ref={ this.cursor }
              style={{ display: this.state.cursor ? 'inline-block' : 'none' }}
            />
          </p>
        </div>
      </div>
    )
  }
}

export default Terminal
