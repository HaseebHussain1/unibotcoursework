import React from 'react';
import '../App.css';
import axios from 'axios';
import './chatbot.css';



class chatbot extends React.Component {
  constructor(props){
  super(props);
  var formattedMsg={
  currentDateTime: Date().toLocaleString(),
  isChatBot:true,
  message:"Hi there, im becky your friendly university guide"

  }
  var formattedMsg2={
  currentDateTime: Date().toLocaleString(),
  isChatBot:true,
  message:"How can i help you today?"

  }
var messages = [];
messages.push(formattedMsg);

messages.push(formattedMsg2);


  this.state={
  messages:messages,
  currentMessage:""
  }

}
 handleChange=(event)=>{
   this.setState({currentMessage: event.target.value})
}
handleChatbotQueery=(event)=>{
//ceck if enter
// then make sure that http request to server. next

if(event.key === 'Enter'){
    event.preventDefault();

// http
var formattedMsg={
  currentDateTime: Date().toLocaleString(),
  isChatBot:false,
  message:this.state.currentMessage

}

var querry= {
      sessionId: '1',
      queryInput: {
        text: {
            message: this.state.currentMessage,
            languageCode: 'en-US'
        }
      }
    }

  this.setState(state=>{
      const messages = [...this.state.messages, formattedMsg];// change to object

    return{
      messages,
      message:''

    }

  });
  var self=this;
    axios.post('https://us-central1-test-eixuyp.cloudfunctions.net/dialogflowserver-app', querry)
      .then(function (response) {
        response.data.fulfillmentMessages.forEach((item, i) => {

        var formattedMsg={
        currentDateTime: Date().toLocaleString(),
        isChatBot:true,
        message:item.text.text

        }
        self.setState(state=>{
          const messages = [...self.state.messages, formattedMsg];// change to object

          return{
            messages,
            message:item.text.text

          }

        });
      });


      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    })

}



}

render() {
  return (
    <div className="bdy">
     <div className="center_main">
        <h1 className="centerTitle"> chatbot</h1>
        <div class="chatbotbody">
           <div className="chatbotName">
              <h4 className="chatbotName">becky</h4>
           </div>
           <div class="messages">
              <ul >
                 {this.state.messages.map((tag, index) => (
                 <li key={index}  className={` ${tag.isChatBot ? "chatbot" : "human"}`}>
                 {tag.message}
                 <br/>
                 </li>
                 ))}
              </ul>
           </div>
           <input type="text" id="querry"
              onChange={this.handleChange}
              onKeyPress={(e) => this.handleChatbotQueery(e)}
           />
        </div>
        <div >
        </div>
     </div>
  </div>
  );
}
  }




export default chatbot;
