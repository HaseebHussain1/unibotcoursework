import React from 'react';
import logo from '../images/logo.svg';
import '../App.css';

import axios from 'axios';
import { useParams,useLocation } from "react-router-dom";
import {  Link } from 'react-router-dom';
import {auth} from '../helpers/firebase.js'
import * as lib from '../helpers/coursefunctions.js';
/*all Courses
displays all Courses by sending api call
if edit is clicks redirects to course edit page

*/


class Home extends React.Component {

  constructor(props){
  super(props);
  var sucsessmessage={istrue:false,message:""}
  if(props.location.state){
     sucsessmessage=props.location.state.message
  }
  this.state={
    error:{istrue:false,message:""},
    succsess:sucsessmessage,
    courses:[]


  }
  console.log(this.props.location);

 }
 //{question:String,answer:String}

 componentDidMount() {




   setTimeout(() => {
     const thisComp=this;
     auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
       console.log(idToken);


     axios.get('https://us-central1-test-eixuyp.cloudfunctions.net/simple/courses',{ headers: {"Authorization" : `${idToken}`} })
       .then(function (response) {
         console.log(response);

         thisComp.setState({ courses: response.data.courses });
         console.log(thisComp.state.courses);
       })
})
   }, 2000)}



   scape=(event)=>{
     auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
       console.log(idToken);


     axios.get('https://us-central1-test-eixuyp.cloudfunctions.net/simple/scrape',{ headers: {"Authorization" : `${idToken}`} })
       .then(function (response) {

       })
   })}
  render() {

    return (
      <div className="bdy">
      {lib.displayMessage(this.state.succsess)}

         <div className="center_main">
            <h1 className="centerTitle"> Courses</h1>
            <input type="button" name="tags" value="scrape" onClick={(e) => this.scrape(e)}/>
            {this.state.courses.map((course, index) => (
            <div className="courseHolder">
               <h2 className ="start">  course name</h2>
               <p className ="start"> {course.course_name}</p>
               <br/>
               <br/>
               <Link to={{pathname: '/course',query: { id: course._id }}} className="editBtn"> edit </Link>
            </div>
            ))}
         </div>
      </div>
    );
  }
}



export default Home;
