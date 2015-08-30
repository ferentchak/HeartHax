/*** @jsx React.DOM */

var React = require('react');
var ReactAddons = require('react/addons').addons;
var _ = require('lodash');
var Dispatcher = require('../dispatchers/dispatcher');

module.exports = React.createClass({

  getInitialState:function(){
    return this.getTopAndLeft();
  },

  getTopAndLeft:function(){
    if(this.props.randomizeHeartPosition){
      var color = this.props.red?"red":"white";
      var position = this.props.randomizeHeartPosition[color]||{};
      return position;
    }
    return {
      top:null,
      left:null
    };
  },

  getStyle:function(){
    if(this.props.randomizeHeartPosition){
      return {
        top:this.state.top,
        left:this.state.left
      };
    }
    else{
      return {};
    }
  },

  getClasses:function(){
    var classes = {
      'fa': true,
      'fa-heart': true,
      'heart-part': true,
      'red': this.props.red,
      'white': this.props.white
    };
    classes[this.props.animation] = this.props.animation;
    classes[this.props.position] = this.props.position;
    return ReactAddons.classSet(classes);
  },

  render:function(){
    return (
      <span
      ref="element"
      style={this.getStyle()}
      className={this.getClasses()}>
      </span>
    );
  },

  componentDidMount:function(){
    var dom = this.getDOMNode();
    var endListener = ( event )=>{
      if(event.propertyName==="left"){
        Dispatcher.trackAnimationEnd("move");
        if(!this.props.randomizeHeartPosition){
          this.setState({
            lockToParent: true
          });
        }
      }
    };
    dom.addEventListener( 'webkitTransitionEnd',endListener,false);
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.position && (this.props.position !== nextProps.position))
    {
      Dispatcher.trackAnimationStart("move");
    }
    if(nextProps.randomIterationCount != this.props.randomIterationCount){
      Dispatcher.trackAnimationStart("move");
      this.setState({
        lockToParent:false
      },()=>{
        this.setState(this.getTopAndLeft());
      });
    }
  }
});
