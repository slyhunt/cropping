import * as React from 'react';
import Icon from './Icon';
import 'antd/dist/antd.less';
import Uploader from './Uploader';
import Cropper from './Cropper';

export interface CropViewerState {
  previewImage?: FileReader;
  selectedImage?: string,
}

export interface CropProps {
  prefixCls: string;
  value: Blob;
  onChange: (blob: Blob) => void;
  size?: Array<number>;
  circle?: boolean;
  renderModal: (args?:any) => React.ComponentElement<any, any>;
  getSpinContent: () => React.ComponentElement<any, any>;
}

export default class CropViewer extends React.Component<CropProps, CropViewerState> {
  static defaultProps = {
    prefixCls: 'rc',
    size: [32, 32],
    circle: false,
  };
  constructor(props) {
    super(props);
    this.state = {
      previewImage: null,
      selectedImage: null,
    };
    if (props.value) {
      this.loadSelectedImage(props.value);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.value) {
      this.loadSelectedImage(nextProps.value);
    } else {
      this.setState({
        previewImage: null,
        selectedImage: null,
      });
    }
  }
  loadSelectedImage = (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      this.setState({
        selectedImage: reader.result,
      });
    }
  }
  reset = () => {
    this.onChange(null);
  }
  selectImage = (reader) => {
    this.setState({
      previewImage: reader,
    });
  }
  onChange = (fileblob: Blob) => {
    if (this.props.onChange) {
      this.props.onChange(fileblob);
    }
    if (!this.props.value) {
      if (fileblob) {
        this.loadSelectedImage(fileblob);
      } else {
        this.setState({
          previewImage: null,
          selectedImage: null,
        });
      }
    }
  }
  render() {
    const { previewImage, selectedImage } = this.state;
    const { prefixCls, value, size, circle, getSpinContent, renderModal} = this.props;

    if (selectedImage) {
      return <div className={`${prefixCls}-preview-wrapper`}>
        <div className={`${prefixCls}-preview`}>
          <div className={`${prefixCls}-preview-mask`} onClick={this.reset}>
            <Icon type="delete" />
          </div>
          <img src={selectedImage} width={size[0]} height={size[1]} />
        </div>
      </div>;
    }
    if (previewImage) {
      return <Cropper 
        circle={circle}
        size={size}
        prefixCls={prefixCls}
        image={previewImage}
        onChange={this.onChange} 
        renderModal={renderModal}
        spin={getSpinContent()}
      />;
    }
    return <Uploader prefixCls={prefixCls} onSelectImage={this.selectImage}/>;
  }
};