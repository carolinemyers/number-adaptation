/**
 * jspsych-color-precision-v2
 * plugin for continuous color report using Schurgin et al. color wheel.
 * 
 * Adapted from Tim Brady by Caroline Myers
 * 
 *
  */

var continuous_color_css_added = false;

jsPsych.plugins['color-precision4'] = (function() {
    var plugin = {};
    plugin.info = {
        name: 'color-precision4',
        description: '',
        parameters: {
            set_size: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Set size',
                default: 4,
                description: 'Number of actual colors to show on this trial'
            },
            maskArray: {
                type: jsPsych.plugins.parameterType.STRING,
                pretty_name: 'images',
                default: 'img/mask.png',
                array: true,
                description: 'The image content to be displayed, should be CSS sprite'
            },

            /*
            maskNum: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Which mask',
                default: 2,
                array: true,
                description: 'If not empty, should be where, from 0 to placeholders-1, each item from item_colors goes. '
            },

            */

            my_image: {
                type: jsPsych.plugins.parameterType.IMAGE,
                pretty_name: 'images',
                default: 'img/mask.png',
                description: 'The image content to be displayed, should be CSS sprite'
            },

            item_colors: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Actual colors to show (optional)',
                default: [],
                array: true,
                description: 'If not empty, should be a list of colors to show, in degrees of color wheel, of same length as set_size. If empty, random colors with min distance between them of min_difference [option below] will be chosen. '
            },

            spinAmt: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Degree of spin',
                default: 90,
                array: true,
                description: 'If not empty, should be a list of colors to show, in degrees of color wheel, of same length as set_size. If empty, random colors with min distance between them of min_difference [option below] will be chosen. '
            },

            item_positions: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Positions of items (optional)',
                default: [],
                array: true,
                description: 'If not empty, should be where, from 0 to placeholders-1, each item from item_colors goes. '
            },
            which_test: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Which item to probe',
                default: 0,
                description: 'Item # from 0 to set_size-1 to probe. (Since the colors are by default randomly position & random colors, this can stay 0 unless you need to change it). OR -1 to put probe at the center, as in an ensemble report task.'
            },			
            click_to_start: {
                type: jsPsych.plugins.parameterType.Boolean,
                pretty_name: 'Click to start trial or start on a timer?',
                default: true,
                description: 'Click to start trial or start on a delay_start ms timer?'
            },	
            delay_start: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Delay before starting trial',
                default: 500,
                description: 'Delay before starting trial'
            },				

            mask_display_time: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Mask display time',
                default: 500,
                description: 'Mask display time'
            },		

            item_mask_colors: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Mask colors',
                default: 500,
                description: 'Mask colors'
            },		

            color_wheel_spin: {
                type: jsPsych.plugins.parameterType.Boolean,
                pretty_name: 'Spin the color wheel every trial',
                default: false,
                description: 'Should the color wheel spin every trial?'				
            },
            feedback: {
                type: jsPsych.plugins.parameterType.Boolean,
                pretty_name: 'Give feedback?',
                default: false,
                description: 'Feedback will be in deg. of color wheel of error.'				
            },			
            responses_per_item: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Collect multiple response per item',
                default: 1,
                description: 'To allow ranking task, where people can pick more than 1 color for each item.'
            },			
            color_wheel_num_options: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Number of colors on wheel',
                default: 360,
                description: 'Number of color options. Can be overruled by color_wheel_list_options. Should evenly divide into 360 and be <= 360.'
            },
            color_wheel_list_options: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Which choices to show',
                array: true,
                default: [],
                description: 'If not empty, which options to show, relative to the target (0), ranging from -179 to 180.'
            },

            item_size: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Size of each item',
                default: 180,
                description: 'Diameter of each circle in pixels.'
            },

            mask_size: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Size of each mask',
                default: 180, //200 //no real mask is shown, as display duration is set to 180. 
                description: 'Diameter of each mask in pixels.'
            },


            mask_radius: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'radius of each mask',
                default: 160,//80,
                description: 'Diameter of each circle in pixels.'
            },

            radius: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Where items appear',
                default: 320,//160,
                description: 'Radius in pixels of circle items appear along.'
            },

            //right now max seems to be 160 and min seems to be 80
            radius2: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Where items appear',
                default: [180,180,180, 180, 180, 180,180,180],
                array: true,
                description: 'Radius in pixels of circle items appear along.'
            },
            display_time: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Time to show colors',
                default: 1000,
                description: 'Time in ms. to display colors'				
            },
            delay_time: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Time before probe appears',
                default: 0, //800
                description: 'Delay time in ms.'
            },
      
            num_placeholders: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Number of locations where items can appear',
                default: 9,//8,
                description: 'Number of locations where items can appear'
            },			
            min_difference: {
                type: jsPsych.plugins.parameterType.INT,
                pretty_name: 'Min difference between different items',
                default: 15,
                description: 'Min difference between items in degrees of color space (to reduce grouping).'
            },
            bg_color: {
                type: jsPsych.plugins.parameterType.String,
                pretty_name: 'BG color of box for experiment',
                default: 'rgb(180, 182, 182)',
                description: 'BG color of box for experiment.'
            }
        }
    };
     
    plugin.trial = function(display_element, trial) {

        /* Add CSS for classes just once when 
       plugin is first used: 
     --------------------------------*/
        if (!continuous_color_css_added) {
            var css = `
             .contMemoryItem {
                 position: absolute;
                 border-radius: 50%;
                
             }
             .contMemoryChoice {
                 width: 20px;
                 height: 20px;
         border-radius: 50%;
                 cursor: pointer;
                 font-size: 10pt;
                 display: flex;
                 align-items: center;
         justify-content: center;  
             }
       #contMemoryBox {
         display: flex;
         margin: 0 auto;
         align-items: center;
         justify-content: center;  

         background: ${trial.bg_color};
         position: relative;
       }`;
            var styleSheet = document.createElement('style');
            styleSheet.type = 'text/css';
            styleSheet.innerText = css;
            document.head.appendChild(styleSheet);
            continuous_color_css_added = true;
        }
        /* Build basic trial structure: 
         -------------------------------- */
        var item_colors = trial.item_colors;
        var maskNum = trial.maskNum;
        //${trial.bg_color}
        if (trial.item_colors.length==0) {
            item_colors = GetColorsForTrial(trial.set_size, trial.min_difference);
        }
 

        var width = trial.radius * 2 + trial.item_size;
        var height = trial.radius * 2 + trial.item_size;
        
        var center = width/2;
        var startText = ' <br> Click the  +  to start this trial.';
        if (!trial.click_to_start) {	startText = '';	}
        var html = `
         <div id="contMemoryBox" style="
             width:${width}px; 
             height: ${height}px;">`;
        var possiblePositions = [];
        for (var i=0; i < trial.num_placeholders; i++) {
            let curTop = (Math.cos((Math.PI*2)/(trial.num_placeholders)*i)*trial.radius2[i])
                 - trial.item_size/2 + center;
            let curLeft = (Math.sin((Math.PI*2)/(trial.num_placeholders)*i)*trial.radius2[i])
                 - trial.item_size/2 + center;
            html += `<div id="item${i}" class="contMemoryItem" 
                 style="top:${curTop}px; transform: rotate(${0}deg); z-index: 10000; left:${curLeft}px; border-radius: 50%; background-color: '';
         width:${trial.item_size}px; 
         height:${trial.item_size}px"></div>`;
         
                 
            possiblePositions.push(i);
        }

        ///MASK:
        var possiblePositions2 = [];
        for (var i=0; i < trial.num_placeholders; i++) {
            let curTop = (Math.cos((Math.PI*2)/(trial.num_placeholders)*i)*(trial.radius2[i]))
                 - trial.mask_size/2 + center;
            let curLeft = (Math.sin((Math.PI*2)/(trial.num_placeholders)*i)*(trial.radius2[i]))
                 - trial.mask_size/2 + center;
                 
            html += `<div id="item2${i}" class="contMemoryItem" 
                 style="top:${curTop}px; left:${curLeft}px; background-color: '';
         width:${trial.mask_size}px; 
         height:${trial.mask_size}px"></div>`;
         
                 
            possiblePositions2.push(i);
        }



        html += `<span id="contMemoryFixation" style="cursor: pointer; justify-content: center;align-items: center; z-index: 10000;">+</span>
             <div id="contMemoryStartTrial" style="position: absolute; 
                 top:20px">${startText}</div>
             <div id="item-1" class="contMemoryItem" 
                 style="display: none; top:${center-trial.item_size/2}px; left:${center-trial.item_size/2}px; 
         width:${trial.item_size}px; 
         height:${trial.item_size}px; 
         justify-content: center;align-items: center;"></div>
             <div id="reportDiv"></div>
         </div>`;
        display_element.innerHTML = html;
         
       // displayWheel();

        /* Wait for click to start the trial:  
         -------------------------------- */
        // var trial.radius2 = jsPsych.randomization.sampleWithReplacement([160,80,170, 180, 150, 155,161,162], trial.set_size);
        var startTrial = function() {
          //  removeEventListener('click', startTrial);
            document.getElementById('contMemoryStartTrial').style.display = 'none';
            displayWheel();
            document.getElementById('contMemoryFixation').style.cursor = 'none';

            if (trial.click_to_start) {
                display_element.querySelector('#contMemoryFixation').removeEventListener('click', startTrial);
                document.getElementById('contMemoryFixation').style.cursor = 'none';
            }
            document.getElementById('contMemoryFixation').style.cursor = 'none';

            display_element.querySelector('#contMemoryFixation').addEventListener('click', startTrial);
            /*
                set ring clickable false
                setTimeout
                    showStimuli
                        - shows circle, waits x seconds, hides circle
                        - runs callback
                            - setTimeout
                                - shows diff circle, waits x seconds, hides circle
                                - set ring clickable true
                

            */
            // ring unclickable
            jsPsych.pluginAPI.setTimeout(()=>{
                showStimuli(performance.now(), (ts)=>{
                    jsPsych.pluginAPI.setTimeout(()=>[
                        showMask(performance.now(), (ts)=>{
                            // ring clickable
                            delayUntilProbe(ts);
                           //(param)

                        })
                        // ], trial.delay_start);
                    ]);
                });
            }, trial.delay_start);
            
            // jsPsych.pluginAPI.setTimeout(()=>showMask(performance.now()), (trial.delay_start + trial.display_time));
        };
        if (trial.click_to_start) {
            display_element.querySelector('#contMemoryFixation').addEventListener('click', startTrial);


            //     display_element.querySelector('#contMemoryFixation').addEventListener('click', startTrial());
        } else {
            startTrial();
        }
        /* Show the items:  
         -------------------------------- */
        var pos = jsPsych.randomization.sampleWithoutReplacement(possiblePositions, trial.set_size);
        if (trial.item_positions.length>0) {
            pos = trial.item_positions;
        }
        var start_request_anim;
        var last_frame_time;
        var stimCallback;
        var showStimuli = function(ts, callback) {
            if ( trial.display_time > 0 ) {
                for (var i=0; i<trial.set_size; i++) {
                    SetColor('item'+pos[i], item_colors[i]);  
       
                }
            }
            start_request_anim = ts;
            last_frame_time = ts;
            stimCallback = callback;
            hideStimuli(ts);
        };
     
        /* Wait until time to hide stimuli:  
     -------------------------------- */ 
        var actual_stim_duration;
        var hideStimuli = function(ts) {
            var last_frame_duration = ts - last_frame_time;
            last_frame_time = ts;
            if (
                ts - start_request_anim >= trial.display_time - (last_frame_duration/2)
            ) { 
                actual_stim_duration = ts - start_request_anim;
                for (var i=0; i<trial.set_size; i++) {
                    //COMMENT OUT TO GO STRAIGHT TO MASK AND NOT TAKE OFF STIM:
                    // document.getElementById('item'+pos[i]).style.backgroundColor = '';
                }        
                requestAnimationFrame((ts)=>{
                    // delayUntilProbe(ts)
                    stimCallback(ts);
                });
            } else {
                requestAnimationFrame(hideStimuli);
            }
        };
 


        ////////////////////////////////// NOW MASK: ///////////////////////////////////////////
        //  var pos = jsPsych.randomization.sampleWithoutReplacement(possiblePositions, trial.set_size);
        if (trial.item_positions.length>0) {
            pos = trial.item_positions;
        }
        var item_mask_colors = trial.item_mask_colors;
        if (trial.item_mask_colors.length==0) {
            item_mask_colors = GetColorsForTrial(trial.set_size, trial.min_difference);
        }
        var start_request_mask_anim;
        var last_mask_frame_time;
        var maskCallback;
        var showMask = function(ms, callback) {
            if ( trial.mask_display_time > 0 ) {
                for (var i=0; i<trial.set_size; i++) {
                //    SetColor('item'+pos[i], item_mask_colors[i]); 
                    //  SetItem('item'+pos[i]);
                    SetItem('item2'+pos[i],trial,trial.maskArray[0][i][0], trial);
                


                    //document.getElementById('item'+pos[i]);
                    //let image.src = "img/YKey.png"
                    //drawImage(image, x, y)
                    
                }
            }
            start_request_mask_anim = ms;
            last_mask_frame_time = ms;
            maskCallback = callback;
            hideMask(ms);
        };
 
        /* Wait until time to hide mask:  
 -------------------------------- */ 
        var actual_mask_duration;
        var hideMask = function(ms) {
            var last_mask_frame_duration = ms - last_mask_frame_time;
            last_mask_frame_time = ms;
            if (ms - start_request_mask_anim 
     >= trial.mask_display_time - (last_mask_frame_duration/2)) { 
                actual_mask_duration = ms - start_request_mask_anim;
                for (var i=0; i<trial.set_size; i++) {
                    
                    //COMMENT IN TO GO STRAIGHT TO MASK AND NOT TAKE OFF STIM:
                    document.getElementById('item'+pos[i]).style.backgroundColor = '';
                    //cm added:
                    document.getElementById('item2'+pos[i]).style.backgroundImage = '';
                }        
                requestAnimationFrame((ts)=>{
                    maskCallback(ts);
                    // delayUntilProbe(ts);
                });
            } else {
                requestAnimationFrame(hideMask);
            }        
        };





        var maskNum = trial.maskNum;



        ////////////////////////////////// NOW probe: ///////////////////////////////////////////
        /* Wait until time to show probe:  
     -------------------------------- */ 
        var delayUntilProbe = function(ts) {
            var last_frame_duration = (ts)- last_frame_time;
            last_frame_time = ts;
            if (ts - start_request_anim 
         >= trial.display_time + trial.delay_time - (last_frame_duration/2)) { 
                getResponse();
            } else { 
                requestAnimationFrame(delayUntilProbe);
            }
        };
         
        /* Show response wheel:  
         -------------------------------- */
        let wheel_spin = trial.spinAmt;
        // if (trial.color_wheel_spin) {
        // wheel_spin = getRandomIntInclusive(0,359);
        // }
        var wheel_radius = trial.radius + (trial.item_size/4) + 5;
        var response_angle;
        var start_time;
        var updateAngle = function(e) {
            var rect = document.getElementById('reportDiv').getBoundingClientRect();
            var relX = e.clientX - rect.left; //+ center; 
            var relY = e.clientY - rect.top; //+ center;  
            var curAngle = Math.atan2(relY,relX);
            response_angle = curAngle / Math.PI * 180.0;
            response_angle = (response_angle < 0) ? response_angle+360:response_angle;
        };
        var wheelOptions = [];
        var curResponseNum = 1;

        
        function displayWheel(){
            var wheelOptions = [];

            let wheel_spin = trial.spinAmt;
     
       
                    
            var html = `<div id='backgroundRing' 
            style='border: border-radius: 50%;
                position: absolute;
                top: 17.5px;
                left: 17.5px;
                width: ${wheel_radius*2}px;
                height: ${wheel_radius*2}px'>&nbsp;
        </div>`;

            wheelOptions = new Array();
            if (trial.color_wheel_list_options.length>0) {
                for (var i=0; i<trial.color_wheel_list_options.length; i++) {
                    wheelOptions.push(
                        wrap(
                            trial.color_wheel_list_options[i] + item_colors[trial.which_test]
                        )
                    );
                }
            } else {
                var stepSize = 360 / trial.color_wheel_num_options;
                var st = (trial.which_test==-1) ? 0 : item_colors[trial.which_test];
                for (var i=st; 
                    i>=st-360; 
                    i-=stepSize) {
                    wheelOptions.push(i);
                }
            }


            for (var i=0; i<wheelOptions.length; i++) {
                var deg = wrap(wheelOptions[i]);
                var col = getColor(deg);
                var positionDeg = wrap(deg + wheel_spin);
                var topPx = center-10 + wheel_radius * Math.sin(positionDeg/180.0*Math.PI);
                var leftPx = center-10 + wheel_radius * Math.cos(positionDeg/180.0*Math.PI);    
                html += `<div class='contMemoryChoice' colorClicked='${deg}' 
                id='colorRing${deg}' style='position:absolute;
            background-color: rgb(${Math.round(col[0])}, ${Math.round(col[1])}, 
            ${Math.round(col[2])}); top: ${topPx}px; left: ${leftPx}px;'></div>`;
            }

            document.getElementById('reportDiv').innerHTML = html;

        }

        var getResponse = function() {
             
            start_time = performance.now();
            if (trial.which_test==-1) {
                // document.getElementById('item-1').style.display = 'block';
                // document.getElementById('item-1').style.border = '5px solid black';
            } //else {
                //document.getElementById('item' + pos[trial.which_test]).style.border = '3px solid black';
           // }
             
           for (var i=0; i<trial.set_size; i++) {
            //    SetColor('item'+pos[i], item_mask_colors[i]); 
            //  SetItem('item'+pos[i]);
            //SetItem('item2'+pos[i],trial,trial.maskArray[0][i][0], trial);
           // document.getElementById('item' + pos[i]).style.border = '3px dashed black';


            //document.getElementById('item'+pos[i]);
            //let image.src = "img/YKey.png"
            //drawImage(image, x, y)
                
        }
        //document.getElementById('item' + pos[trial.which_test]).style.border = '5px solid black';



            document.addEventListener('mousemove', updateAngle);			
            Array.from(document.getElementsByClassName('contMemoryChoice')).forEach(function(e) {
                e.addEventListener('click', judge_response);
            });
        };
         
        /* Calc. error & give feedback */
        var trial_errs = new Array();
        var reported_angle_contin = new Array();
        var reported_color_contin = new Array();
        var cols_clicked = new Array();
        var end_click_times = new Array();
        var judge_response = function(e){ 
            end_click_times.push(performance.now()- start_time);
            var colClicked = this.getAttribute('colorClicked');
            document.getElementById('colorRing'+colClicked).
                removeEventListener('click', judge_response);
 
            cols_clicked.push(parseInt(colClicked));
            reported_angle_contin.push(response_angle);
            reported_color_contin.push(wrap(response_angle - wheel_spin));
             
            if (trial.which_test==-1) {
                var err = undefined;
            } else {
                var err = Math.round(wrap(response_angle - wheel_spin))
                      - item_colors[trial.which_test];
                if (trial.color_wheel_list_options.length>0 
                         || trial.color_wheel_num_options<360) {
                    err = colClicked - item_colors[trial.which_test];
                }
                if (err>180) { err-=360; }
                if (err<=-180) { err+=360; }
            }
            trial_errs.push(err);
             
            if (trial.responses_per_item!=1) {
                var ringClick = document.getElementById('colorRing'+colClicked);
                //ringClick.style.border = '2px solid black';
                ringClick.style.cursor = 'none';
                ringClick.style.zIndex = curResponseNum;
                ringClick.innerHTML = curResponseNum;
            }
             
            if (curResponseNum != trial.responses_per_item) {
                curResponseNum++;
                return;
            }
             
            document.removeEventListener('mousemove', updateAngle);
            Array.from(document.getElementsByClassName('contMemoryChoice')).forEach(function(e) {
                e.removeEventListener('click', judge_response);
            });
            if (trial.feedback) {
                SetColor('item'+pos[trial.which_test], item_colors[trial.which_test]); 
                var ringClick = document.getElementById('colorRing' + item_colors[trial.which_test]);
                //ringClick.style.border = '4px solid black';
                ringClick.style.zIndex = 100;
                if (trial.responses_per_item==1) {
                    document.getElementById('contMemoryFixation').innerHTML = 
                         'You were off by<br>' + Math.abs(err) + ' degrees.';
                } else {
                    document.getElementById('contMemoryFixation').innerHTML = 
                         'Correct answer<br>is highlighted.';					
                }
                setTimeout(function() { 
                    endTrial();
                }, 5 * 1000);//5 * 1000
            } else {
                setTimeout(endTrial, 0); //100
            }
        };
 
        /* End trial and record information:  
         -------------------------------- */		
        var endTrial = function(){
            //console.log(cols_clicked);
            var trial_data = {
                'rt': end_click_times,
                'responseFINAL': cols_clicked,

                "startingAngle": wheel_spin,
                'response_angle': response_angle,
                'physical_response_angle': reported_angle_contin,
                'reported_color_angle': reported_color_contin,
                'reported_color_discrete': cols_clicked,
                'actual_mask_duration': actual_mask_duration,
                'colors_of_items': item_colors,
                'color_of_target': item_colors[0],
                'allColors': item_colors,
                'physical_response_angle': reported_angle_contin,
                'which_test': trial.which_test,
                'set_size': trial.set_size,
                'eccentricities': trial.radius2,
                'targetEcc': trial.radius2[0],
                'masks': trial.maskArray,
                'error': trial_errs,
                // 'position_of_items': pos,
                
                // 'position_of_items': pos,
               
                // 'wheel_spin': wheel_spin,
                // 'response_angle': response_angle,
                // 'physical_response_angle': reported_angle_contin,
                // 'reported_color_angle': reported_color_contin,
                // 'reported_color_discrete': cols_clicked,
                // 'locs': trial.radius2,
                // //'error': trial_errs,
                // 'which_test': trial.which_test,
                // 'set_size': trial.set_size,
                // 'wheel_num_options': wheelOptions.length,
                // 'actual_mask_duration': actual_mask_duration,
                // 'actual_stim_duration': actual_stim_duration,
                // 'set_size': trial.set_size
            };
            display_element.innerHTML = '';
            jsPsych.finishTrial(trial_data);
        };
     
    };
 
    /* Helper functions
      ------------------------------ */
      
    /* Set an element to a color given in degrees of color wheel */
    function SetColor(id, deg) {
        deg=(deg>=360) ? deg-360:deg;
        deg=(deg<0) ? deg+360:deg;
        var col = getColor(deg);
        document.getElementById(id).style.backgroundColor = 'rgb('
             + Math.round(col[0])+','
             + Math.round(col[1])+','
             + Math.round(col[2])+')';

             document.getElementById(id).style.zIndex = 10000000;
    }




    //  deg=(deg>=360) ? deg-360:deg;
    // deg=(deg<0) ? deg+360:deg;
    // document.getElementById(id).style.backgroundImage = `url('${myImg.toString()}')`;
        


 
    function SetItem(id, deg, myImg, trial) {
        deg=(deg>=360) ? deg-360:deg;
        deg=(deg<0) ? deg+360:deg;
        document.getElementById(id).style.backgroundColor = '';
        document.getElementById(id).style.backgroundImage = '';
      // document.getElementById(id).style.backgroundImage = `url('${myImg.toString()}')`;
      //  document.getElementById(id).style.backgroundImage = `url('${myImg}')`;
    }

