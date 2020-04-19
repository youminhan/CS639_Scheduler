import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Day from './Day';
class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }  
    }
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
                <Button variant="dark" id={courses[key].number} style={{marginRight:"10px", float:"right"}} onClick={() => {
                if ( document.getElementById(courses[key].name).style.display === 'none') {
                    document.getElementById(courses[key].name).style.display = '';
                    document.getElementById(courses[key].number).innerHTML = 'Hide Section';
                } else {
                    document.getElementById(courses[key].name).style.display = 'none';
                    document.getElementById(courses[key].number).innerHTML = 'Show Section';
                }
                }}>Show Section</Button>  
                <Button id={courses[key].name + 'button'}  onClick={() => {this.addAllCourse(courses[key])}}>Add All</Button>  
                <Card.Title>{courses[key].name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{courses[key].number} - {this.getCredits(courses[key].credits)}</Card.Subtitle>
            <Table variant="dark" bordered striped style={{display:'none'}}  id={courses[key].name}>
            <thead>
              <tr>
                <th className="head">Lecture</th>
                <th className="head" >Time</th>
                {/* <th className="head">Cart</th> */}
                <th className="head">Schedule</th>
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
             <tr key={index} style={{fontSize: '13px'}} >
                <td className="lec" >{ key }</td>
                <td className="lec"> { Object.entries(sections[key].time).join(" ; ") } </td>
                {/* <td ><Button variant="danger" onClick={() => {
                const {callbackFromCart} = this.props;
                callbackFromCart(course, sections, key, null, null);
                }}>Remove Lecture</Button></td> */}
                <td> <Form.Check type="checkbox"  style={{marginTop: '15px', textAlign: 'center', transform: 'scale(1.2)'}}  id={course.name + key } onClick={(event) => {this.addCourse(event, course, sections, key, null, null)}} /></td>
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
            <tr style={{fontSize: '13px'}}>
            <td >&nbsp;&nbsp;&nbsp;{subseckey}</td>
            <td >{Object.entries(discussions[subseckey].time).join(" ; ")}</td>
            {/* <td ><Button size="sm" variant="danger" onClick={() => {
                const {callbackFromCart} = this.props;
                callbackFromCart(course, section, choice, discussions, subseckey );
                }}>Remove Section</Button></td> */}
            <td> <Form.Check type="checkbox" style={{marginTop: '15px', textAlign: 'center', transform: 'scale(1.2)'}} id={course.name + choice + subseckey} onClick={(event) => {this.addCourse(event, course, section, choice, discussions, subseckey)}} /></td>
            </tr>
        )
        })
    }

    addAllCourse(course) {
        console.log(course.name + "button")
        var sections = course.sections;
        console.log(document.getElementById(course.name + "button").innerHTML);
        if ( document.getElementById(course.name + "button").innerHTML === 'Add All') {
            var newdata = JSON.parse(JSON.stringify(course));
            this.props.callbackFromPlanner(newdata, null, null, null, null);
            Object.keys(sections).forEach(function(key) {
                if (document.getElementById(course.name + key).checked === false) {
                    document.getElementById(course.name + key).checked = true;
                }
                Object.keys(sections[key].subsections).forEach(function(subseckey) {
                    if (document.getElementById(course.name + key + subseckey).checked === false) {
                        document.getElementById(course.name + key + subseckey).checked = true;
                    }
                })  
            })
            document.getElementById(course.name + "button").innerHTML = 'Remove All';
        } else {
            this.props.callbackFromRemovePlanner(course, null, null, null, null);
            Object.keys(sections).forEach(function(key) {
                if (document.getElementById(course.name + key).checked === true) {
                    document.getElementById(course.name + key).checked = false;
                }
                Object.keys(sections[key].subsections).forEach(function(subseckey) {
                    if (document.getElementById(course.name + key + subseckey).checked === true) {
                        document.getElementById(course.name + key + subseckey).checked = false;
                    }
                })  
            })
            document.getElementById(course.name + "button").innerHTML = 'Add All';
        }
    }
 
    addCourse(event, course, sections, secname, subsections, subsecname) {
        // console.log(event.target.checked);
        if (event.target.checked === true) {
            console.log("in statement1");
            if (subsections === null && subsecname === null) {
                console.log("in statement2");
                var discussions = sections[secname].subsections;
                var newdis = JSON.parse(JSON.stringify(sections[secname].subsections));
                var newsec = JSON.parse(JSON.stringify(sections[secname]));
                var newdata = JSON.parse(JSON.stringify(course));
                this.props.callbackFromPlanner(newdata, newsec, secname, discussions, null);
                Object.keys(discussions).forEach(function(subseckey) {
                    if (document.getElementById(course.name + secname + subseckey).checked === false) {
                        document.getElementById(course.name + secname + subseckey).checked = true;
                    }
                })
            } else {
                console.log("in statement3");
                var newdis = JSON.parse(JSON.stringify(subsections));
                var newsec = JSON.parse(JSON.stringify(sections));
                var newdata = JSON.parse(JSON.stringify(course));
                this.props.callbackFromPlanner(newdata, newsec, secname, newdis, subsecname);
            }
            
            console.log("in statement4");
            
            // console.log(subsecname);
        } else {
            if (subsections == null && subsecname == null) {
                var discussionss = sections[secname].subsections;
                this.props.callbackFromRemovePlanner(course, null, secname, null, null);
                Object.keys(discussionss).map((subseckey,index) => {
                    if (document.getElementById(course.name + secname + subseckey).checked === true) {
                        //this.props.callbackFromPlanner(course, sections, secname, discussions, subseckey);
                        document.getElementById(course.name + secname + subseckey).checked = false;
                    }
                })
            } else {

                this.props.callbackFromRemovePlanner(course, null, secname, null, subsecname);
                discussionss = sections[secname].subsections;
                var turnsec = true;
                for (let subseckey of Object.keys(discussionss)) {
                    if (document.getElementById(course.name + secname + subseckey).checked === true) {
                        turnsec = false;
                        break;
                    }
                }
                if (turnsec === true) {
                    document.getElementById(course.name + secname).checked = false;
                    this.props.callbackFromRemovePlanner(course, null, secname, null, null);
                }

            }
        }
       
    }

    resetindex() {
        this.setState({
            index: 0
        }
        )
    }

    render() {
        return (
        <>
        <Card style={{width: 'calc(30vw - 2px)', marginDown: '10px', marginTop: '2px', marginLeft: '5px', height: '90%', position: 'fixed', overflow: 'auto'}}>

                <Card.Body>
                <Button size="sm" variant="danger" style={{float: 'right'}}  onClick={() => {this.props.callbackFromGenerate();this.resetindex()}}>Generate Schedule</Button>
                <Card.Title>Course In Cart</Card.Title>
                
                
                {this.getCourses()}
                <Card.Footer>Total Credits: {this.props.creditsdata}</Card.Footer>
                </Card.Body>
        </Card>
        <div style={{width: 'calc(65vw)', marginDown: '10px', marginTop: '30px', marginLeft: 'calc(31vw + 15px)', overflow: 'auto'}}>
       
         <Card.Title>
         <Button size="lg" variant="danger" onClick={() => {this.decreaseindex()}}>  <img src='/previous.png' height="30" width="30" alt="hello"/></Button>
            
        <h style={{marginLeft: 'calc(20vw + 15px)', textAlign: 'center'}}> {this.props.scheduledata.length === 0 ? this.state.index : this.state.index + 1} of {this.props.scheduledata.length} Schedules</h>
        <Button size="lg" variant="danger" style={{ float: 'right'}} onClick={() => {this.increaseindex()}}> <img src='/next.png' height="30" width="30" alt="hello"/></Button>
        </Card.Title>
        {this.showwelcome(this.props.scheduledata)}
        <CardDeck style={{marginTop: '10px'}}>
            {this.showday(this.props.scheduledata)}
        </CardDeck>
        </div>
        </>
        
        )
    }
    increaseindex() {
        let currindex = this.state.index;
        if (currindex < this.props.scheduledata.length - 1) {
            currindex++;
        }
        this.setState({
            index: currindex
        })
    }

    decreaseindex() {
        let currindex = this.state.index;
        if (currindex > 0) {
            currindex--;
        }
        this.setState({
            index: currindex
        })
    }

    showday(scheduledata) {
        let currschedule = scheduledata[this.state.index];
        if (typeof currschedule !== 'undefined') {
            return currschedule.map((currday, index) => {
                let day = "";
                if (index === 0) {
                    day = "Monday";
                } else if (index === 1) {
                    day = "Tuesday";
                } else if (index === 2) {
                    day = "Wednesday";
                } else if (index === 3) {
                    day = "Thursday";
                } else {
                    day = "Friday";
                }
                return (
                    <React.Fragment>
                        <Day title={day} 
                                blocks={currday} 
                                start={7} 
                                end={21} 
                                height={650}
                                width='10vw'/>
                    </React.Fragment>
                    )
            })
        } else {
            
        }
            
            
      
    }
    showwelcome(scheduledata) {
        let currschedule = scheduledata[this.state.index]
        if (typeof currschedule === 'undefined') {
        return (
            <div style={{fontSize: '30px',textAlign:'center'}}>
            <br/>
            Please add the course to the cart and select from the left column 
            <br/><br/><br/>
            <img src='/UWLogo_Center.png' height="300" width="350" alt="hello"/>
            </div>
            
            )
        }
    }

}

export default Sidebar;
