class Block extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      top:props.top,
      word:props.word.word,
      category:props.word.category
    }
  }

  componentWillReceiveProps(nextProps){
    console.lop(nextProps);
    if(this.props != nextProps){
      this.setState({top:nextProps.top });
    }
  }

  top = () => {
    return this.state.top.toString() + "em";
  }

  render() {
    return (
      <div className="Block" style={{top:this.top()}}>
        {this.state.word}
        {this.state.top}
        {this.state.category}
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
      fallingBlock:{
        key:0,
        top:0,
        word:props.words[0],
      },
      fallenBlocks: [],
      blocks:[
        {
          key:0,
          top:0,
        }
      ],
      words: this.props.words,
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
      word:this.state.words[lastBlock.key + 1],
    }
    const blockList = this.state.fallenBlocks;
    blockList.push(lastBlock);
    this.setState({
      fallingBlock:newBlock,
      fallenBlocks:blockList,
      bottom: currentBottom - 2,
    });
  }

  createBlocks = () => {
    let resultArray = [];
    const fallingBlock = this.dropBlock(this.state.fallingBlock);
    const fallenBlocks = this.state.fallenBlocks;
    const elFallingBlock =<Block
      key={fallingBlock.key}
      top={fallingBlock.top}
      word={fallingBlock.word}
      />
    const elFallenBlocks = [];
    fallenBlocks.forEach((b) => {
      elFallenBlocks.push((<Block
        key={b.key}
        top={b.top}
        word={b.word}
        />)
      )
    })

    console.log(elFallingBlock);
    return  fallenBlocks;
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

  // setBlocks = () => {
  //   const newTimer = this.state.timer + 1;
  //   this.setState({timer:newTimer});
  //   const blocks = this.state.blocks;
  //   const newBlocks = [];
  //   for(let i = 0; i < blocks.length;i++) {
  //     let newBlock = this.dropBlock(blocks[i]);
  //
  //     newBlocks.push(newBlock);
  //   }
  //   this.setState({blocks:newBlocks});
  // }

  startTimer() {
    this.timer = setInterval(this.createBlocks, 100);
  }
  render() {
    return (
      <div className="Screen">
        {this.createBlocks()}

      </div>
    );
  }
}
