import React, { Component, PropTypes } from 'react';
import Iconfont from 'components/Iconfont';
import fetchAPI from 'utils/fetch';
import JSBridge from 'za-jsbridge';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';


const Null  = class Null extends Component { render(){ return null  } };

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
  
    this.state = {
      // CurrCom: props.children,
      CurrCom: React.cloneElement(props.children, { key: nowPathname + nowSearch } ),
      NextCom: <Null key='null' />,
    };
  }
  componentDidMount() {
  
  }
  componentWillReceiveProps(nextProps) {
    const {
      location:{
        pathname: nextPathname,
        search: nextSearch
      }
    } = nextProps;
    const {
      location:
      {
        pathname: nowPathname,
        search: nowSearch
      },
    } = this.props;
    
    if(
      nextPathname !== nowPathname ||
      nextSearch !== nowSearch
    ){
      this.setState({
        NextCom: React.cloneElement(nextProps.children, { key: nextPathname + nextSearch }),
        isShifting: true,
      });
      
      window.setTimeout(()=>{
        this.setState({
          NextCom: <Null key='null' />,
          CurrCom: this.state.NextCom,
          isShifting: false,
        })
      }, 1e3);
    }
  }
  render() {
    const {
      CurrCom,
      NextCom,
      isShifting,
    } = this.state;
    
    return (
      <section
        className={
          'react-router-transition-shift-animation ' + (isShifting? 'react-router-transition-shift-go': '')
        }
        >
        { CurrCom }
        { NextCom }
      </section>
    )
  }
}

Animation.defaultProps = {

};

export default withRouter(Animation);

