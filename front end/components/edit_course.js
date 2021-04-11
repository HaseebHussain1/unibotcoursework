import React from 'react';
import '../App.css';
import axios from 'axios';
import * as lib from '../helpers/coursefunctions.js';
import {Redirect} from 'react-router-dom';
import {auth} from '../helpers/firebase.js'
//edit
/*
this page will display content about course and can update courses
also error messages are displayed and sucsessmessage createUserWithEmailAndPassword
add remove and update functions control the data within the course object

*/
class Edit_course extends React.Component {
  constructor(props){
    super(props);
    this.state={
      error:{istrue:false,message:""},
      succsess:{istrue:false,message:""},
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
          basic: ["fda","gggg"],
          international: [""],
          experience: [""]
        },
        faq: [{question:"",answer:""}],
        modules:[{name:"h",mtype:"h"}],
        tags:[""]
      },
      courses:[],
      id:"",
      redirect:false,
      url:"allcourses"




    }
    if(this.props.location.query){
      this.state.id=this.props.location.query.id;
    }else{

      this.state.redirect=true;


    }
  }
  componentDidMount() {



    // Changing the state after 2 sec
    // from the time when the component
    // is rendered
    setTimeout(() => {
      const context=this;

      // if auth.currentUser is null then redirect to Home
      auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
        // Send token to your backend via HTTPS
        // ...
        axios.post('https://us-central1-test-eixuyp.cloudfunctions.net/simple/courses/edit',{id:context.state.id},{ headers: {"Authorization" : `${idToken}`} })
        .then(function (response) {


          context.setState({course:lib.getting_Course(context.state.course,response)});
        })
      })



    }, 2000)}
    handleChange=(event,i)=>{

      this.setState({course:lib.handleChange(event,i,this.state.course)});


    }
    remove=(event,i)=>{


      this.setState({course:lib.remove(event,i,this.state.course)});


    }
    add=(event,i)=>{


      this.setState({course:lib.add(event,i,this.state.course)});


    }



    update=(event)=>{
      this.setState({succsess:{istrue:false,message:""}});
      this.setState({error:{istrue:false,message:""}});


      if(lib.update(this.state.course)===true){

        var context=this;
        auth.currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
          console.log(idToken);





          axios.post('https://us-central1-test-eixuyp.cloudfunctions.net/simple/courses/edit/update',{id:context.state.id,course:context.state.course},{ headers: {"Authorization" : `${idToken}`} })
          .then(function (response) {

            context.setState({succsess:{istrue:true,message:"course Updated"}})

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
        <h1 className="centerTitle"> Edit Course</h1>

        <div>
        {lib.displayMessage(this.state.error)}
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
        ))}
        </div>
        <div>
        <h3>experience</h3>
        {this.state.course.requirments.experience.map((tag, index) => (
          <div className="center_input">
          <textarea  rows="5" cols="40" name="requirments_experience"  value={tag} index={index}
          onChange={(e) => this.handleChange(e, index)}></textarea>
          <input type="button" name="requirments_experience" className="add_btn"   onClick={(e) => this.add(e, index)}/>
          <input type="button" name="requirments_experience"  className="remove_btn" onClick={(e) => this.remove(e, index)}/>
          </div>
        ))}
        </div>
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
        <input type="button" name="update" value="update" onClick={(e) => this.update(e)}/>
        </div>
        </div>
      );
    }
  }



  export default Edit_course;
