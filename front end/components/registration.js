import React from 'react';

import '../App.css';

import axios from 'axios';
import './chatbot.css';
import {auth} from '../helpers/firebase.js'
import {createUserWithEmailAndPassword, sendEmailVerification} from 'firebase/auth'
import {useAuthValue} from '../helpers/AuthContext'
import {AuthProvider} from '../helpers/AuthContext'

class Registration extends React.Component {
  constructor(props){
    super(props);



    this.state={
      error:{istrue:false,message:""},
      succsess:{istrue:false,message:""},
      username:'',
      password:'',
      retype:''

    }

  }
  handleChange=(event)=>{
    console.log(event.target.name);
    if(event.target.type==="text"){
      this.setState({username: event.target.value});

    }else if (event.target.name==="retype") {
      console.log(event.target.value);
      this.setState({retype: event.target.value});
    }
    else if(event.target.type==="password"){
      this.setState({password: event.target.value});
    }


  }
  handleLogin=()=>{
    console.log(this.state.retype);

    if(this.state.username==''||this.state.password=='' ||this.state.password!=this.state.retype){

    }else{
      // add auth
      const t=this;
      axios.post('https://us-central1-test-eixuyp.cloudfunctions.net/simple/userReg',{id:auth.currentUser.uid})
      .then(function (response) {
        if(response.data.user){
          sendEmailVerification(auth.currentUser)
          //user added msg
          this.setState({succsess:{istrue:true,message:"user added"}});


        }


        console.log(response);


      }).catch(e=>{
        if(e.response.status==500) {
          this.setState({error:{istrue:true,message:"server error"}})
        }


      })
      // createUserWithEmailAndPassword(auth, this.state.username, this.state.password)
      //   .then(() => {
      //     console.log(auth.currentUser);
      //     sendEmailVerification(auth.currentUser)
      //     .then(() => {
      //
      //     }).catch((err) => alert(err.message))
      //   })

    }
    // check email validation
    //

  }
  render() {
    return (
      <div className="bdy">
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
      <div style={{ marginTop: 10 }}>
      Password &nbsp; &nbsp;
      <input type="password" name="retype" onChange= {this.handleChange.bind(this)} autoComplete="new-password" />
      </div>
      <br />
      <input type="button" value="login" onClick={this.handleLogin} /><br />
      </div>
      </div>

    );
  }
}




export default Registration;
