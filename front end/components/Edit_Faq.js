import React from 'react';
import '../App.css';
import axios from 'axios';
import * as lib from '../helpers/coursefunctions.js';
import {auth} from '../helpers/firebase.js'
import {Redirect} from 'react-router-dom';
/*
edit faq by first retriving data from nodejs api and then when the user updates
the form the state updates
and the update button triggeres a function which sends new data to node js
*/

class EditFaq extends React.Component {
  constructor(props){

  }

    //{question:String,answer:String}
    render() {

  
    }
  }



  export default EditFaq;
