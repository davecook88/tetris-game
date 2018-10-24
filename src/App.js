import React from 'react';
import './App.css';

const oWords = shuffle(require("./words.json"));

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

class Block extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      word:"apple",
      top:this.props.top,
    }
  }

  componentWillReceiveProps(nextProps){
      this.setState({top:nextProps.top })
  }

  top = () => {return this.state.top.toString() + "em";}

  render() {
    return (
      <div className="Block" style={{top:this.top()}}>
        {this.props.word}
      </div>
    );
  }
}

class Screen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bottom:25,
      timer: 0,
      blocks:[
        {
          key:0,
          top:0,
        }
      ],
      words: this.props.words,
      wordIndex: 0,
    }
    this.startTimer = this.startTimer.bind(this);
    this.startTimer();
  }
  addBlock = (lastBlock) => {
    const currentBottom = this.state.bottom;
    if (lastBlock.top > currentBottom) return;
    const newBlock = {
      key:lastBlock.key + 1,
      top:0,
    }
    const blockList = this.state.blocks;
    blockList.push(newBlock);
    this.setState({
      blocks:blockList,
      bottom: currentBottom - 2,
      wordIndex:this.state.wordIndex + 1,
    });
  }

  createBlocks = () => {
    let resultArray = [];
    const blocks = this.state.blocks;
    for(let i in blocks) {
      let currentBlock = blocks[i];
      resultArray.push(
        <Block
          key={currentBlock.key}
          top={currentBlock.top}
          word={this.setWord().word}
          />
      );
    }

    return resultArray;
  }


  dropBlock = (block) => {
    const currentBottom = this.state.bottom;
    const blockTop = block.top;
    console.log(blockTop);
    if (blockTop >= currentBottom) {
      this.addBlock(block);
      return block;
    }
    block.top ++
    return block;
  }

  setBlocks = () => {
    const newTimer = this.state.timer + 1;
    this.setState({timer:newTimer});
    const blocks = this.state.blocks;
    const newBlocks = [];
    for(let i = 0; i < blocks.length;i++) {
      let newBlock = this.dropBlock(blocks[i]);

      newBlocks.push(newBlock);
    }
    this.setState({blocks:newBlocks});
  }

  setWord = () => {
    const wordIndex = this.state.wordIndex;
    const word = this.state.words[wordIndex];
    return word;
  }

  startTimer() {
    this.timer = setInterval(this.setBlocks, 100);
  }
  render() {
    return (
      <div className="Screen">
        {this.createBlocks()}
      </div>
    );
  }
}

class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      side:props.side,
    }
  }
  createClassList = () => {
    return `Button ${this.state.side}`
  }

  push = () => {
    //write method
  }
  render() {
    return (
      <div className={this.createClassList()}>
        <div className="btn-inner"></div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      words:oWords,
    }
  }
  render() {
    return (
      <div className="Game">
      <header className="App-header">
        Countable/Uncountable
      </header>
      <Screen
        words={this.state.words}
         />
      <Button side="left" /><Button side="right" />
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">

        <Game />
      </div>
    );
  }
}

export default App;
