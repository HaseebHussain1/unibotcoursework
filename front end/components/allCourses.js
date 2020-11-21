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


class allCourses extends React.Component {

  constructor(props){

 }
 //{question:String,answer:String}





  render() {


  }
}



export default allCourses;
