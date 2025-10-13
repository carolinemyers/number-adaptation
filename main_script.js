//****************************//
//FLSearch  2.1.7- preregistered
//Designed by Caroline MYERS, Chaz FIRESTONE, and Justin HALBERDA (Johns Hopkins)
//Written by Caroline MYERS (Johns Hopkins)- [08/29/21]
//Last updated by Caroline MYERS (Johns Hopkins)- [11/16/21]
//****************************//
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/***********************************************************************************************
                                    1. GET PROLIFIC INFO
/***********************************************************************************************/

const PROLIFICLINK = 'https://app.prolific.co/submissions/complete?cc=75852D8F';

// capture info from Prolific
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

if (typeof subject_id == 'undefined') {
    subject_id = Date.now();}

if (typeof study_id == 'undefined') {
    study_id = 'FlSearch2.1.7-PREREGISTERED';}

if (typeof session_id == 'undefined') {
    session_id = 'today';}

if (typeof subject_id !== 'string') {
    subject_id = subject_id.toString();}

jsPsych.data.addProperties({
    subject_id: subject_id,
    study_id: study_id,
    session_id: session_id,});

/***********************************************************************************************
                                2. VARIABLES AND CONSTANTS
/***********************************************************************************************/
const pilotMode = 0; // 1 for pilot mode on, 0 for pilot mode off!
const c = document.getElementById('myCanvas'); 
const ctx = c.getContext('2d');
const numTrialsBreak = 20; // number of trials we give subject before offering a break
var numReps = 8; // 6- the number of repetitions of our full factorial design we want.
let canvasSizeX = c.width;
let canvasSizeY = c.height;
let stimulusSizeX = 800;
let stimulusSizeY = 800;
let canvasMidpointX = canvasSizeX / 2; let canvasMidpointY = canvasSizeY / 2;  
var timeline = [];

//Define distractors
var fireDownDistractors = ['img/Fire_Down_Distractor1.gif','img/Fire_Down_Distractor2.gif','img/Fire_Down_Distractor3.gif',
    'img/Fire_Down_Distractor4.gif','img/Fire_Down_Distractor5.gif','img/Fire_Down_Distractor6.gif','img/Fire_Down_Distractor7.gif',
    'img/Fire_Down_Distractor8.gif'];

var fireUpDistractors = ['img/Fire_Up_Distractor1.gif','img/Fire_Up_Distractor2.gif','img/Fire_Up_Distractor3.gif',
    'img/Fire_Up_Distractor4.gif','img/Fire_Up_Distractor5.gif','img/Fire_Up_Distractor6.gif','img/Fire_Up_Distractor7.gif',
    'img/Fire_Up_Distractor8.gif'];

/***********************************************************************************************
                                  3. PRELOAD OUR IMAGES 
/***********************************************************************************************/
var preload = {
   type: 'preload',
   images: ['img/fix.png', 'img/Fire_Down_Target.gif','img/Fire_Up_Target.gif',
    'img/Fire_Down_Distractor1.gif','img/Fire_Down_Distractor2.gif','img/Fire_Down_Distractor3.gif','img/Fire_Down_Distractor4.gif', 'img/Fire_Down_Distractor5.gif',
    'img/Fire_Down_Distractor6.gif','img/Fire_Down_Distractor7.gif','img/Fire_Down_Distractor8.gif',
    'img/Fire_Up_Distractor1.gif','img/Fire_Up_Distractor2.gif',
   'img/Fire_Up_Distractor3.gif','img/Fire_Up_Distractor4.gif','img/Fire_Up_Distractor5.gif',
   'img/Fire_Up_Distractor6.gif','img/Fire_Up_Distractor7.gif','img/Fire_Up_Distractor8.gif','img/feedbackImage.png'],
    video: ['video/TaskInstructions.mp4','video/endTraining.mp4','video/Instructions1.mp4'], 
    show_detailed_errors: true,
    auto_preload: true,
    message: 'Please wait while the experiment loads. This may take a few minutes.'
   // max_load_time: 300000, // 2 minute,



};

//var preload = {
    //type: 'preload',
   // auto_preload: true 
