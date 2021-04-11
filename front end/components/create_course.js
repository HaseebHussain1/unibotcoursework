import React from 'react';
import '../App.css';
import axios from 'axios';
import * as lib from '../helpers/coursefunctions.js';
import {auth} from '../helpers/firebase.js'
import {Redirect} from 'react-router-dom';
/* create courses
creates new course and adds it to db by sending to node api
the add remove functions set state based on events
create function sends info to backend and depending on response outputs error or redirects to all courses

*/
class Create_course extends React.Component {
  constructor(props){
    super(props);
    this.state={
      error:{istrue:false,message:""},
      succsess:{istrue:false,message:"false"},
      redirectUrl:"/allcourses",
      redirect:true,
      course:{
        course_name:  "", // String is shorthand for {type: String}
        course_type: "",
        duration:   "",
        ucas_code:  "", // String is shorthand for {type: String}
        start_date: "",
        supervisor: "",
        overview:   "",
        location:   "",
        cost: { uk: "", eu: "" },
        requirments: {
          basic: ["",""],
          international: [""],
          experience: [""]
        },
        faq: [{question:"",answer:""}],
        modules:[{name:"",mtype:""}],
        tags:[""]
      }


    }
  }


  handleChange=(event,i)=>{

    this.setState({course:lib.handleChange(event,i,this.state.course)});


  }
  add=(event,i)=>{


    this.setState({course:lib.add(event,i,this.state.course)});


  }
  remove=(event,i)=>{


    this.setState({course:lib.remove(event,i,this.state.course)});


  }