//GOOD VERSION!



    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

 
    /* Get colors subject to constraint that all items are a min.
       difference from each other: */
    function GetColorsForTrial(setSize, minDiff) {
        var items = [];
        var whichCol = getRandomIntInclusive(0,359);
        items.push(whichCol);
         
        for (var j=1; j<=setSize-1; j++) {
            var validColors = new Array();
            for (var c=0;c<360; c++) { 
                isValid = !tooClose(whichCol,c, minDiff);
                for (var testAgainst=0;testAgainst<j;testAgainst++) {
                    if (isValid && tooClose(items[testAgainst],c,minDiff)) {
                        isValid = false;
                    }
                }
                if (isValid) {
                    validColors.push(c); 
                }
            }
            validColors = jsPsych.randomization.shuffle(validColors);
            items.push(validColors[0]);
        }
        return items;
    }
 
    /* Make sure all numbers in an array are between 0 and 360: */
    function wrap(v) {
        if (Array.isArray(v)) {
            for (var i=0; i<v.length; i++) {
                if (v[i]>=360) { v[i]-=360; }
                if (v[i]<0) { v[i]+=360; }
            }    
        } else {
            if (v>=360) { v-=360; }
            if (v<0) { v+=360; }
        }
        return v;
    } 


 
 
    function tooClose(startcol,endcol,minDiff) {
        if (isNaN(startcol) || isNaN(endcol)) {
            return false;
        }
        if (Math.abs(startcol-endcol)<=minDiff) {
            return true;
        }
        if (Math.abs(startcol+360 - endcol)<=minDiff) {
            return true;
        }	
        if (Math.abs(startcol-360 - endcol)<=minDiff) {
            return true;
        }		
        return false;
    }
 
    function getColor(deg) {
        let colorsList = calibrationFile;
        return colorsList[deg];
    }
 
    return plugin;
})();