import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import classnames from 'classnames';


const Null  = class Null extends Component { render(){ return null  } };
const animationTime = 2000;


function insertMacroTask(fun, callBack, turn = 1) {
  if (turn === 0) {
    return fun();
  }
  return window.setTimeout(
    function(){
      return insertMacroTask(fun, callBack, --turn)
    }, 0
  );
};




class Animation extends React.Component {
  constructor(props) {
    super(props);
    const {
      location:
        {
          pathname: nowPathname,
          search: nowSearch
        },
    } = props;
    
    this.forward = this.forward.bind(this);
    this.back = this.back.bind(this);
    this.runAllTask = this.runAllTask.bind(this);
    
    this.state = {
      isForwarding: false,
      isBacking: false,
      PreCom: <Null key='previous' />,
      CurrCom: React.cloneElement(props.children, { key: nowPathname + nowSearch } ),
      NextCom: <Null key='next' />,
    };
    
    this.history = [ props.location ];
    this.updateQueue = [];
  }
  componentDidMount() {
    // debugger
    // window.go1 = this.props.router.push('/contacts/departmentDetail?departmentIdList=30002');
    // window.setTimeout(()=>{
    //   window.go2 = this.props.router.push('/contacts/departmentDetail?departmentIdList=30002%2C31002');
    // });
  }
  componentWillReceiveProps(nextProps) {
    const {
      location:{
        pathname: nextPathname,
        search: nextSearch,
        key: nextKey,
      }
    } = nextProps;
    const {
      location:
        {
          pathname: nowPathname,
          search: nowSearch,
          key: nowKey,
        },
    } = this.props;
    
    
    const {
      isBacking,
      isForwarding,
    } = this.state;
    
    if(
      nextPathname !== nowPathname ||
      nextSearch !== nowSearch
    ){
      this.updateQueue.push(async ()=>{
        const findIndex = this.history.reduceRight((index, h, i)=> h.key === nextKey? i: index, -1);
        console.log('%c index', 'color: pink');
        console.log(findIndex);
        
        if(findIndex === -1){
          await this.forward(nextProps);
          this.history.push(nextProps.location);
          console.log('%c this.history', 'color: blue');
          console.log(this.history);
          return
        }
        await this.back(nextProps);
        this.history = this.history.slice(0, findIndex + 1);
        console.log('%c this.history', 'color: red');
        console.log(this.history);
      });
      
      this.runAllTask();
    }
  }
  async runAllTask(){
    debugger
    
    if(this.isRuning) return
    this.isRuning = true;
    for(let i=0; i<this.updateQueue.length; i++){
      console.log(this.updateQueue);
      const task = this.updateQueue[i];
      console.log('start')
      // await new Promise(r=>insertMacroTask(()=>r(task()), 10));
      await new Promise(r=>window.setTimeout(()=>r(task()), 100));
      console.log('done')
    }
    console.log('alldone')
    
    
    this.updateQueue = [];
    this.isRuning = false;
  }
  forward(nextProps){
    console.log('%c \'forward start\'', 'background: #222; color: #bada55');
    
    const {
      location:{
        pathname: nextPathname,
        search: nextSearch,
        key: nextKey,
      }
    } = nextProps;
    
    return new Promise((resolve, reject)=>{
      this.setState({
        NextCom: React.cloneElement(nextProps.children, { key: nextPathname + nextSearch }),
        isForwarding: true,
      });
      
      window.setTimeout(()=>{
        console.log('forward done');
        this.setState({
          NextCom: <Null key='next'/>,
          CurrCom: this.state.NextCom,
          isForwarding: false,
        }, resolve);
      }, animationTime);
    })
  }
  back(nextProps){
    console.log('%c back start', 'background: #222; color: #bada55');
    const {
      location:{
        pathname: nextPathname,
        search: nextSearch,
        key: nextKey,
      }
    } = nextProps;
    
    return new Promise((resolve, reject)=> {
      this.setState({
        PreCom: React.cloneElement(nextProps.children, { key: nextPathname + nextSearch }),
        isBacking: true,
      });
      
      window.setTimeout(()=>{
        console.log('back done')
        this.setState({
          PreCom: <Null key='previous'/>,
          CurrCom: this.state.PreCom,
          isBacking: false,
        }, resolve);
      }, animationTime);
    })
  }
  render() {
    const {
      PreCom,
      CurrCom,
      NextCom,
      isForwarding,
      isBacking,
    } = this.state;
    
    console.log(          classnames(
      'react-router-transition-animation',
      {
        'react-router-transition-forward': isForwarding,
        'react-router-transition-back': isBacking,
      }
      )
    )
    
    return (
      <section
        className={
          classnames(
            'react-router-transition-animation',
            {
              'react-router-transition-forward': isForwarding,
              'react-router-transition-back': isBacking,
            }
          )
        }
      >
        { PreCom }
        { CurrCom }
        { NextCom }
      </section>
    )
  }
}

Animation.defaultProps = {

};

export default withRouter(Animation);