//};
timeline.push(preload);

/***********************************************************************************************
                                  4. SET UP OUR TRIALMAT 
/***********************************************************************************************/
////////Define our full factorial design:
var factors = {
    setSize: [4,5,6,7,8],
    searchCondition: ['targetUp_distractorsDown','targetDown_distractorsUp'],
    targetPresent: [true,false],
};
var full_design = jsPsych.randomization.factorial(factors, numReps); // 6 repetitions 
var training_design = jsPsych.randomization.factorial(factors, 1);

///////DEFINE OUR COMBINATIONS OF TARGET AND DISTRACTORS: TARGET NORMAL (UP)
for(let ii = 0; ii < full_design.length; ii++) {

    if (full_design[ii].searchCondition == 'targetUp_distractorsDown') {
        full_design[ii].Distractor = jsPsych.randomization.repeat(fireDownDistractors, 1);
        full_design[ii].Target = 'img/Fire_Up_Target.gif';
    }
}
///////DEFINE OUR COMBINATIONS OF TARGET AND DISTRACTORS: TARGET NORMAL (DOWN)
for(let ii = 0; ii < full_design.length; ii++) {

    if (full_design[ii].searchCondition == 'targetDown_distractorsUp') {
        full_design[ii].Distractor = jsPsych.randomization.repeat(fireUpDistractors, 1);
        full_design[ii].Target = 'img/Fire_Down_Target.gif';

    }
}
var totalNumTrials = full_design.length;



/***********************************************************************************************
                                       5. DO THIS FOR TRAINING
/***********************************************************************************************/


///////DEFINE OUR COMBINATIONS OF TARGET AND DISTRACTORS: TARGET NORMAL (UP)
for(let ii = 0; ii < training_design.length; ii++) {

    if (training_design[ii].searchCondition == 'targetUp_distractorsDown') {
        training_design[ii].Distractor = jsPsych.randomization.repeat(fireDownDistractors, 1);
        training_design[ii].Target = 'img/Fire_Up_Target.gif';
    }
}
///////DEFINE OUR COMBINATIONS OF TARGET AND DISTRACTORS: TARGET NORMAL (DOWN)
for(let ii = 0; ii < training_design.length; ii++) {

    if (training_design[ii].searchCondition == 'targetDown_distractorsUp') {
        training_design[ii].Distractor = jsPsych.randomization.repeat(fireUpDistractors, 1);
        training_design[ii].Target = 'img/Fire_Down_Target.gif';

    }
}
/***********************************************************************************************
                                       5. GET DATE
/***********************************************************************************************/
var getDate = new Date();
var weekday = new Array(7);
weekday[0] = 'Sunday';
weekday[1] = 'Monday';
weekday[2] = 'Tuesday';
weekday[3] = 'Wednesday';
weekday[4] = 'Thursday';
weekday[5] = 'Friday';
weekday[6] = 'Saturday';

var todayDate = weekday[getDate.getDay()];

/***********************************************************************************************
                                      6. ENTER FULL SCREEN
/***********************************************************************************************/


/***********************************************************************************************
                   7. OPTIONAL, GET VIEWING DISTANCE AND USE DEGREES OF VISUAL ANGLE
/***********************************************************************************************/
/* 
if (pilotMode == 0) {
    var virtualChinrest = {

        type: 'virtual-chinrest',
        blindspot_reps: 1,
        resize_units: 'deg',
        pixels_per_unit: 50,
        //viewing_distance_report: 'none'

        on_finish: function(data){
            const windowHeightDVA =  jsPsych.data.get().filter({trial_type: 'virtual-chinrest'}).values()[0]['win_height_deg'];
            const windowWidthDVA =  jsPsych.data.get().filter({trial_type: 'virtual-chinrest'}).values()[0]['win_width_deg'];
            const pix2mmFactor =  jsPsych.data.get().filter({trial_type: 'virtual-chinrest'}).values()[0]['px2mm'];
            const pix2degFactor =  jsPsych.data.get().filter({trial_type: 'virtual-chinrest'}).values()[0]['px2deg'];
            const scaleFactor =  jsPsych.data.get().filter({trial_type: 'virtual-chinrest'}).values()[0]['scale_factor'];

            // TO GET ALL VALUES: 
            //jsPsych.data.get().filter({trial_type: 'virtual-chinrest'}).values();

        }
    };
    timeline.push(virtualChinrest);
}
*/ 
/***********************************************************************************************
                                  8. HELLO AND WELCOME
/***********************************************************************************************/
var intro_T1_Welcome = {
    type: 'html-keyboard-response', 
    stimulus: `What a beautiful ${todayDate} to do some awesome science! </p> <p>  </p><p> </p>
    By completing this survey or questionnaire, you are consenting to be in this research study. </p>
    Your participation is voluntary and you can stop at any time.
    <p> [Press any key to continue.] </p>
    
    `
};
// timeline.push(intro_T1_Welcome);

