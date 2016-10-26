"use strict";

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

  render: function render() {
    var title = this.props.photo.title;
    return React.createElement(
      "div",
      { className: "col-md-4 col-sm-6" },
      React.createElement(
        "div",
        { className: "portfolio-item" },
        React.createElement(
          "a",
          { href: this.props.photo.url },
          React.createElement("img", { alt: title, className: "img-portfolio img-responsive", src: this.props.photo.previewUrl })
        )
      )
    );
  }
});
