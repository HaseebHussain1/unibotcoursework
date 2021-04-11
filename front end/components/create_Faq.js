import React from 'react';

import '../App.css';

import axios from 'axios';
import * as lib from '../helpers/coursefunctions.js';
import {auth} from '../helpers/firebase.js'
import {Redirect} from 'react-router-dom';
/* creating a faqElement by sending data to node js api
if the faq is created the user is redirected to all faqs
*/

class Create_faq extends React.Component {
  constructor(props){
    super(props);
    this.state={
faq: {question:"",answer:""},
error:{istrue:false,message:""},
succsess:{istrue:false,message:""},
redirect:false,
redirectUrl:"/faq"
    }


  }

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
if(true){
var context=this;
try {
  auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
    console.log(idToken);


axios.post('https://us-central1-test-eixuyp.cloudfunctions.net/simple/faq/create',{faq:context.state.faq},{ headers: {"Authorization" : `${idToken}`} })
.then(function (response) {
context.setState({succsess:{istrue:true,message:"Faq created"}})
context.setState({redirect:true})


console.log(response);



}).catch(e=>{
  if(e.response.status==406){
    console.log("e");
context.setState({error:{istrue:true,message:"Faq empty"}})
  }else if(e.response.status==500) {
    context.setState({error:{istrue:true,message:"server error"}})
  }

})
})
} catch (e) {
  console.log(e+"eeeeeee");
  console.error(e+"eeeeeee");
}

}
  }
    //{question:String,answer:String}
    render() {

      return (

<div className="bdy">


{lib.redirectWithmessage(this.state.redirect,this.state.redirectUrl,this.state.succsess)}

<div className="center_main">
{lib.displayMessage(this.state.succsess)}
<div>{lib.displayMessage(this.state.error)}</div>
        <h1 className="centerTitle">Faq create </h1>




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



  export default Create_faq;