var intro_T1_Instructions = {
    type: 'video-keyboard-response',
    autoplay: true,
    stimulus: ['video/Instructions1.mp4'],
    response_ends_trial: true,
    width: 900,
    height: 900,
    autoplay: true,
    trial_ends_after_video: false,
};
timeline.push(intro_T1_Instructions);


var intro_T2_Instructions = {
    type: 'video-keyboard-response',
    stimulus: ['video/Instructions1.mp4'],
    autoplay: true,
    response_ends_trial: true,
    width: 900,
    height: 900,
    autoplay: true,
    trial_ends_after_video: false,
};
timeline.push(intro_T2_Instructions);

var intro_T3_Instructions = {
    type: 'video-keyboard-response',
    stimulus: ['video/Instructions2.mp4'],
    response_ends_trial: true,
    width: 900,
    height: 900,
    autoplay: true,
    trial_ends_after_video: false,
};
timeline.push(intro_T3_Instructions);

var intro_T4_Instructions = {
    type: 'video-keyboard-response',
    stimulus: ['video/Instructions1.mp4'],
    response_ends_trial: true,
    width: 900,
    height: 900,
    autoplay: true,
    trial_ends_after_video: false,
};
timeline.push(intro_T4_Instructions);

var intro_T5_Instructions = {
    type: 'video-keyboard-response',
    stimulus: ['video/Instructions2.mp4'],
    response_ends_trial: true,
    width: 900,
    height: 900,
    autoplay: true,
    trial_ends_after_video: false,
};
timeline.push(intro_T5_Instructions);

var intro_T6_Instructions = {
    type: 'video-keyboard-response',
    stimulus: ['video/Instructions2.mp4'],
    response_ends_trial: true,
    width: 900,
    height: 900,
    autoplay: true,
    trial_ends_after_video: false,
};
timeline.push(intro_T6_Instructions);
/***********************************************************************************************
                              9. FAMILIARIZATION PERIOD, 4 TRIALS
/***********************************************************************************************/
// We will present 4 training trials, with feedback. 




var training_T1_Trial = {
    timeline: [{
        type: 'visual-search-circleCM2',
        target: jsPsych.timelineVariable('Target'),
        foil: jsPsych.timelineVariable('Distractor'),
        fixation_image: 'img/fix.png',
        target_present: jsPsych.timelineVariable('targetPresent'),
        feedback: true,
        feedback_image: 'img/feedbackImage.png',
        set_size: jsPsych.timelineVariable('setSize'),
        target_size: [200,200],
        circle_diameter: 600,
        target_present_key: 'd',
        target_absent_key: 's',
        render_on_canvas: false,
    }],

    data: {
        task: 'training',
        correct_response: 'd',

    },

    on_finish: function (data) {
        data.task = 'training_T1_Trial';
        data.target = jsPsych.timelineVariable('Target');
        data.foilCM = jsPsych.timelineVariable('Distractor');
        data.setSizeCM = jsPsych.timelineVariable('setSize');
        data.searchCondition = jsPsych.timelineVariable('searchCondition');
        if (jsPsych.timelineVariable('targetPresent') == true) {
            data.correct_response = 'd';
        } else if (jsPsych.timelineVariable('targetPresent') == false) {
            data.correct_response = 's';
        }

    }
};



