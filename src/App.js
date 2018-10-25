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
      word:props.word.word,
      top:props.top,
      category:props.word.category,
    }
  }

  componentWillReceiveProps(nextProps){
      this.setState({top:nextProps.top })
  }

  top = () => {return this.state.top.toString() + "em";}

  render() {
    return (
      <div className="Block" style={{top:this.top()}}>
        {this.state.word}
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
      blocks:this.props.blocks,
      words: this.props.words,
    }

  }
  componentWillReceiveProps(nextProps){
    if (nextProps!=this.props){
      this.setState({blocks:nextProps.blocks})
    }
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
          word={this.state.words[currentBlock.key]}
          />
      );
    }
    return resultArray;
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
      category:props.category,
    }
  }
  createClassList = () => {
    return `Button ${this.state.side}`
  }

  onClick = () => {
    console.log(this.props.press(this.state.category));
  }
  render() {
    return (
      <div className={this.createClassList()}>
        <div className="btn-inner" onClick={this.onClick}>{this.state.category}</div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state ={
      words:oWords,
      blocks:[
        {
          key:0,
          top:0,
          word:oWords[0],
        }
      ],
      bottom:25,
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
      word:this.state.words[lastBlock.key + 1]
    }
    const blockList = this.state.blocks;
    blockList.push(newBlock);
    this.setState({
      blocks:blockList,
      bottom: currentBottom - 2,
    });
  }

  choose = (cat) => {
    const currentBlock = this.state.blocks[this.state.blocks.length - 1];
    if (currentBlock.word.category === cat) return true;
    return false;
  }

  dropBlock = (block) => {
    const currentBottom = this.state.bottom;
    const blockTop = block.top;
    if (blockTop >= currentBottom) {
      this.addBlock(block);
      return block;
    }
    block.top ++
    return block;
  }

  setBlocks = () => {
    const blocks = this.state.blocks;
    const newBlocks = [];
    for(let i = 0; i < blocks.length;i++) {
      let newBlock = this.dropBlock(blocks[i]);
      newBlocks.push(newBlock);
    }
    this.setState({blocks:newBlocks});
  }

  startTimer() {
    this.timer = setInterval(this.setBlocks, 500);
  }

  render() {
    return (
      <div className="Game">
      <header className="App-header">
        Countable/Uncountable
      </header>
      <Screen
        blocks={this.state.blocks}
        words={this.state.words}
        setBlocks={this.setBlocks}
         />
       <Button side="left" category="countable" press={this.choose}  />
       <Button side="right" category="uncountable" press={this.choose} />
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
