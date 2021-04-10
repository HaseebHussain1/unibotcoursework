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
    super(props);
    this.state={

      id:"",
      faq: {question:"",answer:""},
      redirect:false,
      error:{istrue:false,message:""},
      succsess:{istrue:false,message:""},
      url:"/faq"


    }
    if(this.props.location.query){
      this.state.id=this.props.location.query.id;
    }else{
      console.log(this.state.redirect+" red");
this.state.redirect=true;
console.log(this.state.redirect+" red");

}
    console.log(this.state.id);


  }
  componentDidMount() {



    // Changing the state after 2 sec
    // from the time when the component
    // is rendered
    setTimeout(() => {
      const t=this;
      auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        console.log(idToken);







      axios.post('https://us-central1-test-eixuyp.cloudfunctions.net/simple/faq/edit',{id:t.state.id},{ headers: {"Authorization" : `${idToken}`} })
      .then(function (response) {

        t.setState({faq:response.data.faq})

console.log(t.state.faq);
      })
    })

    }, 2000)}
    handleChange=(event,i)=>{
      var faq=this.state.faq;
if(event.target.name==="question"){
  faq.question=event.target.value;
}
if(event.target.name==="answer"){
  faq.answer=event.target.value;
}
      this.setState({faq:faq});


    }




  update=(event)=>{
    this.setState({succsess:{istrue:false,message:""}});
    this.setState({error:{istrue:false,message:""}});
var context=this;

if(true){
  auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    console.log(idToken);







axios.post('https://us-central1-test-eixuyp.cloudfunctions.net/simple/faq/edit/update',{id:context.state.id,faq:context.state.faq},{ headers: {"Authorization" : `${idToken}`} })
.then(function (response) {

context.setState({succsess:{istrue:true,message:"faq Updated"}})






}).catch(e=>{
  if(e.response.status==500) {
    context.setState({error:{istrue:true,message:"server error"}})
  }


})
})
}
  }
    //{question:String,answer:String}
    render() {

      var context=this;


      return (
        <div className="bdy">
{lib.redirectWithmessage(this.state.redirect,this.state.redirectUrl,this.state.succsess)}

        <div className="center_main">
        {lib.displayMessage(this.state.succsess)}
        <div>{lib.displayMessage(this.state.error)}</div>

        <h1 className="centerTitle">Faq edit </h1>


          <div className="faqElement">

          question: <br/>
          <textarea name="question" rows="5" cols="40" value= {this.state.faq.question} onChange={(e) => this.handleChange(e)}></textarea>
        <br/>  answer: <br/>
          <textarea name="answer" rows="5" cols="40" value= {this.state.faq.answer} onChange={(e) => this.handleChange(e)}></textarea>





<br/>

          <input type="button" name="update" value="update" onClick={(e) => this.update(e)}/>
</div>
        </div>

</div>


      );
    }
  }



  export default EditFaq;
