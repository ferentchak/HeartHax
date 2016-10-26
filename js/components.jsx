var ImageContainer =  React.createClass({
  getInitialState: function(){
    return {
      photos: window.photos
    }
  },
  getItems: function(){
    return this.state.photos.map((photo, index)=>{
      return (<ImagePreview key={index} photo={photo} />);
    });
  },
  render: function(){
    return (
      <div className="row">
        <div className="col-lg-10 col-lg-offset-1 text-center">
          <hr className="small"/>
          <div className="row">
            {this.getItems()}
          </div>
        </div>
      </div>
    )
  }
});


var ImagePreview = React.createClass({
  render: function(){
    var title = this.props.photo.title;
    return (
    <div className="col-md-4 col-sm-6">
      <div className="portfolio-item">
        <a href={props.photo.image}>
          <img alt={title} className="img-portfolio img-responsive" src={props.photo.previewUrl}/>
        </a>
      </div>
    </div>
    );
    }
});
