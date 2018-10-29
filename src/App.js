import React from 'react';
import './App.css';

const oWords = shuffle(require("./words.json"));
const leftRight = ["left","right"];
let fallDistance = 20;

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

function randomLeft() {
  return randomIntFromInterval(40,50) + "%";
}
function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

class Block extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id:props.id,
      word:props.word.word,
      top:props.top,
      category:props.word.category,
      left:props.left,
    }
  }

  componentWillReceiveProps(nextProps){
      if(this.props !== nextProps) {
          this.setState({
              top:nextProps.top,
              selected:nextProps.selected,
          })
      }

  }

  createClassList = () => {
      let classes = "Block ";
      if(this.state.selected){
          classes += "shoot-off-" + leftRight[(this.state.id % 2)];
      }
      return classes;
  }



  top = () => {return ((this.state.top / 25) + 5).toString() + "%";}

  render() {
    return (
      <div className={this.createClassList()} style={{
          top:this.top(),
          left:this.state.left,
        }}>
        {this.state.word}
      </div>
    );
  }
}

class Screen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        timer: 0,
        fallenBlocks:this.props.fallenBlocks,
        fallingBlock:this.props.fallingBlock,
        words: this.props.words,
    }

  }
  componentWillReceiveProps(nextProps){
    if (nextProps!==this.props){
      this.setState({
        blocks:nextProps.blocks,
        fallingBlock:nextProps.fallingBlock,
        answeredBlocks:nextProps.answeredBlocks,
        fallenBlocks:nextProps.fallenBlocks,
      })
    }
  }

  createFallenBlocks = () => {
    const fallenBlocks = this.props.fallenBlocks;
    let resultsArray = [];
    fallenBlocks.forEach((b) => {
      const blockElement = (<Block
            key={b.key}
            top={b.top}
            word={b.word}
            selected={b.selected}
            id={b.key}
            left={b.left}
            />
        );
        resultsArray.unshift(blockElement);
    });
    return resultsArray;

  }
  createFallingBlock = () => {
    const fallingBlock = this.state.fallingBlock;

    const blockElement = (<Block
          key={fallingBlock.key}
          top={fallingBlock.top}
          word={this.state.words[fallingBlock.key]}
          selected={fallingBlock.selected}
          id={fallingBlock.key}
          left={fallingBlock.left}
          />
      );
    return blockElement;
  }

  render() {
    return (
      <div className="Screen">
        {this.createFallingBlock()}
        {this.createFallenBlocks()}
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
    this.props.choose(this.state.category);
  }

  render() {
    return (
      <div className= {"btn-holder " + this.state.side} >
        <div className={this.createClassList()}>
          <div className="btn-inner" onClick={this.onClick}></div>
        </div>
        <span className="btn-tag">{this.state.category}</span>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state ={
        answered:false,
        words:oWords,
        answeredBlocks:[],
        fallingBlock:
          {
              key:0,
              top:0,
              selected:false,
              word:oWords[0],
              left: randomLeft(),
          },
        fallenBlocks:[],
      //     blocks:[
      //       {
      //           key:0,
      //           top:0,
      //           selected:false,
      //           word:oWords[0],
      //
      //       }
      // ],
      bottom:1600,
    }
    this.startTimer = this.startTimer.bind(this);
      this.startTimer();
    }

/*  addBlock = (lastBlock) => {
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
      bottom: currentBottom - 20,
    });
  }*/

  choose = (cat) => {
    const currentBlock = this.state.fallingBlock;
    if (currentBlock.word.category === cat) {
        currentBlock.selected = true;
        this.setState({
            fallingBlock:currentBlock,
            answered:true,
        });
    }
  }
/*
  dropBlock = (block) => {
    const currentBottom = this.state.bottom;
    const blockTop = block.top;

    if (blockTop >= currentBottom) {
      this.addBlock(block);
      return block;
    }
    block.top += 10;
    return block;
  }

  setBlocks = () => {
      let blocks = this.state.blocks;
      if(this.state.answered){
          const lastBlock = blocks[blocks.length - 1];
          const newBlock = {
              key:lastBlock.key + 1,
              top:0,
              word:this.state.words[lastBlock.key + 1]
          }
          setTimeout(() => {
              if (blocks.length > 1){

                  blocks.pop();
                  blocks.push(newBlock);
              } else {
                  blocks = [newBlock];
              }
              this.setState({
                  blocks:blocks,
                  answered:false,
              })
              const newBlocks = [];
              for(let i = 0; i < blocks.length;i++) {
                  let newBlock = this.dropBlock(blocks[i]);
                  newBlocks.push(newBlock);
              }
          },100)
      } else {
          blocks = this.state.blocks;
          const newBlocks = [];
          for(let i = 0; i < blocks.length;i++) {
              let newBlock = this.dropBlock(blocks[i]);
              newBlocks.push(newBlock);
          }
          this.setState({blocks:newBlocks});
      }

  }*/
    dropBlock = (block) => {
        block.top += fallDistance;
        return block;
    }

    setBlocks = () => {
        let fallingBlock = this.state.fallingBlock;
        const newBlock = {
            key:fallingBlock.key + 1,
            top:0,
            selected:false,
            word:oWords[fallingBlock.key + 1],
            left: randomLeft(),
        }
        if (fallingBlock.top > this.state.bottom){
          const nextBottom = this.state.bottom - 136;
          let fallenBlocks = this.state.fallenBlocks
          fallenBlocks.push(fallingBlock);
          this.setState({
            fallingBlock:newBlock,
            fallenBlocks:fallenBlocks,
            bottom:nextBottom,
          });
          fallDistance++;
        }
        if(this.state.answered){
            setTimeout(() => {


                let answeredBlocks = this.state.answeredBlocks;
                answeredBlocks.push(fallingBlock);
                this.setState({
                    fallingBlock:newBlock,
                    answeredBlocks:answeredBlocks,
                    answered:false,
                });
            },100);



        } else {

        }
        fallingBlock = this.state.fallingBlock;
        fallingBlock = this.dropBlock(fallingBlock);
        this.setState({fallingBlock:fallingBlock});
    }

    // shootOff = (block) => {
    //   let counter = 0;
    //   while (counter > 10){
    //     block.
    //   }
    // }

    startTimer() {
        this.timer = setInterval(this.setBlocks, 50);
    }

    render() {
        return (
          <div className="Game">
          <header className="App-header">
            Countable/Uncountable
          </header>
          <Screen
            fallenBlocks={this.state.fallenBlocks}
            fallingBlock={this.state.fallingBlock}
            words={this.state.words}
            setBlocks={this.setBlocks}
             />
           <Button side="left" category="countable" choose={this.choose}  />
           <Button side="right" category="uncountable" choose={this.choose} />
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
