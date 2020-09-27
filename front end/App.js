import React from 'react';

import { AxiosProvider, Request, Get, Delete, Head, Post, Put, Patch, withAxios } from 'react-axios'










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
