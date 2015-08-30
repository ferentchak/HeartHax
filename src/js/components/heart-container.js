/*** @jsx React.DOM */

var React = require('react');
var ReactAddons = require('react/addons').addons;
var _ = require('lodash');
var Heart = require('./heart');
var Dispatcher = require('../dispatchers/dispatcher');

module.exports = React.createClass({

  getInitialState:function(){
    return {
      size:_.random(0,2)
    };
  },

  getClasses:function(){
    var size = this.props.randomizeSize? this.state.size : null;
    var classes = {
      'heart-container': true,
      'small': size===0,
      'medium': size===1,
      'large': size===2,
    };
    classes[this.props.animation] = this.props.animation;
    classes[this.props.step] = this.props.step;
    classes[this.props.position] = this.props.position;
    return ReactAddons.classSet(classes);
  },

  render:function(){
    return (
      <span
      className={this.getClasses()}>
        <Heart
          {...this.props}
          red={true}
        />
        <Heart
          {...this.props}
          white={true}
        />
      </span>
    );
  },

  componentDidMount:function(){
    var dom = this.getDOMNode();

    var animationStartListener = ( event )=>{
      Dispatcher.trackAnimationStart(event.animationName);
    };
    var animationEndListener = ( event )=>{
      Dispatcher.trackAnimationEnd(event.animationName);
    };
    dom.addEventListener( 'webkitAnimationEnd',animationEndListener,false);
    dom.addEventListener( 'webkitAnimationStart',animationStartListener,false);

    var dom = this.getDOMNode();
    var endListener = ( event )=>{
      if(event.propertyName==="left"){
        Dispatcher.trackAnimationEnd("move");
        dom.removeEventListener(endListener);
      }
    };
    dom.addEventListener( 'webkitTransitionEnd',endListener,false);
  },

  componentWillReceiveProps: function(nextProps) {
    if(nextProps.position && (this.props.position !== nextProps.position))
    {
      Dispatcher.trackAnimationStart("move");
    }
  }
});
