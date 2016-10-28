"use strict";

var ImageFilter = React.createClass({
  displayName: "ImageFilter",

  getInitialState: function getInitialState() {
    var defaultFilter = (photo)=>{return !photo.hide;};
    return {
      showPeople: true,
      showLandscape: true
    };
  },

  showPeopleChange:function(){
    this.setState({showPeople:!this.state.showPeople});
  },
  showLandscapeChange:function(){
    this.setState({showLandscape:!this.state.showLandscape});
  },
  render: function render() {
    var filterPhotos = (photo)=>{
      if(photo.hide) return false;
      return !!photo.keywords.person == this.state.showPeople
        || !!photo.keywords.nature == this.state.showLandscape;
    };
    return React.createElement(
      "div",
      { className: "container" },

      React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          {className:"col-sm-6"},
          React.createElement(
            "label",
            null,
            "Show People"
          ),
          React.createElement("input",
            { type: "checkbox", id: "showpeople", defaultChecked: "checked", onChange: this.showPeopleChange }
          ),
          React.createElement(
            "label",
            null,
            "Show Landscapes"
          ),
          React.createElement("input",
            { type: "checkbox", id: "showlandscape", defaultChecked: "checked", onChange: this.showLandscapeChange }
          )
        ),
      ),
      React.createElement(ImageContainer, { filter:filterPhotos})
    );
  }
});

var ImageContainer = React.createClass({
  displayName: "ImageContainer",

  getInitialState: function getInitialState() {
    var defaultFilter = (photo)=>{return !photo.hide;};
    return {
      photos: window.photos,
      filter: this.props.filter || defaultFilter
    };
  },
  getItems: function getItems() {
    var photos = window.photos.filter(this.state.filter);
    return photos.map(function (photo, index) {
      return React.createElement(ImagePreview, { key: index, photo: photo });
    });
  },
  render: function render() {
    return React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-lg-10 col-lg-offset-1 text-center" },
        React.createElement("hr", { className: "small" }),
        React.createElement(
          "div",
          { className: "row" },
          this.getItems()
        )
      )
    );
  }
});

var ImagePreview = React.createClass({
  displayName: "ImagePreview",
  getInitialState: function getInitialState() {
    return {
      toggled: false
    };
  },
  fullScreen:function(){
    this.setState({toggled:true});
  },
  render: function render() {
    var title = this.props.photo.title;
    return React.createElement(
      "div",
      { className: "col-sm-12" },
      React.createElement(
        "div",
        { className: "portfolio-item" },
        React.createElement("img",
        {
          alt: title, className: "img-portfolio img-responsive", src: this.props.photo.previewUrl,
          onClick:this.fullScreen
        })
      )
    );
  }
});
