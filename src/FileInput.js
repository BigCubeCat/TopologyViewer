import React, {Component} from 'react';

export default class FileInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };
  }

  openFile(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (event) => {
      // The file's text will be printed here
      this.props.sendData(event.target.result)
    };
    reader.readAsText(file);
  }

  onFileUpload = () => {
    const formData = new FormData();
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );
  };

  render() {
    return (
      <div>
        <div>
          <input type="file" onChange={e => this.openFile(e)}/>
        </div>
      </div>
    );
  }
}
