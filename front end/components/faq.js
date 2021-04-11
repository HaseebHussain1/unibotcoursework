import React from 'react';
import '../App.css';
import {auth} from '../helpers/firebase.js'
import axios from 'axios';
import { useParams,useLocation } from "react-router-dom";
import {  Link } from 'react-router-dom';
import * as lib from '../helpers/coursefunctions.js';
/*
Faqs
displays all faq by getting data from api and siplaying faq quesstions
edit button sends user to the edit page of the faq
*/


class Home extends React.Component {

  constructor(props){
  super(props);
  if(props.location.state){
    var sucsessmessage=props.location.state.message
    console.log(sucsessmessage);
    this.setState({succsess:sucsessmessage});
    this.state={

      faqs: [{question:"",answer:""}],
  succsess:sucsessmessage

    }
  }else {
    this.state={

      faqs: [{question:"",answer:""}],
  succsess:{istrue:false,message:""}

    }
  }

console.log(this.state.faqs);


 }
 //{question:String,answer:String}

 componentDidMount() {


   // Changing the state after 2 sec
   // from the time when the component
   // is rendered
   setTimeout(() => {
     const t=this;
     auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
       console.log(idToken);






     axios.get('https://us-central1-test-eixuyp.cloudfunctions.net/simple/faqs',{ headers: {"Authorization" : `${idToken}`} })
       .then(function (response) {
         console.log(response);

         t.setState({ faqs: response.data.Faqs });
         console.log(t.state.faqs);
       })
})
   }, 2000)}


  render() {

    return (
      <div className="bdy">
      {lib.displayMessage(this.state.succsess)}

        <div className="center_main">
          <h1 className="centerTitle"> Faqs</h1>
          {this.state.faqs.map((faq, index) => (
              <div className="faqHolder">
                <h2 className ="start"> question: </h2>
                <p className ="start"> {faq.question} </p>
              <div>
              <Link to={{pathname: '/faq/edit',query: { id: faq._id }}} className="editBtn" > edit </Link>
                <br />
                <br/>
        </div>
      </div>


      ))}




  </div>

      </div>
    );
  }
}



export default Home;
