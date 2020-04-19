import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import CardColumns from 'react-bootstrap/CardColumns'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

class Cart extends React.Component {

    getCredits(credits) {
        if(credits === 1)
            return '1 credit';
        else
            return credits + ' credits';
    }


    getCourses() {
    var courses = this.props.data;
    return Object.keys(courses).map((key, index) => {
        return (   
           <Card style={{marginTop: '5px', marginBottom: '5px'}}>
              
            <Card.Body>
                <Button variant="danger" style={{float: 'right'}} onClick={() => { 
                const {callbackFromCart} = this.props;
                callbackFromCart(courses[key], courses[key].sections, null, null, null);
                }}>Remove All Sections</Button>  
                <Card.Title>{courses[key].name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{courses[key].number} - {this.getCredits(courses[key].credits)}</Card.Subtitle>
            <Table variant="dark" bordered striped>
            <thead>
              <tr>
                <th className="head">Lecture</th>
                <th className="head" >Time</th>
                <th className="head">Option</th>
              </tr>
            </thead>
            <tbody>
              {this.renderTableData(courses[key])}
            </tbody>
            </Table>
            </Card.Body>
            </Card>
        )
    })
    }

    renderTableData(course) {
        var sections = course.sections;
        return Object.keys(sections).map((key, index) => {
          return (
             <>
             <tr key={index} >
                <td className="lec" >{ key }</td>
                <td className="lec"> { Object.entries(sections[key].time).join(" ; ") } </td>
                <td ><Button variant="danger" onClick={() => {
                const {callbackFromCart} = this.props;
                callbackFromCart(course, sections, key, null, null);
                }}>Remove Lecture</Button></td>
             </tr>
             {this.getDis(course, sections, key)}
             </>
          )
        })
    }

    
    getDis(course, section, choice) {
        var discussions = section[choice].subsections;
        return Object.keys(discussions).map((subseckey,index) => {
        return (
            <tr>
            <td >&nbsp;&nbsp;&nbsp;{subseckey}</td>
            <td >{Object.entries(discussions[subseckey].time).join(" ; ")}</td>
            <td ><Button size="sm" variant="danger" onClick={() => {
                const {callbackFromCart} = this.props;
                callbackFromCart(course, section, choice, discussions, subseckey );
                }}>Remove Section</Button></td>
            </tr>
        )
        })
    }

    render() {
        return (
        <div style={{margin: '5px'}}>
            <CardColumns>
            {this.getCourses()}
            </CardColumns>
        </div>
        )
    }
  
  
  
  }
  
export default Cart;
  