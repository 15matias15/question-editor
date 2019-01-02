import React, { Component } from 'react';
import './App.css';
import { Form, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableEdition from './sections/TableEdition';
import TableSummary from './sections/TableSummary';
import Legend from './sections/Legend';
import Notes from './sections/Notes';
import Title from './sections/Title';
import NotificationSystem from 'react-notification-system';

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

  componentWillMount() {
    fetch(`${BASE_URL}/upload`, {
      method: 'GET'
    })
      .then(res => res.json())
      .then(resp => {
        if (resp.length > 0) {
          const newCols = resp.filter(data => data.type === 'col');
          const newRows = resp.filter(data => data.type === 'row');
          const newLabels = resp.map(data => data.name.length);
          this.setState({
            rows: newRows,
            cols: newCols,
            files: newCols.length + newRows.length,
            labels: newLabels
          })
        }
      })
  }

  handleNotification = (message, type) => {
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: message,
      level: type,
      autoDismiss: 3,
      position: 'tr'
    });
  };

  changeTitle = (e) => {
    this.setState({
      title: e.target.value.toUpperCase()
    })
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

  delete = (id, type) => {
    if (window.confirm(`Are you sure you wish to delete this ${type}?`)) {
      fetch(`${BASE_URL}/upload/${id}/${type}`, {
        method: 'DELETE'
      })
        .then(res => res.json())
        .then(resp => {
          if (resp === undefined || resp.length === 0) {
            this.setState({
              rows: [],
              cols: [],
              files: 0,
              labels: []
            })
            return;
          }
          if (resp.status === 'error') {
            this.handleNotification('We can\'t delete the ' + type + '. Try again', 'error');
            return;
          }
          if (resp.length > 0) {
            const newCols = resp.filter(data => data.type === 'col');
            const newRows = resp.filter(data => data.type === 'row');
            const newLabels = resp.map(data => data.name.length);
            this.setState({
              rows: newRows,
              cols: newCols,
              files: newCols.length + newRows.length,
              labels: newLabels
            })
          }
        })
        .catch(err => {
          console.error("Error:", err);
          this.handleNotification('We can\'t delete the ' + type + '. Try again', 'error');
        })
    }
  }

  handleSubmit = () => {
    if (this.state.nametoAdd.length === 0 || this.state.nametoAdd === undefined) {
      this.handleNotification(`Insert a valid name for ${this.state.toAdd}`, 'error');
      return;
    };
    if (this.state.toAdd === "col") {
      const newCol = {
        id: this.state.cols.length + 1,
        name: this.state.nametoAdd,
        icon: true,
        filename: ''
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
        filename: ''
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
    let name;

    if (type === 'row') {
      name = this.state.rows.find(row => row.id === id).name
    } else {
      name = this.state.cols.find(col => col.id === id).name
    }

    const data = new FormData();
    data.append('file', file);
    data.append('filename', file.name);
    data.append('id', id);
    data.append('type', type);
    data.append('name', name);

    fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: data,
    })
      .then(res => res.json())
      .then((resp) => {
        if (resp.status === 'done') {
          if (type === 'row') {
            let stateCopyRow = [...this.state.rows];
            stateCopyRow[id - 1].icon = !stateCopyRow[id - 1].icon;
            stateCopyRow[id - 1].filename = resp.fileNewName;
            this.setState({
              rows: stateCopyRow,
              files: this.state.files + 1
            });
          }
          if (type === 'col') {
            let stateCopyCol = [...this.state.cols];
            stateCopyCol[id - 1].icon = !stateCopyCol[id - 1].icon;
            stateCopyCol[id - 1].filename = resp.fileNewName;
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
          <Title changeTitle={this.changeTitle} />
        </div>
        <br />
        <div className="row">
          <div className="table-div">
            <TableEdition
              addRow={this.addRow}
              addCol={this.addCol}
              uploadFile={this.uploadFile}
              delete={this.delete}
              rows={this.state.rows}
              cols={this.state.cols}
              title={this.state.title} />
          </div>
          <TableSummary
            rows={this.state.rows}
            cols={this.state.cols}
            numberFiles={this.state.files}
            labels={this.state.labels}
            title={this.state.title} />
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
            <Form onSubmit={(e) => { e.preventDefault(); this.handleSubmit() }}>
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
      </div >
    );
  }
}

export default App;
