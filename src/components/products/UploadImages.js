import React, { Component } from 'react';
import Error from '../Error';

class UploadImages extends Component {

  constructor(props){
    super(props);

    this.state = {
      files: [],
      error: null
    };

    this.uploadImage = this.uploadImage.bind(this);
    this.remove = this.remove.bind(this);
  }

  uploadImage(e){
    const {maxUploads, maxSize, callback} = this.props;
    let {files} = this.state;
    if(files.length >= maxUploads){
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if(this.getImageSize(reader.result) > maxSize){
        this.setState({
          error: 'Image size should be less than ' + maxSize + 'kb'
        });
        return;
      }
      files = [...this.state.files, {blob: reader.result, id: Date.now()}]
      this.setState({
        files,
        error: null
      });
      callback(files);
    };

    if(e.target.files[0])
      reader.readAsDataURL(e.target.files[0]);
  }

  getImageSize(base64String){
    const stringLength = base64String.length - 'data:image/png;base64,'.length;
    const sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
    const sizeInKb = sizeInBytes / 1000;

    return sizeInKb;
  }

  remove(id){
    const files = this.state.files.filter(file => file.id != id);
    this.setState({
      files
    });

    this.props.callback(files);
  }

  render() {
    const {maxUploads} = this.props;
    const {files, error} = this.state;

    return (
        <div className="block">
          <label className="title">Add a photo</label>
          <div className="block-content-comment">
             <div className="upload-img">
                <input
                   id="upload-image"
                  disabled={files.length >= maxUploads}
                  type="file"
                  accept="image/*"
                  onChange={this.uploadImage}
                />
                <label style={files.length >= maxUploads ? {opacity: '0.4', float: 'left'} : {float: 'left'}} for="upload-image">+</label>
                {
                  files.map(file => {
                    return <span style={{border: '1px solid #999', marginLeft: '10px', display: 'inline-block', height: '80px', width: '80px', float: 'left', overflow: 'hidden', position: 'relative'}}>
                        <a href="javascript:void(0);" style={{position: 'absolute', right: '4px', color: '#000'}} onClick={(e) => this.remove(file.id)}>X</a>
                        <img width={100} key={file.id} src={file.blob} alt="" />
                      </span>
                  })
                }
                
             </div>
             {
                error && <Error text={error} />
              }
          </div>
       </div>
    );
  }
}

export default UploadImages;
