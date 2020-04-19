import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import SearchAndFilter from './SearchAndFilter';
import ListGroup from 'react-bootstrap/ListGroup';


class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.searchAndFilter = new SearchAndFilter();
    this.tag = React.createRef();
    this.selectedTags = [];
    this.searchMode = React.createRef();
  }

  setCourses() {
    this.props.setCourses(this.searchAndFilter.searchAndFilter(this.props.courses, this.selectedTags, this.searchMode.current.value));
  }

  showSelectedTags() {
    return (
      <div>
        {this.selectedTags.length !== 0 ? <p>Your tags</p> : <p>Click above to add a tag.</p>}
        <ListGroup>
          {
            this.selectedTags.map((oneTag, index) => (
              <ListGroup.Item variant="dark" ref={index} key={oneTag.toString()}>{oneTag}
              <Button variant="dark" style={{marginLeft: '5px'}} onClick={this.removeTag.bind(this, index)}>Delete</Button>
              </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
  
  // Handle the submission event
  formSubmitter= event => {
    // Wait until user actively submit form
    event.preventDefault();
    this.selectedTags.push(this.tag.current.value);
    this.setCourses();
    this.myFormRef.reset();
  }

  getModeOptions() {
    let selectionOptions = [];
    for(const mode of this.props.searchMode) {
      selectionOptions.push(<option key={mode}>{mode}</option>);
    }
    return selectionOptions;
  }

  removeTag(index) {
    this.selectedTags.splice(index, 1);
    this.setCourses();
  }


  render() {
    return (
      <>
        <Card style={{width: 'calc(20vw - 5px)', marginTop: '2px', marginLeft: '5px', height: 'auto', position: 'fixed'}}>
          <Card.Body>
            <Card.Title>Search by tags</Card.Title>
            <Form onSubmit={this.formSubmitter} ref={(el) => this.myFormRef = el}>
              <Form.Group controlId="formTags" style={{width: '100%'}}>
                <Form.Label>Add tag</Form.Label>
                <Form.Control type="text" placeholder="Tag" autoComplete="off" ref={this.tag} list="myDropdown"/>
                <Button type="submit" variant="dark" style={{marginTop:'5px'}} >Add tag</Button>
              </Form.Group>
            </Form>
            <Form.Group controlId="formSubject">
                <Form.Label>Search Mode</Form.Label>
                <Form.Control as="select" ref={this.searchMode} onChange={() => this.setCourses()}>
                  {this.getModeOptions()}
                </Form.Control>
            </Form.Group>
            {this.showSelectedTags()}



          </Card.Body>
        </Card>
      </>
    )
  }
}

export default Sidebar;
