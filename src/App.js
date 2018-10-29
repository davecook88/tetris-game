import React from 'react';
import './App.css';

const oWords = shuffle(require("./words.json"));
let speed = 500;
const fallDistance = 1;

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
            id:props.id,
            word:props.word.word,
            top:props.top,
            category:props.word.category,
            answeredWrong:props.answeredWrong,
            answeredCorrectly:props.answeredCorrectly,
        }
    }

    componentWillReceiveProps(nextProps){
        if(this.props !== nextProps) {
            this.setState({
                top:nextProps.top,
                selected:nextProps.selected,
                left:nextProps.left,
                right:nextProps.right,
                answeredWrong:nextProps.answeredWrong,
                answeredCorrectly:nextProps.answeredCorrectly,
            })
        }

    }

    createClassList = () => {
        let classes = "Block ";
        if (this.state.answeredWrong){
            classes += "wrong ";
        }
        if (this.state.answeredCorrectly){
            let direction = (this.state.category == "countable" ? "left" : "right");
            classes += "answered-correctly-" + direction;
        }
        return classes;
    }



    top = () => {return ((this.state.top - 10) * 5).toString() + "%";}

    render() {
        return (
            <div className={this.createClassList()} style={{
                top:this.top(),
                left:this.state.left,
                right:this.state.right,
            }}>
                {this.state.word}
            </div>
        );
    }
}

class Stats extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        answeredCorrectly:props.answeredCorrectly,
        answeredWrong:props.answeredWrong,
      }
  }
  componentWillReceiveProps(nextProps){
      if(this.props !== nextProps) {
          this.setState({
              answeredWrong:nextProps.answeredWrong,
              answeredCorrectly:nextProps.answeredCorrectly,
          })
      }

  }

  render() {
    return (
      <div className="stats">
        <div className="half-width">
          <span className="stats-text">Answered correctly:</span>
          <span className="stats-text">Answered wrong:</span>
          <span className="stats-text">Level:</span>
        </div>
        <div className="half-width">
          <span className="stats-text digit">{this.state.answeredCorrectly}</span>
          <span className="stats-text digit">{this.state.answeredWrong}</span>
          <span className="stats-text digit">{this.state.answeredCorrectly}</span>
        </div>
      </div>
    )
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
    answeredCorrectly = () => {
      if(!this.state.answeredBlocks){
        return 0;
      }
      return this.state.answeredBlocks.length;
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
                    answeredWrong={b.answeredWrong}
                />
            );
            resultsArray.push(blockElement);
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
                right={fallingBlock.right}
                answeredWrong={fallingBlock.answeredWrong}
                answeredCorrectly={fallingBlock.answeredCorrectly}
            />
        );
        return blockElement;
    }

    render() {
        return (
            <div className="Screen">
              <div className="block-screen">
                {this.createFallenBlocks()}
                {this.createFallingBlock()}
              </div>
              <Stats
                answeredWrong={this.state.fallenBlocks.length}
                answeredCorrectly={this.answeredCorrectly()}
                level={Math.floor(this.state.fallingBlock.id / 10) + 1}
                />
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

class FunctionButton extends React.Component {
}

class PauseButton extends FunctionButton {
    onClick = () => {
        this.props.stopTimer();
    }
    render() {
        return (
            <div className={"btn-holder function-button pause"}>
                <div className={"function-button pause"} onClick={this.onClick}>
                </div>
                <span className="btn-tag func">Pause</span>
            </div>
        );
    }
}
class StartButton extends FunctionButton{
    onClick = () => {
        this.props.startTimer();
    }
    render() {
        return (
            <div className={"btn-holder function-button start"}>
                <div className={"function-button start"} onClick={this.onClick}>
                </div>
                <span className="btn-tag func">Start</span>
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
                    left:0,
                    right:0,
                    top:10,
                    selected:false,
                    word:oWords[0],
                    answeredWrong:false,
                    answeredCorrectly:false,
                },
            fallenBlocks:[],
            bottom:27,
            timer:true,
        }
        this.startTimer = this.startTimer.bind(this);
        this.startTimer();
    }


    choose = (cat) => {
        let currentBlock = this.state.fallingBlock;
        if (currentBlock.answeredWrong) return;
        console.log(cat);
        if (currentBlock.word.category === cat) {
            this.stopTimer();
            currentBlock.answeredCorrectly = true;
            this.setState({
                fallingBlock:currentBlock,
            });
            setTimeout(()=>{
                currentBlock.selected = true;
                this.setState({
                    fallingBlock:currentBlock,
                    answered:true,
                });
                this.startTimer();
            },300)


        } else {
            currentBlock.answeredWrong = true;
            this.setState({
                fallingBlock:currentBlock,
            });
        }
    }

    dropBlock = (block) => {
        block.top += fallDistance;
        return block;
    }

    lose = () => {
        this.stopTimer();
        alert("You lose!");
    }

    setBlocks = () => {

        let fallingBlock = this.state.fallingBlock;
        const newBlock = {
            key:fallingBlock.key + 1,
            top:10 - Math.floor(-(this.state.bottom - 25)/1.5),
            selected:false,
            word:oWords[fallingBlock.key + 1],
            right:0,
            left:0,
        };
        const bottom = this.state.bottom;
        if (fallingBlock.top > bottom){
            let nextBottom;

            if(this.state.fallenBlocks.length % 3 === 2 && this.state.fallenBlocks.length > 0){
                nextBottom = this.state.bottom - 3  ;
            } else {
                nextBottom = this.state.bottom;
            }

            let fallenBlocks = this.state.fallenBlocks;
            fallenBlocks.push(fallingBlock);
            this.setState({
                fallingBlock:newBlock,
                fallenBlocks:fallenBlocks,
                bottom:nextBottom,
            });
            speed -= 10;
            if (this.state.bottom < 1) {
                this.lose();
            }
        }
        if(this.state.answered){
          let answeredBlocks = this.state.answeredBlocks;
          answeredBlocks.push(fallingBlock);
            setTimeout(() => {
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

    startTimer = () => {
        this.setState({timer:true});
        this.timer = setInterval(this.setBlocks, speed);
    }
    stopTimer = () => {
        this.setState({timer:false});
        clearInterval(this.timer);
    }

    render() {
        return (
            <div className="Game">
                <header className="App-header">
                    Countable/Uncountable
                </header>
                <Screen
                    answeredBlocks={this.state.answeredBlocks}
                    fallenBlocks={this.state.fallenBlocks}
                    fallingBlock={this.state.fallingBlock}
                    words={this.state.words}
                    setBlocks={this.setBlocks}
                />
                <Button side="left" category="countable" choose={this.choose}  />
                <PauseButton stopTimer={this.stopTimer}/>
                <StartButton startTimer={this.startTimer}/>
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