  create=(event)=>{

var context=this;
context.setState({error:{istrue:false,message:""}})
context.setState({succsess:{istrue:false,message:""}})
    if(lib.update(this.state.course)===true){
      auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        console.log(idToken);




      axios.post('https://us-central1-test-eixuyp.cloudfunctions.net/simple/courses/create',{course:this.state.course},{ headers: {"Authorization" : `${idToken}`} })
      .then(function (response) {

context.setState({succsess:{istrue:true,message:"course created"}})




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


    return (
      <div className="bdy">
      {lib.redirectWithmessage(this.state.redirect,this.state.redirectUrl,this.state.succsess)}

      <div className="center_main">
      {lib.displayMessage(this.state.succsess)}
      <div>{lib.displayMessage(this.state.error)}</div>
      <h1 className="centerTitle"> Create Course</h1>
      <div>

      <div >
      <div className="widthtest">

      </div>
      <label>  name </label>
      <input type="text" name="course_name" size="50" className="heighttext" value={this.state.course.course_name} onChange={this.handleChange}/>


      </div>

      <div >
      <br/>
      <label>  course_type </label>


      <input type="text" name="course_type" size="50" className="heighttext" value={this.state.course.course_type} onChange={this.handleChange}/>




      </div>
      <div >
      <br/>
      <label>  duration </label>


      <input type="text" name="duration" size="50" className="heighttext" value={this.state.course.duration} onChange={this.handleChange}/>



      </div>

      <div >
      <br/>
      <label>  ucas_code </label>


      <input type="text" name="ucas_code" size="50" className="heighttext" value={this.state.course.ucas_code} onChange={this.handleChange}/>




      </div>
      <div >
      <br/>
      <label>  start_date </label>


      <input type="text" name="start_date" size="50" className="heighttext" value={this.state.course.start_date} onChange={this.handleChange}/>




      </div>

      <div >
      <br/>
      <label>  supervisor </label>


      <input type="text" name="supervisor" size="50" className="heighttext" value={this.state.course.supervisor} onChange={this.handleChange}/>



      </div>
      <div >
      <br/>
      <label>  overview </label>


      <input type="text" name="overview" size="50" className="heighttext" value={this.state.course.overview} onChange={this.handleChange}/>



      </div>
      <div >
      <br/>
      <label>  location </label>


      <input type="text" name="location" size="50" className="heighttext" value={this.state.course.location} onChange={this.handleChange}/>


      <br/>


      </div>

      <div>
      cost
      <br/>
      <div >
      <br/>

      <label>  uk </label>


      <input type="text" name="ukcost" size="50" className="heighttext" value={this.state.course.cost.uk} onChange={this.handleChange}/>






      </div>


      <div >
      <br/>
      <label>  eu </label>

      <input type="text" name="eucost" size="50" className="heighttext" value={this.state.course.cost.eu}

      onChange={this.handleChange}/>



      </div>

      </div>
      <div>
      <h2>requirments</h2>


      <div>
      <h3>basic</h3>

      {this.state.course.requirments.basic.map((tag, index) => (
        <div className="center_input">
        <br/>
        <textarea  rows="5" cols="40"  name="basicrequirments"  value={tag} index={index}
        onChange={(e) => this.handleChange(e, index)}></textarea>

        <input type="button" name="brequirments"   className="add_btn" onClick={(e) => this.add(e, index)}/>
        <input type="button" name="brequirments"    className="remove_btn" onClick={(e) => this.remove(e, index)}/>




        </div>


      ))} </div>
      <div>
      <h3>experience</h3>
      {this.state.course.requirments.experience.map((tag, index) => (
        <div className="center_input">
        <textarea  rows="5" cols="40" name="requirments_experience"  value={tag} index={index}
        onChange={(e) => this.handleChange(e, index)}></textarea>

        <input type="button" name="requirments_experience" className="add_btn"   onClick={(e) => this.add(e, index)}/>
        <input type="button" name="requirments_experience"  className="remove_btn" onClick={(e) => this.remove(e, index)}/>



        </div>


      ))}</div>
      <div>
      <h3>international</h3>


      {this.state.course.requirments.international.map((tag, index) => (
        <div className="center_input">
        <textarea  rows="5" cols="40" name="requirments_international"   value={tag} index={index}
        onChange={(e) => this.handleChange(e, index)}></textarea>

        <input type="button" name="internationalrequirments" className="add_btn"   onClick={(e) => this.add(e, index)}/>
        <input type="button" name="internationalrequirments"   className="remove_btn" onClick={(e) => this.remove(e, index)}/>


        </div>


      ))}
      </div>
      </div>
      <h3>modules</h3>
      {this.state.course.modules.map((tag, index) => (
        <div >
        <br/>
        <label>name</label>

        <input type="text"  name="module_name" value= {tag.name} index={index}
        onChange={(e) => this.handleChange(e, index)}/>
        <label>type</label>

        <input type="text" name="module_type" value= {tag.mtype} index={index}
        onChange={(e) => this.handleChange(e, index)}/>
        <input type="button" name="module" className="add_btn"   onClick={(e) => this.add(e, index)}/>
        <input type="button" name="module"   className="remove_btn" onClick={(e) => this.remove(e, index)}/>


        </div>


      ))}
      <h3>FAQ's</h3>

      {this.state.course.faq.map((tag, index) => (
        <div className="center_input">
        <br/>
        question                 <label className="spacer">  answer </label>
        <br/>
        <textarea  rows="5" cols="30" name="faq_question"  value={tag.question} index={index}
        onChange={(e) => this.handleChange(e, index)}></textarea>


        <textarea  rows="5" cols="30" name="faq_answer"  value={tag.answer} index={index}
        onChange={(e) => this.handleChange(e, index)}></textarea>

        <input type="button" name="faq" className="add_btn" onClick={(e) => this.add(e, index)}/>
        <input type="button" name="faq" value="" className="remove_btn" onClick={(e) => this.remove(e, index)}/>


        </div>


      ))}
      <h2>tags</h2>
      {this.state.course.tags.map((tag, index) => (
        <div className="center_input">
        <input type="text" name="tags" value= {tag} index={index}
        onChange={(e) => this.handleChange(e, index)}/>
        {index>0 && <input type="button" name="tags" className="remove_btn"   onClick={(e) => this.remove(e, index)}/>}
        <input type="button" name="tags"   className="add_btn" onClick={(e) => this.add(e, index)}/>



        </div>


      ))}


      </div>
      <input type="button" name="update" value="update" onClick={(e) => this.create(e)}/>


      </div>
      </div>
    );
  }
}



export default Create_course;
