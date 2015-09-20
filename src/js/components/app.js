/*** @jsx React.DOM */

var React = require('react');
var ReactAddons = require('react/addons').addons;
var _ = require('lodash');
var moment = require('moment');
var HeartContainer = require('./heart-container');
var Dispatcher = require('../dispatchers/dispatcher');
var ReactCSSTransitionGroup = ReactAddons.CSSTransitionGroup;
var App = React.createClass({

  maxHearts:80,

  getInitialState:function(){
    return {
      heartCount:0,
      throbIndex:0,
      throbbing:false,
      twinkleCount:15,
      twinkleHearts:{},
      getPosition:_.noop,
      getAnimation:_.noop,
      randomIterationCount:0,
      getRandomHeartPosition:(n)=>{
        return {
          red:{top:_.random(3,97)+"%",left:_.random(3,97)+"%"},
          white:{top:_.random(3,97)+"%",left:_.random(3,97)+"%"}
        };
      },
      randomizeSize:true
    };
  },

  moveToRandom:function(){
    console.log("moving to random");
    this.setState({
      step:"randomizing",
      getAnimation:_.noop,
      randomIterationCount:this.state.randomIterationCount+1,
      getRandomHeartPosition:(n)=>{
        return {
          red:{top:_.random(3,97)+"%",left:_.random(3,97)+"%"},
          white:{top:_.random(3,97)+"%",left:_.random(3,97)+"%"}
        };
      },
      randomizeSize:true
    });
    return this.listenForAnimationCompletion("move");
  },



  throb:function(){
    this.setState({
      step:"throbbing",
      getAnimation:(n)=>{
        if((this.state.throbIndex >= n) || (n >= this.maxHearts - this.state.throbIndex )){
          return "throb";
        }
      },
      getPosition:(n)=>{
        return "position-"+n%80;
      }
    });
    var throb = ()=>{
      if(this.state.throbIndex!==(this.maxHearts/2)){
        this.setState({
          throbIndex: this.state.throbIndex+1
        });
        setTimeout(throb,120);
      }
    };
    setTimeout(throb,120);
    return this.listenForAnimationCompletion("throb");
  },

  createHearts:function(){
    return new Promise((resolve)=> {
      var moreHearts = ()=>{
        if(this.state.heartCount===this.maxHearts){
          resolve();
        }
        else{
          this.setState({
            heartCount:this.state.heartCount+1
          });
          setTimeout(moreHearts,_.random(10,100));
        }
      };
      setTimeout(moreHearts,10);
    });
  },

  moveToSquare:function(){
    this.setState({
      getAnimation:_.noop,
      getPosition:(n)=>{
        return "position-"+n%80;
      },
      randomizeSize:false,
      getRandomHeartPosition:_.noop
    });
    return this.listenForAnimationCompletion("move");
  },

  twinkle:function(){
    var twinkleHearts = {};
    var resolvePromise = null;
    var twinkler = (resolve)=>{
      resolvePromise = resolvePromise || resolve;
      if(this.state.twinkleCount){
        step:"twinkling",
        twinkleHearts[_.random(0,79)] = true;
        this.setState({
          twinkleCount: this.state.twinkleCount-1,
          getAnimation:(n)=>{
            if(twinkleHearts[n]){
              return "twinkle";
            }
          }
        });
        setTimeout(twinkler,1000);
      }
      else{
        console.log("twinkle completed");
        setTimeout(resolvePromise,2000);
      }
    }
    return new Promise(twinkler);
  },

  prepareQuestion:function(){
    return new Promise((resolve)=>{
      this.setState({
        step:"asking"
      });
      resolve();
    });
  },

  componentDidMount:function(){
    this.createHearts()
    .then(this.twinkle)
    // .then(this.moveToSquare)
    // .then(this.prepareQuestion)
    .then(this.yesClick);
  },

  oneGiantHeart:function(){
    console.log("one giant");
    this.setState({
      step:"growing",
      getAnimation:(n)=>{
        if(n!==0){
          return "fade-out";
        }
      },
      getPosition:_.noop,
      randomIterationCount:this.state.randomIterationCount+1,
      getRandomHeartPosition:(n)=>{
      if(n===0){
          return {
            red:{
              top:"50%",
              left:"50%"
            },
            white:{
              top:"50%",
              left:"50%"
            }
          }
        }
        return {red:false,white:false};
      }
    });
    //fade-out
    this.listenForAnimationCompletion("move")
    .then(()=>{
      debugger;
      this.setState({
        getAnimation:(n)=>{
          if(n!==0){
            return "fade-out";
          }
          else{
            return "mega-huge";
          }
        }
      });
    });
    return this.listenForAnimationCompletion("mega-huge")
  },

  fadeOut:function(){
    console.log("fade out");
    this.setState({
      step:"fading",
      getAnimation:(n)=>{
        if(n===0){
          return "";
        }
        else{
          return "fade-out";
        }
      }
    });
    return this.listenForAnimationCompletion("fade-out")
  },

  noClick:function(){
    var counter = 0;
    var breakHeart = ()=>{
      this.setState({
        step:"crying",
        getAnimation:_.noop,
        randomIterationCount:this.state.randomIterationCount+1,
        getRandomHeartPosition:(n)=>{
          if(n<counter){
            return {
              red:{
                top:"102%",
                left:null
              },
              white:{
                top:"102%",
                left:null
              }
            };
          }
          else{
            return {
              red:{top:null,left:null},
              white:{top:null,left:null}
            };
          }
        }
      });

      if(counter++<=this.maxHearts){
        setTimeout(breakHeart,30);
      }
    };
    breakHeart();
    return this.listenForAnimationCompletion("move");
  },

  yesClick:function(){
    this.moveToRandom()
    .then(this.moveToRandom)
    .then(this.moveToRandom)
    .then(this.moveToRandom)
    .then(this.fadeOut)
    .then(this.oneGiantHeart);
  },

  render:function(){
    var startTime = moment(new Date());
    var end = moment(new Date(2015, 8, 20, 17, 15, 0, 0));
    var duration = moment.duration(end.diff(startTime));
    var hours = duration.asHours();
    hours = (Math.floor(hours*1000)/1000) + " hours left";
    var hearts = [];
    _.times(this.state.heartCount,(n)=>
    {
      hearts.push((
        <HeartContainer
          key= {n}
          count= {n}
          position= {this.state.getPosition(n)}
          animation= {this.state.getAnimation(n)}
          randomizeHeartPosition= {this.state.getRandomHeartPosition(n)}
          randomizeSize= {this.state.randomizeSize}
          randomIterationCount = {this.state.randomIterationCount}
          step =  {this.state.step}
        />
      ));
    });
    var asking = this.state.step==="asking" ? "":"hidden";

    var textHeadline = (
      <span className={"text-headline asking"} key="headline">
        <span>
          {hours}
        </span>
      </span>
    );

    return (
      <div className="view-area">
        <ReactCSSTransitionGroup transitionName="animate">
          {textHeadline}
          {hearts}
        </ReactCSSTransitionGroup>
      </div>
    );
  },

  listenForAnimationCompletion:function(animationName){
    return new Promise((resolve, reject)=> {
      var id = Dispatcher.register(function(payload) {
        if(payload.animationName === animationName){
          resolve(payload);
          Dispatcher.unregister(id);
        }
      });
    });
  },
});
module.exports = App;
