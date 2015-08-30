var Dispatcher = require('flux').Dispatcher;
var animations = {};

module.exports = _.extend(new Dispatcher(), {

  trackAnimationStart: function(animationName) {
    animations[animationName] = animations[animationName] || 0;
    animations[animationName]++;
  },

  trackAnimationEnd: function(animationName) {
    animations[animationName]--;
    if(!animations[animationName]){
      console.info("All elements have completed animation: " + animationName);
      this.dispatch({
        type:"allAnimationsEnded",
        animationName:animationName
      });
    }
  }

});
