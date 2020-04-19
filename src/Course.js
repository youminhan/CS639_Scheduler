import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

class Course extends React.Component {
    
  constructor(props) {
    super(props);
    this.showMore = false;  
    this.state = {
      
    }  
  }


  renderTableData() {
    var sections = this.props.data.sections;
    
    return Object.keys(sections).map((key, index) => {
      return (
         <React.Fragment>
         <tr key={this.props.data.name + key + index}>
            <td className="lec" >{ key }</td>
            <td className="lec">{ sections[key].instructor }</td>
            <td className="lec">{ sections[key].location }</td>
            <td className="lec"> { Object.entries(sections[key].time).join(" ; ") } </td>
            <td ><Button size="lg" variant="info" style={{float:"right"}} onClick={() => {
            const {callbackFromCourse} = this.props;
            var newdis = JSON.parse(JSON.stringify(sections[key].subsections));
            var newsec = JSON.parse(JSON.stringify(sections[key]));
            var newdata = JSON.parse(JSON.stringify(this.props.data));
            callbackFromCourse(newdata, newsec, key, newdis, null);
            }}>Add Lecture</Button></td>
         </tr>
         {this.getDis(sections, key)}
         </React.Fragment>
      )
    })
  }

  getDis(section, choice) {
    var discussions = section[choice].subsections;
    return Object.keys(discussions).map((key,index) => {
      return (
        
        <tr key={this.props.data.number + choice + key + index}>
          <td >&nbsp;&nbsp;&nbsp;{key}</td>
          <td ></td>
          <td >{discussions[key].location}</td>
          <td >{Object.entries(discussions[key].time).join(" ; ")}</td>
          <td ><Button variant="info" style={{float:"right"}} onClick={() => {
            const {callbackFromCourse} = this.props;

            var newdis = JSON.parse(JSON.stringify(discussions));
            var newsec = JSON.parse(JSON.stringify(section));
            var newdata = JSON.parse(JSON.stringify(this.props.data));
            callbackFromCourse(newdata, newsec, choice, newdis, key );
            }}>Add Sections</Button></td>
        </tr>
      )
    })
  }


  
  render() {
    return (
      <Card style={{marginTop: '5px', marginBottom: '5px'}} >
        <Card.Body>
         
          <Button variant="info" style={{float:"right"}} onClick={() => {
            const {callbackFromCourse} = this.props;
            var newsec = JSON.parse(JSON.stringify(this.props.data.sections));
            var newdata = JSON.parse(JSON.stringify(this.props.data));
            callbackFromCourse(newdata, newsec, null, null, null);
            }}>Add All Sections</Button>   
          <Button variant="dark" id={this.props.data.number} style={{marginRight:"10px", float:"right"}} onClick={() => {
            this.showMore = !this.showMore;
            document.getElementById(this.props.data.name).style.display = (this.showMore ? '':'none');
            document.getElementById(this.props.data.number).innerHTML = (this.showMore ? 'Hide Section':'Show Section');
            }}>Show Section</Button>    
          <Card.Title>{this.props.data.name}</Card.Title>
          
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
        
          <Table variant="dark" bordered striped style={{display:'none'}} id={this.props.data.name}>
            <thead>
              <tr>
                <th className="head">Lecture</th>
                <th className="head">Instructor</th>
                <th className="head">Location</th>
                <th className="head" >Time</th>
                <th className="head">Option</th>
              </tr>
            </thead>
            <tbody>
              {this.renderTableData()}
            </tbody>
          </Table>
      </Card.Body>
      </Card>
    )
  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }
}

export default Course;
