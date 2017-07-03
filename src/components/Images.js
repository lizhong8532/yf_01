import React, { Component } from 'react';
import Lightbox from 'react-image-lightbox';
import './Images.css';


class Images extends Component {
  constructor(props) {
    super(props);

    this.state = {
      photoIndex: 0,
      isOpen: false
    };
  }

  full(key) {
    let ele = this.refs[key];
    ele.style.position = ele.style.position === 'absolute' ? 'fixed' : 'absolute';
    ele.style.zIndex = ele.style.position === 'absolute' ? 1 : 9999;
  }

  createGrid() {
    return this.props.data.map((item, i) => (
      <div className="lz-images-item" key={i}>
        <img src={item.url} alt={ item.title } ref={`img${i}`} onClick={ () => this.setState({isOpen: true}) } />
        <p>{ item.title }</p>
      </div>
    ));
  }  
 
  render() {
    let images = this.props.data.map((item) => item.url);
    let titles = this.props.data.map((item) => item.title);

    const {
      photoIndex,
      isOpen,
    } = this.state;

    return (
      <div>
        <div className="lz-images">
          { this.createGrid() }
        </div>

        { isOpen &&
          <Lightbox
              mainSrc={images[photoIndex]}
              imageCaption={titles[photoIndex]}
              nextSrc={images[(photoIndex + 1) % images.length]}
              prevSrc={images[(photoIndex + images.length - 1) % images.length]}

              onCloseRequest={() => this.setState({ isOpen: false })}
              onMovePrevRequest={() => this.setState({
                  photoIndex: (photoIndex + images.length - 1) % images.length,
              })}
              onMoveNextRequest={() => this.setState({
                  photoIndex: (photoIndex + 1) % images.length,
              })}
          />
        }
      </div>
    );
  }
}

export default Images;
