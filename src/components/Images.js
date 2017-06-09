import React, { Component } from 'react';
import './Images.css';

class Images extends Component {

  full(key) {
    let ele = this.refs[key];
    ele.style.position = ele.style.position === 'absolute' ? 'fixed' : 'absolute';
    ele.style.zIndex = ele.style.position === 'absolute' ? 1 : 9999;
  }

  createGrid() {
    return this.props.data.map((item, i) => (
      <div className="lz-images-item" key={i}>
        <img src={item.url} alt={ item.title } ref={`img${i}`} onClick={ () => this.full(`img${i}`) } />
        <p>{ item.title }</p>
      </div>
    ));
  }  

  render() {
    return (
      <div className="lz-images">
        { this.createGrid() }
      </div>
    );
  }
}

export default Images;
