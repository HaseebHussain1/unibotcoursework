import React from 'react';

import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch, withAxios } from 'react-axios'

import  Edit_course from './components/edit_course'
import  Create_course from './components/create_course.js'
import  Faq from './components/faq.js'
import  Faqsingle from './components/Edit_Faq.js'
import  Create_faq from './components/create_Faq.js'
import  Registration from './components/registration.js'
import  Login from './components/login.js'
import  Chatbot from './components/chatbot'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import ProtectedRoute from './helpers/protected_Route';
import AllCourses from './components/allCourses.js';



import {auth} from './helpers/firebase.js'



import {createUserWithEmailAndPassword,onAuthStateChanged, sendEmailVerification,signOut} from 'firebase/auth'
import {useAuthValue} from './helpers/AuthContext'
import {AuthProvider} from './helpers/AuthContext'
import { collection,addDoc,doc,setDoc,getDoc } from "firebase/firestore"
import {db} from './helpers/firebase.js'

class App extends React.Component {

  constructor(props){
  super(props);
  this.state={
  username:'',
  password:'',
  loginErrorMessage:'',
  loggedin:true,
  currentUser:null,
  Adminrole:false
  }
 }


updateUser=(user)=>{
console.log(this.state.Adminrole);
console.log("test456");
  if (user) {
console.log("true user");
        this.setState({currentUser:user});
        this.setState({loggedin:true});



  }else {
    console.log("false user");
    this.setState({currentUser:user});
    this.setState({loggedin:false});
  }


}
updateUserrole=(isAdmin)=>{

    this.setState({Adminrole:isAdmin});



}

handlelogout=(event)=>{
  signOut(auth).then(() => {
    this.setState({password:""});
  console.log("hhh");
}).catch((error) => {
console.log(error);
});


};

  render() {

    const CondtionalNavbar = ()=>{
    return(
    this.state.loggedin
    ?  <ul className="navlist">
          <li><Link to={'/'} className="nav-link"> Home </Link></li>
          <li><Link to={'/create/faq'} className="nav-link">create faq</Link></li>
          <li><Link to={'/faq'} className="nav-link">all faq</Link></li>
          <li><Link to={'/allcourses'} className="nav-link">all courses </Link></li>
          <li><Link to={'/create/course'} className="nav-link"> create course</Link></li>
        </ul>
    :  <ul className="navlist">
          <li><Link to={'/'} className="nav-link"> Home </Link></li>
          <li><Link to={'/registration'} className="nav-link"> reg </Link></li>
        </ul>
    )};

    const CondtionalRoute = ()=>{
    return(
    this.state.loggedin
    ? <input className="logout" type="button" value="logout" onClick={this.handlelogout} />
    :  <div>





    </div>
    )};
   return (
    <Router>
    <AuthProvider value={this.state.currentUser} updateUser={this.updateUser} updateUserrole={this.updateUserrole}>
        <div className="root">
        <div className="header">
        <h2 className="centertext">unibot</h2>

<nav >
{CondtionalNavbar()}
</nav> {CondtionalRoute()} <br />

          </div>
          <Switch>
              <Route exact path='/' component={Chatbot} />
              <Route exact path='/registration' component={Registration} />
              <Route exact path='/login' component={Login} />
              <ProtectedRoute exact path='/allcourses'user={this.state.currentUser} role="Admin" loggedin={this.state.loggedin} isAdmin={this.state.Adminrole} component={AllCourses} />
              <ProtectedRoute exact path='/faq'user={this.state.currentUser} loggedin={this.state.loggedin} handleLogout={this.handlelogout}  component={Faq} />
              <ProtectedRoute exact path='/faq/edit' user={this.state.currentUser} loggedin={this.state.loggedin} handleLogout={this.handlelogout}    component={Faqsingle} />
              <ProtectedRoute exact path='/create/course' user={this.state.currentUser} loggedin={this.state.loggedin} handleLogout={this.handlelogout}  component={Create_course} />
              <ProtectedRoute exact path='/create/faq' user={this.state.currentUser} loggedin={this.state.loggedin} handleLogout={this.handlelogout}   component={Create_faq} />
              <ProtectedRoute exact path='/course' user={this.state.currentUser} loggedin={this.state.loggedin} handleLogout={this.handlelogout}  component={Edit_course} />
          </Switch>
        </div>
         </AuthProvider>
      </Router>
    )
  }
}




export default App;