/***********************************************************************************************
          10. DEFINE OUR TRIALS FOR THE MAIN EXPERIMENT, MAIN T1 (ITI) AND MAIN T2 (TRIAL)
/***********************************************************************************************/
    
//////////////////************************* main_T1_ITI ********************//////////////////

var trial_count = 0; // setting our trial counter to 0
var main_T1_ITI = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px;"> </div>',
    render_on_canvas: true,
    canvas_size: [canvasSizeX,canvasSizeY],
    data: {
        task: 'main_T1_ITI'
    },

    on_start: function(main_T1_ITI) {
        trial_count++;
        if (trial_count % numTrialsBreak == 0) {
            main_T1_ITI.stimulus =  `Wow! You've completed ${trial_count} out of ${totalNumTrials} trials! </p> <p>  </p><p> Take a quick break, then press any key when you're ready to continue.`;
        }
        else if (trial_count % numTrialsBreak !== 0) {  
            main_T1_ITI.trial_duration = 0,
            main_T1_ITI.choices = jsPsych.NO_KEYS,
            main_T1_ITI.stimulus = '';
        }
    }
};

//////////////////************************* main_T2_Trial ********************//////////////////

var main_T2_Trial = {
    type: 'visual-search-circle',
    target: jsPsych.timelineVariable('Target'),//'img/Fire_Up_Target.gif',
    foil: jsPsych.timelineVariable('Distractor'),
    fixation_image: 'img/fix.png',
    target_present: jsPsych.timelineVariable('targetPresent'),
    set_size: jsPsych.timelineVariable('setSize'),
    target_size: [200,200],
    circle_diameter: 600,
    target_present_key: 'd',
    target_absent_key: 's',
    canvas_size: [canvasSizeX,canvasSizeY],
    render_on_canvas: false,

    on_finish: function (data) {
        data.task = 'main_T2_Trial';
        data.target = jsPsych.timelineVariable('Target');
        data.foilCM = jsPsych.timelineVariable('Distractor');
        data.setSizeCM = jsPsych.timelineVariable('setSize');
        data.searchCondition = jsPsych.timelineVariable('searchCondition');
        if (jsPsych.timelineVariable('targetPresent') == true) {
            data.correct_response = 'd';
        } else if (jsPsych.timelineVariable('targetPresent') == false) {
            data.correct_response = 's';
        }

    }
};
  
/***********************************************************************************************
                           11. DEFINE OUR MAIN TIMELINE FOR THE EXPERIMENT
/***********************************************************************************************/



//var mainTimeline = {
//    timeline: [training,experiment],
 //   timeline_variables: [training_design,full_design],
//    repetitions: 1,
//    randomize_order: true
//};

//timeline.push(experiment); // push this to the timeline

/***********************************************************************************************
                                12. PARTICIPANT FEEDBACK QUESTION
/***********************************************************************************************/
var endQuestion = {
    type: 'survey-text',
    questions: [
        {prompt: 'Thank you! You are almost done! Is there anything we should know about your participation in this experiment today?'}
    ],
};
timeline.push(endQuestion); // push this to the timeline

/***********************************************************************************************
                                13. INITIALIZE EXPERIMENT AND SAVE DATA
/***********************************************************************************************/
jsPsych.init({
    timeline: timeline,
    randomize_order: true,
    repetitions: 1,
    // save data to server
    on_finish: function(){ saveData(subject_id, jsPsych.data.get().csv()),
    document.body.innerHTML = `
        <p> 
        <div style='width: 700px;'>
        <div style='float: center;'><img src='img/yay.png'></img>
        </div>
        <center> Thank you for completing the experiment! </p>
        </p> Please wait. You will be automatically redirected back to Prolific in 10 seconds. </p>
        </p> <strong>Please do not click out of this page or close this tab. </strong> </p>
        <p>Thank you! </center>  </p>
        `;
    document.documentElement.style.textAlign = 'center';

    setTimeout(function () { location.href = PROLIFICLINK; }, 10000); // redirect to prolific after 10 seconds such that our data can back up to the server.
    } 
});