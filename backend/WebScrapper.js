const functions = require('firebase-functions');
const puppeteer = require ('puppeteer');
const cheerio = require('cheerio');


var express = require('express');

const scrapper = express();

scrapper.post('*', (requests, response) => {
  var course = {
    coursename: "",
    courseType : "",
    courseFormat :"" ,
    duration :"" ,
    ucasCode:"",
    startDate:"",
    overview:"",
    location:"",
    url:"",
    cost:{
      uk:"",
      eu:""
    },
    requirments: {
      basic: [],
      international: [],
      experience: []
    },
    faq: [],
    modules:[]


  };

  puppeteer
  .launch ({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  .then (async browser => {
    try {
      const page = await browser.newPage ();
      await page.goto (requests.body.url);
      await page.waitForSelector ('body');

      //manipulating the page's content
      const html = await page.content();
      await browser.close ();
      var $ = cheerio.load(html);

      course.url=requests.body.url;

      overview(course,$);
      modules(course,$);
      entry_requirments1(course,$);
      entry_requirments(course,$);
      faq(course,$);
      cost(course,$);



      course.coursename =  $('div[id="overview"]').contents().get(0).next.children[0].data;

      $('div[id="overview"]').contents().get(0).next;
      $('div[class="other_info"]').contents().each(function(i,item){
        sectionOneProcessing(item,course,$);
      });

      response.send({course:course});
      response.end();
      return;
    } catch (e) {
      response.status(401).send({ error : e.message });
    }
    return;

  })
  //handling any errors
  .catch (function (err) {
    console.error (err);
  });





});

function cost(course,$){
  var divtagfees=$('div[id="fees-and-scholarships"]');
  var divtagcoursinfo=$('div[class="row two-col"]',divtagfees);

  $(divtagcoursinfo).contents().each(function(i,item){

    if($('p strong',item).text().search('UK') !== -1){
      course.cost.uk=$('h3 em',item).text();

    }else if($('p strong',item).text().search('EU') !== -1){
      course.cost.eu=$('h3 em',item).text();
    }


  })



}


function faq(course,$){
  var divtagfees=$('div[id="frequently-asked-questions"]');
  var divtagcoursinfo=$('dl',divtagfees);

  $(divtagcoursinfo).contents().each(function(i,item){
    var quest="";
    var answ="";
    if(item.name==='dt'){
      quest=$(item).text();
      answ=$(item).next().text();

      if(quest!==""&&answ!==""){

        course.faq.push({question:quest,answer:answ});
      }
    }



  })
  //row two-col


}
function overview(course,$){
  var course_overiew_info=$('div[id="overview"]').parent();// parent of bod and overview


  var overviewHtmlbody =$('div[class="body"]',course_overiew_info)
  $(overviewHtmlbody).contents().each(function(i,item){
    if (item.type==='tag'){
      if(item.name==='p'){
        course.overview=$(item).text();


      }else if(item.name.search('h') !== -1){

        course.location=$(item).text().replace("Location: ","");


      }

    }
  });
  // console.log($(item).html()+"ddd");  });

}
function modules(course,$){
  var modulesAndCourseHtmloutline =$('div[id="course-outline-and-modules"]');
  var modulesAndCourseHtml =$('div[id="learning,-teaching-and-assessment"]');

  //console.log($(a).text()+"bbb");


  if($('div[class="ckeditor-tab-content ckeditor-tab-content-2"]',modulesAndCourseHtml).length===1 && $('div[class="ckeditor-tab-content ckeditor-tab-content-1 active"]',modulesAndCourseHtml).length===1){

    $('div[class="ckeditor-tab-content ckeditor-tab-content-1 active"] p',modulesAndCourseHtml)[0].children.forEach(function (module, index, arr){
      if(module.type==="text"){
        var name=module.data.replace('•    ',"");
        course.modules.push({name:name,mtype:"compulsary"});
      }})

      $('div[class="ckeditor-tab-content ckeditor-tab-content-2"] p',modulesAndCourseHtml)[0].children.forEach(function (module, index, arr){
        if(module.type==="text"){

          var name=module.data.replace('•    ',"");
          course.modules.push({name:name,mtype:"optional"});
        }})


      }


      var modulesList=$('ul',modulesAndCourseHtmloutline);
      console.log($('ul',modulesAndCourseHtmloutline).length);
      if($('ul',modulesAndCourseHtmloutline).length===1){
        $(modulesList).contents().each(function(i,item){
          //console.log($('div',item ).get(0).children[0].data);
          if (item.name==='li'){
            var name=$(item).text().replace('•    ',"");
            course.modules.push({name:name,mtype:"compulsary"});




          }
        });
      }else if($('ul',modulesAndCourseHtmloutline).length<=2)
      {
        $(modulesList).each(function(i,item){

          if(i===0){

            $(item).contents().each(function(index,itemli){


              if (itemli.name==='li'){
                var name=$(itemli).text().replace('•    ',"");
                course.modules.push({name:name,mtype:"compulsary"});

                // console.log($(itemli).text()+"   op");




              }
            });
          }else if (i===1){
            $(item).contents().each(function(index,itemli){


              if (itemli.name==='li'){
                //console.log(itemli.name);
                var name=$(itemli).text().replace('•    ',"");
                course.modules.push({name:name,mtype:"optional"});


                // console.log($(itemli).text()+"   op");




              }
            });

          }
        });
      }






      if($('Strong:contains("Core Modules")',modulesAndCourseHtml).length>=1&& $('ul',modulesAndCourseHtml).length===0){
        //
        var compmodules=$('strong:contains("Core")',modulesAndCourseHtml)[0].nextSibling;

        moduleSubScrapper(compmodules,course,"compulsary");

      }
      if($('Strong:contains("Core")',modulesAndCourseHtml).length>=1&& $('ul',modulesAndCourseHtml).length===0){
        //
        var compmodules2=$('strong:contains("Core")',modulesAndCourseHtml)[0].nextSibling;

        moduleSubScrapper(compmodules2,course,"compulsary");

      }

      if($('Strong:contains("Elective")',modulesAndCourseHtml).length>=1&& $('ul',modulesAndCourseHtml).length===0){
        //
        var compmodules3=$('Strong:contains("Elective")',modulesAndCourseHtml)[0].nextSibling;

        moduleSubScrapper(compmodules3,course,"optional");
      }

      if($('Strong:contains("need to choose")',modulesAndCourseHtmloutline).length>=1&& $('ul',modulesAndCourseHtml).length===0){
        //
        var compmodules4=$('Strong:contains("need to choose")',modulesAndCourseHtmloutline)[0].nextSibling;

        moduleSubScrapper(compmodules4,course,"optional");
      }
      if($('Strong:contains("options:")',modulesAndCourseHtml).length>=1&& $('ul',modulesAndCourseHtml).length===0){
        //
        var compmodules5=$('Strong:contains("options:")',modulesAndCourseHtml)[0].nextSibling;

        moduleSubScrapper(compmodules5,course,"optional");
      }

      if($('Strong:contains("Core")',modulesAndCourseHtmloutline).length>=1&& $('ul',modulesAndCourseHtmloutline).length===0){
        //
        var compmodules6=$('strong:contains("Core")',modulesAndCourseHtmloutline)[0].nextSibling;

        moduleSubScrapper(compmodules6,course,"compulsary");

      }

      if($('Strong:contains("options:")',modulesAndCourseHtmloutline).length>=1&& $('ul',modulesAndCourseHtmloutline).length===0){
        //
        var compmodules7=$('Strong:contains("options:")',modulesAndCourseHtmloutline)[0].nextSibling;

        moduleSubScrapper(compmodules7,course,"optional");
      }


    }

    function moduleSubScrapper(tags,course,type){
      var compmodules=tags;
      while(compmodules!==null){
        if(compmodules!==null){
          if(compmodules.name==='strong' ){

            break;
          }else if(compmodules.type==='text'){
            if(compmodules.data.trim()!==""){
              if(type==="optional"){

                course.modules.push({
                  name:compmodules.data,
                  mtype:"optional"

                });
              }else{

                course.modules.push({
                  name:compmodules.data,
                  mtype:"compulsary"

                });
              }
            }

          }
          // console.log(compmodules.nextSibling);

          compmodules=compmodules.nextSibling;

        }
      }
    }
    function entry_requirments1(course,$){
      var entryreq =$('div[id="entry-requirements"]');

      var unorderdList=$('ul',entryreq);

      $(unorderdList).each(function(i,list){


        if (list.type==='tag'){
          if(list.name==='ul'){



            if ($(list).prev().length===0){


              //check if previouse is null
              // then basic check in to basic requirements
              $('li',list).each(function(i,listItem){
                course.requirments.basic.push($(listItem).text());

              })
            }else{
              // console.log($(item).prev().get(0).type);
              if ($(list).prev().get(0).type==='tag'){
                if($(list).prev().get(0).name==='p'){


                  if($($(list).prev().get(0)).text().search('As well as') !== -1){

                    $('li',list).each(function(i,listItem){
                      course.requirments.basic.push($(listItem).text());

                    })

                  }else if($($(list).prev().get(0)).text().search('International') !== -1){

                    $('li',list).each(function(i,listitems){
                      course.requirments.international.push($(listitems).text());
                    })

                  }
                }

              }}
              // then check if contains titleOfSubheading
              // then sore u; in that section with a tags


            }

          }
        });


      }
      function entry_requirments(course,$){

        var entryreq =$('div[id="entry-requirements"]');
        var paragraph=$('p',entryreq);
        $(paragraph).each(function(i,tag){
          if($(tag).text().search('work') !== -1){
            //remove the titleOfSubheadi
            // replace br tags with/n
            $(tag).children().each(function(i,subtag){
              if($(subtag).get(0).name!=="strong"){
                if($(subtag)[0].nextSibling.nodeValue!==null){
                  course.requirments.experience.push($(subtag)[0].nextSibling.nodeValue);
                }
              }


            })

          }

          //remove strong and br tags then replace brbr with /n
        })

      }

      function sectionOneProcessing(item,course,$){
        console.log("hhh");
        var coursesub = {
          cr_type: "courseType",
          cr_opinion : "courseFormat",
          cr_duration :"duration" ,
          cr_ucas :"ucasCode" ,
          cr_start_date:"startDate",

        };
        if (item.type==='tag'){
          if (item.name==='div'){
            if(coursesub.hasOwnProperty(item.attribs.class)){
              if($('div[class="info"]',item ).length>0){
                course[coursesub[item.attribs.class]]=  $('div[class="info"]',item ).text();
              }
                else if ($('option',item ).length>0) {
                  course[coursesub[item.attribs.class]]=$('option',item )[0].children[0].data;
                  console.log($('option',item )[0].children[0].data);
                }
                console.log(item.attribs.class);

              }else{

                console.error ("heeeyyyyy3");
              }

            }

          }

        }


        const webscrapper = functions.https.onRequest(scrapper);

        module.exports = {
          webscrapper
        };
