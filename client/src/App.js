import React, { Component } from 'react';
import './App.css';
import { Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableEdition from './sections/TableEdition';
import TableSummary from './sections/TableSummary';
import NotificationSystem from 'react-notification-system';
import { Legend } from './sections/Legend';
import { Notes } from './sections/Notes';

const BASE_URL = 'http://localhost:3001';
const FILES_FORMAT = /(\.jpg|\.jpeg|\.png|\.pdf|\.doc|\.docx)$/i;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      rows: [],
      cols: [],
      labels: [],
      files: 0,
      toAdd: '',
      nametoAdd: '',
      modal: false
    }
  };
  notificationSystem = React.createRef()

  handleNotification = (message, type) => {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: message,
      level: type,
      autoDismiss: 3,
      position: 'tr'
    });
  };

  addRow = () => {
    this.setState({
      toAdd: 'row',
      modal: !this.state.modal
    });
  };

  addCol = () => {
    this.setState({
      toAdd: 'col',
      modal: !this.state.modal
    });
  };

  handleSubmit = (e) => {
    if (this.state.nametoAdd.length === 0 || this.state.nametoAdd === undefined) {
      this.handleNotification(`Insert a valid name for ${this.state.toAdd}`, 'error');
      return;
    };

    if (this.state.toAdd === "col") {
      const newCol = {
        id: this.state.cols.length + 1,
        name: this.state.nametoAdd,
        icon: true,
        file: ''
      }
      this.setState({
        cols: [...this.state.cols, newCol],
        labels: [...this.state.labels, +newCol.name.length]
      })
    }
    if (this.state.toAdd === "row") {
      const newRow = {
        id: this.state.rows.length + 1,
        name: this.state.nametoAdd,
        icon: true,
        file: ''
      }
      this.setState({
        rows: [...this.state.rows, newRow],
        labels: [...this.state.labels, +newRow.name.length]
      })
    }
    this.setState({
      toAdd: '',
      nametoAdd: '',
      modal: !this.state.modal
    });
  };

  uploadFile = (type, id, file) => {
    if (!FILES_FORMAT.exec(file.name)) {
      this.handleNotification('Upload only files in format JPG, JPEG, PNG, DOC, DOCX & PDF', 'error');
      return;
    };
    const data = new FormData();
    data.append('file', file);
    data.append('filename', file.name);
    data.append('id', id);
    data.append('type', type);

    fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then((resp) => {
        if (resp.status === 'done') {
          if (type === 'row') {
            let stateCopyRow = Object.assign([], this.state.rows);
            stateCopyRow[id - 1].icon = !stateCopyRow[id - 1].icon;
            stateCopyRow[id - 1].file = resp.fileNewName;
            this.setState({
              rows: stateCopyRow,
              files: this.state.files + 1
            });
          }
          if (type === 'col') {
            let stateCopyCol = Object.assign([], this.state.cols);
            stateCopyCol[id - 1].icon = !stateCopyCol[id - 1].icon;
            stateCopyCol[id - 1].file = resp.fileNewName;
            this.setState({
              cols: stateCopyCol,
              files: this.state.files + 1
            });
          }
          this.handleNotification('File uploaded!', 'success');
        }
      })
      .catch(err => {
        console.error("Error:", err);
        this.handleNotification('We can\'t upload your file. Try again', 'error');
      })
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <label id="titleLabel" htmlFor="titleInput">Insert a title : </label>
          <input type="text" id="titleInput" placeholder="Title..." onChange={(event) => { this.setState({ title: event.target.value.toUpperCase() }) }} />
        </div>
        <br />
        <div className="row">
          <div className="col-sm-6 table-div" >
            <h5><strong>{this.state.title} EDITION VIEW</strong></h5>
            {this.state.title || <p style={{ fontStyle: 'italic' }}>Title of the question</p>}
            <TableEdition
              addRow={this.addRow}
              addCol={this.addCol}
              uploadFile={this.uploadFile}
              Rows={this.state.rows}
              Cols={this.state.cols} />
          </div>
          <div className="col-sm-6">
            <h5><strong>{this.state.title} EDITION SUMMARY</strong></h5>
            <br />
            <h6>Summary</h6>
            <TableSummary
              Rows={this.state.rows}
              Cols={this.state.cols}
              numberFiles={this.state.files}
              Labels={this.state.labels} />
          </div>
        </div>
        <br />
        <div className="row">
          <Legend />
          <Notes />
        </div>
        <NotificationSystem ref={this.notificationSystem} />
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Add {this.state.toAdd}</ModalHeader>
          <ModalBody>
            <Form onSubmit={(e) => { e.preventDefault(); this.handleSubmit(e) }}>
              <FormGroup>
                <Label for="nameAdd">Please give a name to the {this.state.toAdd}:</Label>
                <Input type="search" name="nameAdd" id="nameAdd" placeholder="Name..." onChange={(e) => this.setState({ nametoAdd: e.target.value })}></Input>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>Create</Button>{' '}
            <Button color="danger" onClick={() => this.setState({ modal: !this.state.modal })}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;