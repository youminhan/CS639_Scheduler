import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Cart from './Cart';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Plannersidebar from './Plannersidebar';
import fallback from './fallback'


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      selectedCourses: {},
      scheduledCourses: {},
      subjects: [],
      searchMode : [],
      printSchedule: [],
      totalCredits: 0,
      toShow: false,
      showCart: false,
      showPalnner: false
    };
    this.checkConflicts = this.checkConflicts.bind(this);
  }

  functiona(){
    this.setState({
      toShow: true
    })
  }
  

  courseareaCallback = (course, sections, secname, subsections, subsecname) => {
    
    var currselect = Object.assign({}, this.state.selectedCourses);
    if (secname === null) {
      let newcour = {};
      newcour.credits = course.credits;
      newcour.name = course.name;
      newcour.number = course.number;
      newcour.sections = course.sections;
      currselect[course.number] = newcour;
    }
    else if (subsecname === null) {
      if (currselect[course.number]) {
        var newcour = Object.assign({}, currselect[course.number]);
        newcour.sections[secname] = course.sections[secname];
        currselect[course.number] = newcour;
      } else {
        let newcour = {};
        newcour.credits = course.credits;
        newcour.name = course.name;
        newcour.number = course.number;
        newcour.sections = {[secname]:course.sections[secname]};
        currselect[course.number] = newcour;
      }
    } else {
      if (currselect[course.number]) {
        var currCour = Object.assign({}, currselect[course.number]);
        if (Object.keys(currCour.sections).includes(secname)) {
          currCour.sections[secname].subsections[subsecname] = subsections[subsecname]; 
        } else {
          var newSec = {};
          newSec.time = course.sections[secname].time;
          newSec.instructor = course.sections[secname].instructor;
          newSec.subsections = {[subsecname]: subsections[subsecname]};
          currCour.sections[secname] = newSec;
        }
        currselect[course.number] = currCour;
      } else {
        let newSec = {};
        newSec.credits = course.credits;
        newSec.name = course.name;
        newSec.number = course.number;
        var newSubsec = {};
        newSubsec.time = course.sections[secname].time;
        newSubsec.instructor =  course.sections[secname].instructor;
        newSubsec.subsections = {[subsecname]: subsections[subsecname]};
        newSec.sections = {[secname]:newSubsec};
        currselect[course.number] = newSec;
      }  
    }    
    this.setState({
      selectedCourses: currselect
    })
  }

  componentDidMount() {
    // fetch('https://mysqlcs639.cs.wisc.edu/classes').then(
    //   res => res.json()
    // ).then(data => this.setState({allCourses: data, filteredCourses: data, subjects: this.getSubjects(data), searchMode: this.getSearchmode()}));
    this.setState({allCourses: fallback, filteredCourses: fallback, subjects: this.getSubjects(fallback)});
  }

  getSearchmode(){
    let searchMode = [];
    searchMode.push("Fit all the tags");
    searchMode.push("Fit at least one of the tag");
    return searchMode;
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(const course of Object.values(data)) {
      if(subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  cartCallback = (course, sections, secname, subsections, subsecname) => {
    var currselect = Object.assign({}, this.state.selectedCourses);
    if (secname === null) {
      delete currselect[course.number];
    } else if (subsecname === null) {
      delete currselect[course.number].sections[secname];
      if (Object.keys(currselect[course.number].sections).length === 0) {
        delete currselect[course.number];
      } 
    } else {
      delete currselect[course.number].sections[secname].subsections[subsecname];
      if (Object.keys(currselect[course.number].sections[secname].subsections).length === 0) {
        delete currselect[course.number].sections[secname];
        if (Object.keys(currselect[course.number].sections).length === 0) {
          delete currselect[course.number];
        }
      } 
    }
    this.setState({
      selectedCourses: currselect
    })
  }

  plannerCallback = (course, sections, secname, subsections, subsecname) => {
   
    var currselect = Object.assign({}, this.state.scheduledCourses);
    let currcredits = this.state.totalCredits;
    
    if (secname === null) {
      currcredits = course.credits + this.state.totalCredits;
      let newcour = {};
      newcour.credits = course.credits;
      newcour.name = course.name;
      newcour.number = course.number;
      newcour.sections = course.sections;
      currselect[course.number] = newcour;
    }
    else if (subsecname === null) {
      if (currselect[course.number]) {
        var newcour = Object.assign({}, currselect[course.number]);
        newcour.sections[secname] = course.sections[secname];
        currselect[course.number] = newcour;
      } else {
        currcredits = course.credits + this.state.totalCredits;
        let newcour = {};
        newcour.credits = course.credits;
        newcour.name = course.name;
        newcour.number = course.number;
        newcour.sections = {[secname]:course.sections[secname]};
        currselect[course.number] = newcour;
      }
    } else {
      if (currselect[course.number]) {
        var currCour = Object.assign({}, currselect[course.number]);
        if (Object.keys(currCour.sections).includes(secname)) {
          currCour.sections[secname].subsections[subsecname] = subsections[subsecname]; 
        } else {
          var newSec = {};
          newSec.time = course.sections[secname].time;
          newSec.instructor = course.sections[secname].instructor;
          newSec.subsections = {[subsecname]: subsections[subsecname]};
          currCour.sections[secname] = newSec;
        }
        currselect[course.number] = currCour;
      } else {
        currcredits = course.credits + this.state.totalCredits;
        let newSec = {};
        newSec.credits = course.credits;
        newSec.name = course.name;
        newSec.number = course.number;
        var newSubsec = {};
        newSubsec.time = course.sections[secname].time;
        newSubsec.instructor =  course.sections[secname].instructor;
        newSubsec.subsections = {[subsecname]: subsections[subsecname]};
        newSec.sections = {[secname]:newSubsec};
        currselect[course.number] = newSec;
      }  
    }    
    
    this.setState({
      scheduledCourses: currselect,
      totalCredits: currcredits
    })
   
  }

  plannerRemoveCallback = (course, sections, secname, subsections, subsecname) => {
    let currcredits = this.state.totalCredits;
    var currselect = Object.assign({}, this.state.scheduledCourses);
    if (secname === null) {
      console.log("currselect")
      console.log(typeof currselect[course.number])
      if (typeof currselect[course.number] !== 'undefined') {
        delete currselect[course.number];
        currcredits = this.state.totalCredits - course.credits;
      } else {
        return;
      }
      
    } else if (subsecname === null) {
      console.log("remove subsec");
      console.log(this.state.scheduledCourses);
      if (typeof currselect[course.number] !== 'undefined') {
        delete currselect[course.number].sections[secname];
      } else {
        return;
      }
      if (Object.keys(currselect[course.number].sections).length === 0) {
        currcredits = this.state.totalCredits - course.credits;
        delete currselect[course.number];
      } 
    } else {
      delete currselect[course.number].sections[secname].subsections[subsecname];
      if (Object.keys(currselect[course.number].sections[secname].subsections).length === 0) {
        delete currselect[course.number].sections[secname];
        if (Object.keys(currselect[course.number].sections).length === 0) {
          currcredits = this.state.totalCredits - course.credits;
          delete currselect[course.number];
        }
      } 
    }
    this.setState({
      scheduledCourses: currselect,
      totalCredits: currcredits
    })
   
  }

  generateSchedule = () => {
    // this.checkConflicts();
    var avaibleSchedule = [];
    let timeBlocks = [];
    var currselect = Object.assign({}, this.state.scheduledCourses);
    var courseslist = this.state.scheduledCourses;
    Object.keys(courseslist).forEach(function(key) {
      var courseTimeBlocks = []
      var gensections = courseslist[key].sections;
      Object.keys(gensections).forEach(function(seckey) {
        var gensubsections = gensections[seckey].subsections;
        if (Object.keys(gensubsections).length === 0) {
          courseTimeBlocks.push([courseslist[key].number + seckey, gensections[seckey]]);
        } else {
          Object.keys(gensubsections).forEach(function(diskey) {
            courseTimeBlocks.push([courseslist[key].number + seckey, gensections[seckey], courseslist[key].number + diskey, gensubsections[diskey]]);
          })
        }
      })
      timeBlocks.push(courseTimeBlocks);
    })
    

    
    for (let key of timeBlocks) { 
      var currcourse = key;
      
      //Get each course, for each section
      if (avaibleSchedule.length === 0) {
        
        // each section
        for (let coursekey of currcourse) {
          
          
         
          var monday = [];
          var tuesday = [];
          var wednesday = [];
          var thursday = [];
          var friday = [];
          var currlect = coursekey[1].time;
          //section single
          for (let timeblock of Object.entries(currlect))  {
           
            var time = timeblock[1].split(" - ");
            var slot = {};
            for (let index = 0; index < time.length; index++) {
              var times = time[index].slice(0, -2).split(":");
              var hour = parseInt(times[0])
              var minute = parseFloat(times[1]) / parseFloat(60);
              var converTime = hour + minute;
              if (hour !== 12 && time[index].slice(-2) === "pm"){
                converTime += 12;
              }
              time[index] = converTime;
            }
            
            time = JSON.parse(JSON.stringify(time));
           
            if (timeblock[0] === 'monday') {
              slot.name = coursekey[0];
              slot.start = time[0];
              slot.end = time[1];
              slot.time = timeblock[1];
              monday.push(JSON.parse(JSON.stringify(slot)));
            } else if (timeblock[0] === 'tuesday') {
              slot.name = coursekey[0];
              slot.start = time[0];
              slot.end = time[1];
              slot.time = timeblock[1]
              tuesday.push(JSON.parse(JSON.stringify(slot)));
            } else if (timeblock[0] === 'wednesday') {
              slot.name = coursekey[0];
              slot.start = time[0];
              slot.end = time[1];
              slot.time = timeblock[1];
              wednesday.push(JSON.parse(JSON.stringify(slot)));
            } else if (timeblock[0] === 'thursday') {
              slot.name = coursekey[0];
              slot.start = time[0];
              slot.end = time[1];
              slot.time = timeblock[1];
              thursday.push(JSON.parse(JSON.stringify(slot)));
            } else if (timeblock[0] === 'friday') {
              slot.name = coursekey[0];
              slot.start = time[0];
              slot.end = time[1];
              slot.time = timeblock[1];
              friday.push(JSON.parse(JSON.stringify(slot)));
            }
          }
          if (typeof coursekey[2] !== 'undefined') {
            var currdis = coursekey[3].time;
            var disslot = {};
            

            for (let distimeblock of Object.entries(currdis)) {
              var distime = distimeblock[1].split(" - ");
              for (let index = 0; index < distime.length; index++) {
                
                var distimes = distime[index].slice(0, -2).split(":");
               
                var dishour = parseInt(distimes[0])
                var disminute = parseFloat(distimes[1]) / parseFloat(60);
                var disconverTime = dishour + disminute;
                if (dishour !== 12 && distime[index].slice(-2) === "pm"){
                  disconverTime += 12;
                }
                distime[index] = disconverTime;
                
              }
              
             
              
              distime = JSON.parse(JSON.stringify(distime));
              if (distimeblock[0] === 'monday') {
                disslot.name = coursekey[2];
                disslot.start = distime[0];
                disslot.end = distime[1];
                disslot.time = distimeblock[1];
                monday.push(JSON.parse(JSON.stringify(disslot)));
              } else if (distimeblock[0] === 'tuesday') {
                disslot.name = coursekey[2];
                disslot.start = distime[0];
                disslot.end = distime[1];
                disslot.time = distimeblock[1];
                tuesday.push(JSON.parse(JSON.stringify(disslot)));
              } else if (distimeblock[0] === 'wednesday') {
                disslot.name = coursekey[2];
                disslot.start = distime[0];
                disslot.end = distime[1];
                disslot.time = distimeblock[1];
                wednesday.push(JSON.parse(JSON.stringify(disslot)));
              } else if (distimeblock[0] === 'thursday') {
                disslot.name = coursekey[2];
                disslot.start = distime[0];
                disslot.end = distime[1];
                disslot.time = distimeblock[1];
                thursday.push(JSON.parse(JSON.stringify(disslot)));
              } else if (distimeblock[0] === 'friday') {
                disslot.name = coursekey[2];
                disslot.start = distime[0];
                disslot.end = distime[1];
                disslot.time = distimeblock[1];
                friday.push(JSON.parse(JSON.stringify(disslot)));
              }
              
            }
            
            
          } 
            var newschedule = [];
            newschedule.push(JSON.parse(JSON.stringify(monday)));
            newschedule.push(JSON.parse(JSON.stringify(tuesday)));
            newschedule.push(JSON.parse(JSON.stringify(wednesday)));
            newschedule.push(JSON.parse(JSON.stringify(thursday)));
            newschedule.push(JSON.parse(JSON.stringify(friday)));
            avaibleSchedule.push(JSON.parse(JSON.stringify(newschedule)));
          
          
          
        }
      } else {
        var tempavaibleSchedule = [];
        var counter = 0;
        for (var i = 0; i < avaibleSchedule.length; i++) {
          
          var schedule = avaibleSchedule[i];
          for(let coursekey of currcourse) {
            counter++;
            var isAllow = true;
           
            slot = {};
            monday = JSON.parse(JSON.stringify(schedule[0]));
            tuesday = JSON.parse(JSON.stringify(schedule[1]));
            wednesday = JSON.parse(JSON.stringify(schedule[2]));
            thursday = JSON.parse(JSON.stringify(schedule[3]));
            friday = JSON.parse(JSON.stringify(schedule[4]));
            currlect = coursekey[1].time;
            for(let timeblock of Object.entries(currlect)) {
              time = timeblock[1].split(" - ");
              for (let index = 0; index < time.length; index++) {
                times = time[index].slice(0, -2).split(":");
                hour = parseInt(times[0])
                minute = parseFloat(times[1]) / parseFloat(60);
                converTime = hour + minute;
                if (hour !== 12 && time[index].slice(-2) === "pm"){
                  converTime += 12;
                }
                time[index] = converTime;
              }
              
              
              if (timeblock[0] === 'monday') {
                slot.name = coursekey[0];
                slot.start = time[0];
                slot.end = time[1];
                slot.time = timeblock[1];
                if (this.checkConflicts(monday, slot) === true) {
                  monday.push(JSON.parse(JSON.stringify(slot)));
                } else {
                  isAllow = false;
                  break;
                }
              } else if (timeblock[0] === 'tuesday') {
                slot.name = coursekey[0];
                slot.start = time[0];
                slot.end = time[1];
                slot.time = timeblock[1];
                if (this.checkConflicts(tuesday, slot) === true) {
                  tuesday.push(JSON.parse(JSON.stringify(slot)));
                } else {
                  isAllow = false;
                  break;
                }
              } else if (timeblock[0] === 'wednesday') {
                slot.name = coursekey[0];
                slot.start = time[0];
                slot.end = time[1];
                slot.time = timeblock[1];
                if (this.checkConflicts(wednesday, slot) === true) {
                  wednesday.push(JSON.parse(JSON.stringify(slot)));
                } else {
                  isAllow = false;
                  break;
                }
              } else if (timeblock[0] === 'thursday') {
                slot.name = coursekey[0];
                slot.start = time[0];
                slot.end = time[1];
                slot.time = timeblock[1];
                if (this.checkConflicts(thursday, slot) === true) {
                  thursday.push(JSON.parse(JSON.stringify(slot)));
                } else {
                  isAllow = false;
                  break;
                }
              } else if (timeblock[0] === 'friday') {
                slot.name = coursekey[0];
                slot.start = time[0];
                slot.end = time[1];
                slot.time = timeblock[1];
                if (this.checkConflicts(friday, slot) === true) {
                  friday.push(JSON.parse(JSON.stringify(slot)));
                } else {
                  isAllow = false;
                  break;
                }
              }
              
            
            
            }
            if (isAllow === true && typeof coursekey[2] !== 'undefined') {
              currdis = coursekey[3].time;
              disslot = {};
              for (let distimeblock of Object.entries(currdis)) {
                distime = distimeblock[1].split(" - ");
                for (let index = 0; index < distime.length; index++) {
                  distimes = distime[index].slice(0, -2).split(":");
  
                  dishour = parseInt(distimes[0])
                  disminute = parseFloat(distimes[1]) / parseFloat(60);
                  disconverTime = dishour + disminute;
                  if (dishour !== 12 && distime[index].slice(-2) === "pm"){
                    disconverTime += 12;
                  }
                  distime[index] = disconverTime;
                }
                
                if (distimeblock[0] === 'monday') {
                  disslot.name = coursekey[2];
                  disslot.start = distime[0];
                  disslot.end = distime[1];
                  disslot.time = distimeblock[1];
                  if (this.checkConflicts(monday, disslot) === true) {
                    monday.push(JSON.parse(JSON.stringify(disslot)));
                  } else {
                    isAllow = false;
                    break;
                  }
                } else if (distimeblock[0] === 'tuesday') {
                  disslot.name = coursekey[2];
                  disslot.start = distime[0];
                  disslot.end = distime[1];
                  disslot.time = distimeblock[1];
                  if (this.checkConflicts(tuesday, disslot) === true) {
                    tuesday.push(JSON.parse(JSON.stringify(disslot)));
                  } else {
                    isAllow = false;
                    break;
                  }
                } else if (distimeblock[0] === 'wednesday') {
                  disslot.name = coursekey[2];
                  disslot.start = distime[0];
                  disslot.end = distime[1];
                  disslot.time = distimeblock[1];
                  if (this.checkConflicts(wednesday, disslot) === true) {
                    wednesday.push(JSON.parse(JSON.stringify(disslot)));
                  } else {
                    isAllow = false;
                    break;
                  }
                } else if (distimeblock[0] === 'thursday') {
                  disslot.name = coursekey[2];
                  disslot.start = distime[0];
                  disslot.end = distime[1];
                  disslot.time = distimeblock[1];
                  if (this.checkConflicts(thursday, disslot) === true) {
                    thursday.push(JSON.parse(JSON.stringify(disslot)));
                  } else {
                    isAllow = false;
                    break;
                  }
                } else if (distimeblock[0] === 'friday') {
                  disslot.name = coursekey[2];
                  disslot.start = distime[0];
                  disslot.end = distime[1];
                  disslot.time = distimeblock[1];
                  if (this.checkConflicts(friday, disslot) === true) {
                    friday.push(JSON.parse(JSON.stringify(disslot)));
                  } else {
                    isAllow = false;
                    break;
                  }
                }
                
              }
              
              
            } 
            if (isAllow === true) {
              newschedule = [];
              newschedule.push(JSON.parse(JSON.stringify(monday)));
              newschedule.push(JSON.parse(JSON.stringify(tuesday)));
              newschedule.push(JSON.parse(JSON.stringify(wednesday)));
              newschedule.push(JSON.parse(JSON.stringify(thursday)));
              newschedule.push(JSON.parse(JSON.stringify(friday)));
              tempavaibleSchedule.push(JSON.parse(JSON.stringify(newschedule)));
            }
            
            
          }

        }
        avaibleSchedule = JSON.parse(JSON.stringify(tempavaibleSchedule));
      }

    }
    this.setState({
      printSchedule: avaibleSchedule
    })
    console.log("final result")
    console.log(this.state.printSchedule)
    console.log("final result end")
  }

  checkConflicts(schedule, slot) {
    var iscorrect = true;
    for (let timeblock of schedule) {
      if (timeblock.end < slot.start || timeblock.start > slot.end) {
        iscorrect = true;
      } else {
        iscorrect = false;
        break;
      } 
    } 
    return iscorrect;
  } 

  getContent(){
    if (this.state.showCart) {
      return <Cart data={this.state.selectedCourses} callbackFromCart = {this.cartCallback}  style={{position:'absolute', zIndex: -1,}}/>
    } else if (this.state.showPalnner) {
      return (
        <Plannersidebar data={this.state.selectedCourses} scheduledata={this.state.printSchedule} creditsdata={this.state.totalCredits} callbackFromRemovePlanner = {this.plannerRemoveCallback} callbackFromGenerate= {this.generateSchedule} callbackFromPlanner = {this.plannerCallback}  style={{position:'absolute', zIndex: -1,}}/>
      )
    } else {
      return (
        <>
        <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} searchMode={this.state.searchMode}/>
        <div style={{marginLeft: '20vw'}}>
          <CourseArea style={{position:'absolute', zIndex: -1, marginTop: '50px'}} data={this.state.filteredCourses} callbackFromCourseArea = {this.courseareaCallback}/>
        </div>
        </>
      )
    }
  }

  changeContent(cart,planner) {
    this.setState({
      showCart: cart,
      showPalnner: planner
    })
  }

  deleteList = () => {
    this.setState({
      scheduledCourses: {},
      totalCredits: 0
    })
  }

  render() {
    return (    
      
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Navbar  bg="dark" variant="dark" expand="lg" style={{position:'sticky', zIndex: 100, top: 0}} >
          <Navbar.Brand><a href="https://www.wisc.edu" target="_blank" rel="noopener noreferrer"><img src='https://raw.githubusercontent.com/youminhan/CS639_Scheduler/master/public/UWlogo.png' height="42" width="124" alt="hello"/></a></Navbar.Brand>
          <Navbar.Brand >Course Search & Enroll</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">  
              <Nav.Link onClick={()=> this.changeContent(false, false)}>Search</Nav.Link>
              <Nav.Link onClick={()=> this.changeContent(true, false)}>Cart</Nav.Link>
              <Nav.Link onClick={()=> {this.changeContent(false, true); this.deleteList();}}>Planner</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.getContent()}
      </>
    )
  }
}

export default App;
