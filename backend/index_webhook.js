// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
"use strict";

const functions = require("firebase-functions");
const {WebhookClient} = require("dialogflow-fulfillment");
const {Card, Suggestion} = require("dialogflow-fulfillment");
const mongoose= require("mongoose");
const Course= require("./models/courses.js");
const Faq=require("./models/faq.js");


//  'mongodb+srv://dialogflowTest:r1qYq84C8TnhJTdI@dialogflowdata-disdd.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect("mongodb://dialogflowTest:r1qYq84C8TnhJTdI@dialogflowdata-shard-00-00-disdd.mongodb.net:27017,dialogflowdata-shard-00-01-disdd.mongodb.net:27017,dialogflowdata-shard-00-02-disdd.mongodb.net:27017/test?ssl=true&replicaSet=DialogFlowData-shard-0&authSource=admin&retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true});

process.env.DEBUG = "dialogflow:debug"; // enables lib debugging statements


exports.app = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({request, response});
  console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
  console.log("Dialogflow Request body: " + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add("hi my name is becky (unibot)");
    agent.add("what can i do for you today");
  }
  // get cost function which retreves cost from the course model and outputs it to the user.
  function getcost(agent) {
    let courseFound= undefined;
    console.log(agent.parameters);
    if (agent.parameters.course) {
      const coursename=agent.parameters.course;
      return Course.find({course_name: coursename}).then((result)=>{
        courseFound=result[0];
        if (result.length>0) {
          if (courseFound.cost.uk==="" && courseFound.cost.eu==="") {
            agent.add("sorry this information is not avilable please email...");
          } else {
            if (courseFound.cost.uk!=="") {
              agent.add("The cost of "+ coursename+" as an uk student is"+courseFound.cost.uk );
            }
            if (courseFound.cost.eu!=="") {
              agent.add("for an International student it is "+courseFound.cost.eu );
            }
          }
          return undefined;
        } else {
          agent.add("the course could not be found");
          agent.add("do me a favour and rephase");
          agent.add("thanks");

          return undefined;
        }
      }).catch(() => {
        agent.add("course not found");
      });
    }
  }


  function location(agent) {
    let courseFound= undefined;
    console.log(agent.parameters);
    if (agent.parameters.course) {
      const coursename=agent.parameters.course;
      return Course.find({course_name: coursename}).then((result)=>{
        courseFound=result[0];
        if (result.length>0) {
          if ( courseFound.location==="") {
            agent.add("sorry this infromation is not avilable please email...");
          } else if (courseFound.location!=="") {
            agent.add(coursename+" is based in "+courseFound.location );
          }

          return undefined;
        } else {
          agent.add("the course could not be found");
          agent.add("do me a favour and rephase");
          agent.add("thanks");

          return undefined;
        }
      }).catch(() => {
        agent.add("course not found");
      });
    }
  }

  function startdate(agent) {
    let courseFound= undefined;
    console.log(agent.parameters);
    if (agent.parameters.course) {
      const coursename=agent.parameters.course;
      return Course.find({course_name: coursename}).then((result)=>{
        courseFound=result[0];
        if (result.length>0) {
          if ( courseFound.start_date==="") {
            agent.add("sorry this infromation is not avilable please email...");
          } else if (courseFound.start_date!=="") {
            agent.add("The start date for "+coursename+" is  "+courseFound.start_date );
          }

          return undefined;
        } else {
          agent.add("the course could not be found");
          agent.add("do me a favour and rephase");
          agent.add("thanks");

          return undefined;
        }
      }).catch(() => {
        agent.add("course not found");
      });
    }

    // is the course full time

    // Location

    // startDate
  }

  function overview(agent) {
    let courseFound= undefined;
    console.log(agent.parameters);
    if (agent.parameters.course) {
      const coursename=agent.parameters.course;
      return Course.find({course_name: coursename}).then((result)=>{
        courseFound=result[0];
        if (result.length>0) {
          if ( courseFound.overview==="") {
            agent.add("sorry this infromation is not avilable please email hello@aston.ac.uk");
          } else if (courseFound.overview!=="") {
            agent.add(courseFound.overview );
          }

          return undefined;
        } else {
          agent.add("the course could not be found");
          agent.add("do me a favour and rephase");
          agent.add("thanks");

          return undefined;
        }
      }).catch(() => {
        agent.add("course not found");
      });
    }
  }

  function getmodules(agent) {
    let courseFound= undefined;
    console.log(agent.parameters);
    if (agent.parameters.course) {
      const coursename=agent.parameters.course;
      // agent.parameters.course;
      // /^computer Science/ { 'exercises.duration': { $lte: 30} }
      return Course.find({course_name: coursename}).then((result)=>{
        courseFound=result[0];
        if (result.length>0) {
          agent.add("the modules for "+coursename+ " are ");
          const modules =courseFound.modules;
          const compulsary=[];
          const optional=[];
          let optional_string ="the optional modules are: ";
          let compulsary_string ="the compulsary modules are: ";

          modules.forEach((item, i) => {
            if (item.mtype==="optional") {
              optional_string=optional_string+" ,"+item.name;
              optional.push(item.name);
            } else {
              compulsary_string=compulsary_string+" ,"+item.name;

              compulsary.push(item.name);
            }
          });
          if (optional.length>0) {
            agent.add(optional_string);
          }
          if (compulsary.length>0) {
            agent.add(compulsary_string);
          }


          return undefined;
        } else {
          agent.add("the course could not be found");
          agent.add("do me a favour and rephase");
          agent.add("thanks");

          return undefined;
        }
      }).catch(() => {
        agent.add("course not found");
      });
    }
  }


  function get_requirments(agent) {
    let courseFound= undefined;
    console.log(agent.intent);
    console.log(agent.parameters);

    if (agent.parameters.course) {
      const coursename=agent.parameters.course;
      return Course.find({course_name: coursename}).then((result)=>{
        console.log("gggggggggggggggggggggggggggggg");

        courseFound=result[0];
        if (result.length>0) {
          console.log("ggggggggggggcggggggggggggggggg");

          let empty=true;
          courseFound.requirments.basic.forEach((item, i) => {
            console.log("gggggggggggggggggggggggggggggg");
            if (item!=="") {
              empty=false;
              agent.add(item);
            }
          });
          courseFound.requirments.international.forEach((item, i) => {
            if (item!=="") {
              empty=false;
              agent.add(item);
            }
          });
          courseFound.requirements.experience.forEach((item, i) => {
            if (item!=="") {
              empty=false;
              agent.add(item);
            }
          });


          return undefined;
        } else {
          agent.add("the course could not be found");
          agent.add("do me a favour and rephase");
          agent.add("thanks");

          return undefined;
        }
      }).catch(() => {

      });
    } else {
      agent.add("sorry please enter the course which requirments you want");
    }
  }


  function get_requirments_international(agent) {
    let courseFound= undefined;
    console.log(agent.parameters);
    if (agent.parameters.course) {
      const coursename=agent.parameters.course;
      return Course.find({course_name: coursename}).then((result)=>{
        console.log(result[0]);

        courseFound=result[0];
        if (result.length>0) {
          if (courseFound.requirments.international.length!==0) {
            let empty=true;

            courseFound.requirments.international.forEach((item, i) => {
              if (item!=="") {
                empty=false;
                agent.add(item);
              }
            });

            if (empty) {
              agent.add("I am sorry i dont seem to have the requirment information");
            } else {
              agent.add("have you got any other questuins?");
            }
          }


          return undefined;
        } else {
          agent.add("the course could not be found");
          agent.add("do me a favour and rephase");
          agent.add("thanks");

          return undefined;
        }
      }).catch(() => {
        agent.add("course not found");
      });
    } else {
      agent.add("sorry please enter the course which requirments you want");
    }
  }
  function get_requirments_experince(agent) {
    let courseFound= undefined;
    console.log(agent.parameters);
    if (agent.parameters.course) {
      const coursename=agent.parameters.course;
      return Course.find({course_name: coursename}).then((result)=>{
        courseFound=result[0];
        if (result.length>0) {
          if (courseFound.requirments.international.length!==0) {
            let empty=true;

            courseFound.requirments.experience.forEach((item, i) => {
              if (item!=="") {
                empty=false;
                agent.add(item);
              }
            });

            if (empty) {
              agent.add("I am sorry i dont seem to have the requirment information");
            } else {
              agent.add("have you got any other questuins?");
            }
          }


          return undefined;
        } else {
          agent.add("the course could not be found");
          agent.add("do me a favour and rephase");
          agent.add("thanks");

          return undefined;
        }
      }).catch(() => {
        agent.add("course not found");
      });
    } else {
      agent.add("sorry please enter the course which requirments you want");
    }
  }

  function help_applying(agent) {
    console.log(agent.parameters);
    if (agent.parameters.tag) {
      const tag=agent.parameters.tag;
      return Course.find({tags: {$in: [tag]}}).then((result)=>{
        courseFound=result[0];
        if (result.length>0) {
          agent.add("i have found:");
          agent.add(result[0].course_name+ "   web link  "+result[0].url);

          if (result.length>=2) {
            agent.add(result[0].course_name+ "   web link  "+result[0].url);
          }
          agent.add("have you got any questions?");
          return undefined;
        } else {
          agent.add("sorry a course could not be found for your requirments");


          return undefined;
        }
      }).catch(() => {
        agent.add("course not found");
      });
    } else {
      agent.add("please enter the properties you want in your future course");
    }
  }
  function faq(agent) {
    return Faq.find({question: agent.intent}).then((result)=>{
      if (result.length>0) {
        const faqsingle=result[0];
        if (faqsingle.answer!=="") {
          agent.add(faqsingle.answer);
        } else {
          agent.add("i dont seem to have this information avaialvbe");
        }


        //
      } else {
        agent.add("i dont seem to have this information avaialvbe");
      }

      return undefined;
    }).catch(() => {
      agent.add("information not available");
    });
  }
  function fallback(agent) {
    agent.add("I didn't understandgg");
    agent.add("I'm sorry, can you try again?");
  }


  const intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("GetModules", getmodules);
  intentMap.set("requirements", get_requirments);
  intentMap.set("location", location);
  intentMap.set("extensiveworkexperience", get_requirments_experince);
  intentMap.set("international student course cost", get_requirments_international);
  intentMap.set("CourseSummary", overview);
  intentMap.set("start Date", startdate);
  intentMap.set("cost of course", getcost);

  intentMap.set("how do i apply for a master course?", faq);

  intentMap.set("what postgraduate scholarships are available?", faq);
  intentMap.set("covid rules on accommodations?", faq);
  intentMap.set("how long after i submit will i get the decision?", faq);
  intentMap.set("can postgraduates get on campus accommodation ?", faq);
  intentMap.set("can i defer my scholarship?", faq);
  intentMap.set("are accommodations shared?", faq);
  intentMap.set("why aston?", faq);
  intentMap.set("how will covid effect me next year?", faq);


  agent.handleRequest(intentMap);
});
