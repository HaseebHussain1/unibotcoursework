import React from 'react';
import '../App.css';

import axios from 'axios';

import {auth} from '../helpers/firebase.js'
import {signInWithEmailAndPassword} from 'firebase/auth'
import {useAuthValue} from '../helpers/AuthContext'
import {AuthProvider} from '../helpers/AuthContext'
import { collection,addDoc,doc,setDoc } from "firebase/firestore"
import {db} from '../helpers/firebase.js'
import * as lib from '../helpers/coursefunctions.js';

/*login
user enters email and pass and it is sent to firebase auth to validate and if correct then user is logged in
*/
class Registration extends React.Component {
  constructor(props){
  super(props);



  this.state={
  username:'',
  password:'',
  loginErrorMessage:'',
  loggedin:true,
  currentUser:null,
  redirect:false
  }

}
// when username or pass it updates in state
handleChange=(event)=>{
console.log(event.target.name);
   if(event.target.type==="text"){
       this.setState({username: event.target.value});
       this.setState({loggedin:false});

     }
     else if(event.target.type==="password"){
       this.setState({password: event.target.value});
}


}

handleLogin=()=>{
  const getToken = async (uid,role) => {    await setDoc(doc(db, "users", uid), {
    role:role
  });}
console.log(this.state.retype);
  var t=this;
  if(this.state.username==''||this.state.password=='' ){

  }else{

    signInWithEmailAndPassword(auth, this.state.username, this.state.password)
      .then(() => {
        console.log(auth.currentUser);
    // redirect to Home
this.setState({redirect:true});
  getToken(auth.currentUser.uid,"Admin");

      })

  }

 // check email validation
 //

}
render() {
  return (
    <div className="bdy">
    {lib.redirect(this.state.redirect)}
     <div className="center_main">
        <h1 className="centerTitle"> chatbot</h1>
        <div>

        Username &nbsp; &nbsp;
        <input type="text" name="title"
    onChange={this.handleChange}/>
      </div>
      <div style={{ marginTop: 10 }}>
        Password &nbsp; &nbsp;
        <input type="password" onChange= {this.handleChange.bind(this)} autoComplete="new-password" />
      </div>
    <br />
      <input type="button" value="login" onClick={this.handleLogin} /><br />
        </div>
     </div>

  );
}
  }




export default Registration;
