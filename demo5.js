/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
//****************************//
//The great and wonderful ladybug game
//Designed by Caroline MYERS, Chaz FIRESTONE, and Justin HALBERDA (Johns Hopkins)
//Written by Caroline MYERS (Johns Hopkins)- [11/23/23]
//Last updated by Caroline MYERS (Johns Hopkins)- [11/25/23]

//****************************//

//////////////////*************************VARIABLES AND CONSTANTS********************//////////////////
const pilotMode = 1; // 1 for pilot mode on, 0 for pilot mode off
const saveDataToServer = 0;
const saveDataLocally = 0;
const saveTrialStructure = 0;
const fullScreen = 0;
const numReps = 1;
const fadey = 1; //if set to 1, they fade in and out. If 0, they remain onscreen. 
var response_choices = ['ArrowLeft', 'ArrowRight'];
const numTrialsBreak = 15;//15;//15;
//defining our constants
const ladyBugSize = 150;//80;//80; //20
const ladyBugDotSize = 10;//10;//10;//15;
const edgeBuffer = 20; //distance of dots from edge of ladybug
const internalDotBuffer = 5; // distance of dots from one another
const distFromBoundary = 150;//100; //40
const TOTAL_AREA = 4000; // Set the constant cumulative area for the dots
const fixCrossSize = 60;



function ccw(a, b, c) {
    return (a.x - b.x) * (c.y - b.y) - (c.x - b.x) * (a.y - b.y);
}


function polarAngle(a, b, c) {
    let x = (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y);
    let y = (a.x - b.x) * (c.y - b.y) - (c.x - b.x) * (a.y - b.y);
    return Math.atan2(y, x);
}

/**
 * From a list of points on a plane returns an ordered sequence of points on the hull 

 */
p_list  = [ [236, 126], [234, 115], [238, 109], [247, 102]];
function convexHull(p_list) {
    if (p_list.length < 3) return p_list;

    let hull = [];
    let tmp;

    // Find leftmost point
    tmp = p_list[0];
    for (const p of p_list) if (p.x < tmp.x) tmp = p;

    hull[0] = tmp;

    let endpoint, secondlast;
    let min_angle, new_end;

    endpoint = hull[0];
    secondlast = new Point(endpoint.x, endpoint.y + 10);

    do {
        min_angle = Math.PI; // Initial value. Any angle must be lower that 2PI
        for (const p of p_list) {
            tmp = polarAngle(secondlast, endpoint, p);

            if (tmp <= min_angle) {
                new_end = p;
                min_angle = tmp;
            }
        }
        if (new_end != hull[0]) {
            hull.push(new_end);
            secondlast = endpoint;
            endpoint = new_end;
        }
    } while (new_end != hull[0]);

    return hull;
}

function create_edges(p_list) {
    let edges = [];
    let last_point = p_list[0];

    for (let i = 1; i < p_list.length; i++) {
        edges.push(new Edge(last_point, p_list[i]));
        last_point = p_list[i];
    }

    edges.push(new Edge(last_point, p_list[0]));
    return edges;
}

function calcPolygonArea(vertices) {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i].x;
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
      var subY = vertices[i].y;

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
}

function shoelace(vertices) {
    let area = 0;
    const n = vertices.length;
    
    for (let i = 0; i < n; i++) {
      const [x1, y1] = vertices[i];
      const [x2, y2] = vertices[(i + 1) % n];
      area += (x1 * y2) - (x2 * y1);
    }
    
    return Math.abs(area) / 2;
  }
  
	// (X[i], Y[i]) are coordinates of i'th point.
	function polygonArea(X, Y, n)
	{
		// Initialize area
		let area = 0.0;
	
		// Calculate value of shoelace formula
		let j = n - 1;
		for (let i = 0; i < n; i++)
		{
			area += (X[j] + X[i]) * (Y[j] - Y[i]);
			
			// j is previous vertex to i
			j = i;
		}
	
		// Return absolute value
		return Math.abs(area / 2.0);
	} 

// Driver Code
		let X = [0, 2, 4];
		let Y = [1, 3, 7];
	
		let n = 3;
		//console.log(polygonArea(X, Y, n));

function calcPolygonArea(vertices) {
    var total = 0;

    for (var i = 0, l = vertices.length; i < l; i++) {
      var addX = vertices[i].x;
      var addY = vertices[i == vertices.length - 1 ? 0 : i + 1].y;
      var subX = vertices[i == vertices.length - 1 ? 0 : i + 1].x;
      var subY = vertices[i].y;

      total += (addX * addY * 0.5);
      total -= (subX * subY * 0.5);
    }

    return Math.abs(total);
}

// S = set of points
// H = points of the convex hull
// p0 = leftmost point
// H[0] = p0
// do{
// 	for(p in S){
// 		calculate angle between p and last segment in the hull
// 	}
// 	add to H the point with the minimum angle
// }while endpoint != H[0]
//////////////////*************************GET PROLIFIC INFO********************//////////////////
const PROLIFICLINK = 'https://app.prolific.co/submissions/complete?cc=1FE217EC';
// capture info from Prolific
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

if (typeof subject_id == 'undefined') {
    subject_id = Date.now();
}
if (typeof study_id == 'undefined') {
    study_id = 'demo5';
}
if (typeof session_id == 'undefined') {
    session_id = 'today';
}
if (typeof subject_id !== 'string') {
    subject_id = subject_id.toString();
}
jsPsych.data.addProperties({
    subject_id: subject_id,
    study_id: study_id,
    session_id: session_id,
});
//////////////////*************************PRELOAD AND DEFINE OUR STIM********************//////////////////

const adapterRatios = [
    { left: 5, right: 20, middle: 10 },
    { left: 7, right: 28, middle: 14 },
    { left: 10, right: 40, middle: 20 },
];


    const PSETrialValues_LargeAdapt = [
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 12},   // 1:2:4 ratio
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 14},
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 17},
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 20},
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 24},
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 29},
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 34},
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 40},
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 48},
    
        //reverse:
        //right adapter is always adapter, right test is always test
        //left adapter is always neutral, left test is always probe
          ///leftTest is always probe
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 12},   // 1:2:4 ratio
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 14},
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 17}, 
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 20}, 
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 24},   // 1:2:4 ratio
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 29},
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 34}, 
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 40}, 
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 48}, 
    ];
    


    const PSETrialValues_Baseline = [
        { leftAdapter: 12, rightAdapter: 24, rightTest: 24, leftTest: 12},   // 1:2:4 ratio
        { leftAdapter: 14, rightAdapter: 24, rightTest: 24, leftTest: 14},
        { leftAdapter: 17, rightAdapter: 24, rightTest: 24, leftTest: 17},
        { leftAdapter: 20, rightAdapter: 24, rightTest: 24, leftTest: 20},
        { leftAdapter: 24, rightAdapter: 24, rightTest: 24, leftTest: 24},
        { leftAdapter: 29, rightAdapter: 24, rightTest: 24, leftTest: 29},
        { leftAdapter: 34, rightAdapter: 24, rightTest: 24, leftTest: 34},
        { leftAdapter: 40, rightAdapter: 24, rightTest: 24, leftTest: 40},
        { leftAdapter: 48, rightAdapter: 24, rightTest: 24, leftTest: 48},
    
        //reverse:
        //right adapter is always adapter, right test is always test
        //left adapter is always neutral, left test is always probe
          ///leftTest is always probe
        { rightAdapter: 12, leftAdapter: 24, leftTest: 24, rightTest: 12},   // 1:2:4 ratio
        { rightAdapter: 14, leftAdapter: 24, leftTest: 24, rightTest: 14},
        { rightAdapter: 17, leftAdapter: 24, leftTest: 24, rightTest: 17}, 
        { rightAdapter: 20, leftAdapter: 24, leftTest: 24, rightTest: 20}, 
       // { rightAdapter: 24, leftAdapter: 24, leftTest: 24, rightTest: 24},   // 1:2:4 ratio
        { rightAdapter: 29, leftAdapter: 24, leftTest: 24, rightTest: 29},
        { rightAdapter: 34, leftAdapter: 24, leftTest: 24, rightTest: 34}, 
        { rightAdapter: 40, leftAdapter: 24, leftTest: 24, rightTest: 40}, 
        { rightAdapter: 48, leftAdapter: 24, leftTest: 24, rightTest: 48}, 
    ];

    
        // //adapting to small makes middle larger
       const PSETrialValues_SmallAdapt = [
             { leftAdapter: 24, rightAdapter: 48, rightTest: 48, leftTest: X}, 
       ]
 
     


  const largerAdapterPositions = ['left', 'right'];
  const delayDurations = [1000];
  //const delayDurations = [500, 1000, 2000];
  const numFadeCycles = [3]; //[2, 3, 6];
  

  const numTrialsMultiplier = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20, 21]; 
  //const numTrialsMultiplier = [1]; 
  // Utility function to shuffle an array
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Function to swap left and right positions on a trial
function swapSides(trial) {
    return {
      ...trial,
      leftAdapter: trial.rightAdapter,
      rightAdapter: trial.leftAdapter,
      leftTest: trial.rightTest,
      rightTest: trial.leftTest
    };
  }
  

  // Generate a balanced set of base trials
  function generateBaseTrials() {
    let trials = [];
    numTrialsMultiplier.forEach(multiplier => { 
    adapterRatios.forEach(ratio => {
      largerAdapterPositions.forEach(position => {
        delayDurations.forEach(delay => {
          numFadeCycles.forEach(cycle => {
            let trial = {
              leftAdapter: position === 'left' ? ratio.right : ratio.left,
              rightAdapter: position === 'right' ? ratio.right : ratio.left,
              middleValue: ratio.middle,
              delayDuration: delay,
              numFadeCycles: cycle
            };
            trials.push(trial);
          });
        });
      });
    });
});
    return shuffle(trials);
  }
  
  // Create the full trial design by extending the base trials
  function createfull_design(baseTrials) {
    let full_design = [];
  
    let trialTypeCounts = {
        PSETrials_LargeAdapt: 0,
        PSETrials_SmallAdapt: 0,
        PSETrials_Baseline: 0,
        oneAdapterReturnsLarger: 0,
        oneAdapterReturnsSmaller: 0,
        sameAdaptDifferentTest: 0,
        random: 0
      };
    
      const totalTrials = baseTrials.length; // assuming you want to create one of each type per baseTrial
      const trialTypeLimits = {
        PSETrials_LargeAdapt: totalTrials * .5, // .9//.76,//0.5,
      PSETrials_SmallAdapt: totalTrials * 0,//.76,//0.5,
      PSETrials_Baseline: totalTrials * .5, //.1
      //  oneAdapterReturnsLarger: totalTrials * .08,//0.1, // Adjusted for split between larger and smaller
      //  oneAdapterReturnsSmaller: totalTrials * .08,//0.1,
      //  sameAdaptDifferentTest: totalTrials * .08, //0.2,
      //  differentAdaptSameTest: totalTrials * .08, //0.2, .16
        //random: totalTrials * 0.1
      };

   

    baseTrials.forEach(baseTrial => {
        // Calculate the middle value for test stimuli
       // let middleValue = (baseTrial.leftAdapter + baseTrial.rightAdapter) / 2;
        let middleValue = baseTrial.middleValue;
        // 50% of trials: Different adapters, test at the same number
       if (trialTypeCounts.differentAdaptSameTest < trialTypeLimits.differentAdaptSameTest) {
        full_design.push({
          ...baseTrial,
          leftTest: middleValue,
          rightTest: middleValue,
          trialType: 'differentAdaptSameTest'
        });
        trialTypeCounts.differentAdaptSameTest++;
      }
      if (trialTypeCounts.PSETrials_LargeAdapt < trialTypeLimits.PSETrials_LargeAdapt) {
        full_design.push({
          ...baseTrial,
          leftTest: middleValue,
          rightTest: middleValue,
 
          trialType: 'PSETrials_LargeAdapt'
        });
        trialTypeCounts.PSETrials_LargeAdapt++;
      }

      if (trialTypeCounts.PSETrials_Baseline < trialTypeLimits.PSETrials_Baseline) {
        full_design.push({
          ...baseTrial,
          leftTest: middleValue,
          rightTest: middleValue,
 
          trialType: 'PSETrials_Baseline'
        });
        trialTypeCounts.PSETrials_Baseline++;
      }


      if (trialTypeCounts.PSETrials_SmallAdapt < trialTypeLimits.PSETrials_SmallAdapt) {
        full_design.push({
          ...baseTrial,
          leftTest: middleValue,
          rightTest: middleValue,
          trialType: 'PSETrials_SmallAdapt'
        });
        trialTypeCounts.PSETrials_SmallAdapt++;
      }
      
  
      // 20% of trials: One of the adapters comes back at the same location for test
      // Split this into two parts: larger adapter returns and smaller adapter returns
      if (trialTypeCounts.oneAdapterReturnsLarger < trialTypeLimits.oneAdapterReturnsLarger) {
      full_design.push({
        ...baseTrial,
        leftTest: baseTrial.leftAdapter === Math.min(baseTrial.leftAdapter, baseTrial.rightAdapter) ? middleValue : baseTrial.leftAdapter,
        rightTest: baseTrial.rightAdapter === Math.min(baseTrial.leftAdapter, baseTrial.rightAdapter) ? middleValue : baseTrial.rightAdapter,
        trialType: 'oneAdapterReturnsLarger'

      });
      trialTypeCounts.oneAdapterReturnsLarger++;
    }

    if (trialTypeCounts.oneAdapterReturnsSmaller < trialTypeLimits.oneAdapterReturnsSmaller) {
      full_design.push({
        ...baseTrial,
        leftTest: baseTrial.leftAdapter === Math.max(baseTrial.leftAdapter, baseTrial.rightAdapter) ? middleValue : baseTrial.leftAdapter,
        rightTest: baseTrial.rightAdapter === Math.max(baseTrial.leftAdapter, baseTrial.rightAdapter) ? middleValue : baseTrial.rightAdapter,
        trialType: 'oneAdapterReturnsSmaller'
      });
      trialTypeCounts.oneAdapterReturnsSmaller++;
    }
  

      // 20% of trials: Adapters are the same, test stimuli are different and drawn from the ratios
          // For these trials, we choose one of the ratios and use its 'middle' for both adapters
    let randomRatioIndex = Math.floor(Math.random() * adapterRatios.length);
    let adaptValue = adapterRatios[randomRatioIndex].middle;
   
    if (trialTypeCounts.sameAdaptDifferentTest < trialTypeLimits.sameAdaptDifferentTest) {
    full_design.push({
      leftAdapter: adaptValue,
      rightAdapter: adaptValue,
      middleValue: adaptValue,
      delayDuration: baseTrial.delayDuration,
      numFadeCycles: baseTrial.numFadeCycles,
      leftTest: adapterRatios[randomRatioIndex].left, // different from adaptValue
      rightTest: adapterRatios[randomRatioIndex].right, // different from adaptValue and leftTest
      trialType: 'sameAdaptDifferentTest'
    });
    trialTypeCounts.sameAdaptDifferentTest++;
}
      
    //   full_design.push({
    //     ...baseTrial,
    //     leftTest: baseTrial.leftAdapter, // Using the same value as the adapter
    //     rightTest: baseTrial.rightAdapter !== middleValue ? baseTrial.rightAdapter : baseTrial.leftAdapter, // Ensuring a different value
    //     trialType: 'sameAdaptDifferentTest'
    //   });
  
      // 10% of trials: Completely random
    //   let randomRatio = adapterRatios[Math.floor(Math.random() * adapterRatios.length)];
    //   if (trialTypeCounts.random < trialTypeLimits.random) {
    //   full_design.push({
    //     ...baseTrial,
    //     leftTest: randomRatio.middle,
    //     rightTest: randomRatio.middle,
    //     trialType: 'random'
    //   });
    //   trialTypeCounts.random++;
    // }
    });

  // Add randomization of left/right positions
  full_design = full_design.map(trial => Math.random() < 0.5 ? swapSides(trial) : trial);

    return shuffle(full_design); // Randomize the trial order
  }

  // Generate trials and create full design
  let baseTrials = generateBaseTrials();
  let full_design = createfull_design(baseTrials);
  
  
  // Now full_design is an array of trial objects with all the necessary properties
 
  
//Truncated:
let full_design_short = full_design.slice(0, 5);
  
// Now, if we ever want to cut down the number of trials: 
function resetExperimentLayout() {
    // Select the instruction container element and remove it or reset its styles
    var instructionContainer = document.getElementById('instruction-container');
    if (instructionContainer) {
        instructionContainer.removeAttribute('style');
        // Or if you want to remove the container entirely
        // instructionContainer.parentNode.removeChild(instructionContainer);
    }
    // Any other reset actions go here
}


function reduceTrials(full_design, targetCount) {
    const categories = {
        PSETrials_LargeAdapt: [],
        PSETrials_SmallAdapt: [],
        PSETrials_Baseline: [],
      oneAdapterReturnsLarger: [],
      oneAdapterReturnsSmaller: [],
      sameAdaptDifferentTest: [],
      random: []
    };
  
    // Categorize trials
    full_design.forEach(trial => {
      categories[trial.trialType].push(trial);
    });
  
    // Determine how many trials to select from each category
    const totalCount = full_design.length;
    const proportion = targetCount / totalCount;
  
    // Use proportion to calculate how many trials we need from each category
    let reduced_design = [];
    Object.keys(categories).forEach(trialType => {
      const numToSelect = Math.round(categories[trialType].length * proportion);
      reduced_design = reduced_design.concat(shuffle(categories[trialType]).slice(0, numToSelect));
    });
  
    // Shuffle the reduced design to ensure random order
    return shuffle(reduced_design);
  }
  
  let reduced_design = reduceTrials(full_design, 180);

  


 // now pull out and redefine pse trials
 // Calculate the total number of PSETrials and initialize counters
const PSETrials_LargeAdapt_Count = PSETrialValues_LargeAdapt.length;  // This is 6 for the current PSETrialValues_LargeAdapt
let trialIndex = 0;

// Loop through full_design to assign PSETrialValues_LargeAdapt to PSETrials
full_design.forEach((trial) => {
  if (trial.trialType === 'PSETrials_LargeAdapt') {
    // Assign one of the PSETrialValues_LargeAdapt to this PSE trial in a round-robin fashion
    const currentPSEValues = PSETrialValues_LargeAdapt[trialIndex % PSETrials_LargeAdapt_Count];
    
    // Update trial properties with the current PSETrialValues_LargeAdapt
    trial.leftAdapter = currentPSEValues.leftAdapter;
    trial.rightAdapter = currentPSEValues.rightAdapter;
    trial.leftTest = currentPSEValues.leftTest;
    trial.rightTest = currentPSEValues.rightTest;
    
    // Move to the next PSETrialValues_LargeAdapt item in round-robin fashion
    trialIndex++;
  }
});


const PSETrials_Baseline_Count = PSETrialValues_Baseline.length;  // This is 6 for the current PSETrialValues_LargeAdapt


// Loop through full_design to assign PSETrialValues_LargeAdapt to PSETrials
full_design.forEach((trial) => {
  if (trial.trialType === 'PSETrials_Baseline') {
    // Assign one of the PSETrialValues_LargeAdapt to this PSE trial in a round-robin fashion
    const currentPSEValues = PSETrialValues_Baseline[trialIndex % PSETrials_Baseline_Count];
    
    // Update trial properties with the current PSETrialValues_LargeAdapt
    trial.leftAdapter = currentPSEValues.leftAdapter;
    trial.rightAdapter = currentPSEValues.rightAdapter;
    trial.leftTest = currentPSEValues.leftTest;
    trial.rightTest = currentPSEValues.rightTest;
    
    // Move to the next PSETrialValues_LargeAdapt item in round-robin fashion
    trialIndex++;
  }
});

 // now pull out and redefine pse trials
 // Calculate the total number of PSETrials and initialize counters
 const PSETrials_SmallAdapt_Count = PSETrialValues_SmallAdapt.length;  // This is 6 for the current PSETrialValues_LargeAdapt

 trialIndex = 0;
 // Loop through full_design to assign PSETrialValues_LargeAdapt to PSETrials
 full_design.forEach((trial) => {
   if (trial.trialType === 'PSETrials_SmallAdapt') {
     // Assign one of the PSETrialValues_LargeAdapt to this PSE trial in a round-robin fashion
     const currentPSEValues = PSETrialValues_SmallAdapt[trialIndex % PSETrials_SmallAdapt_Count];
     
     // Update trial properties with the current PSETrialValues_LargeAdapt
     trial.leftAdapter = currentPSEValues.leftAdapter;
     trial.rightAdapter = currentPSEValues.rightAdapter;
     trial.leftTest = currentPSEValues.leftTest;
     trial.rightTest = currentPSEValues.rightTest;
     
     // Move to the next PSETrialValues_LargeAdapt item in round-robin fashion
     trialIndex++;
   }
 });
const totalNumTrials = full_design.length;




for (let i = 0; i < full_design.length; i++) {

   if (full_design[i].trialType === 'PSETrials_LargeAdapt') {

    // if left side is adapted and tested and right side is neutral and probe
    if (full_design[i].leftAdapter === 48) {

        full_design[i].adapter_number = full_design[i].leftAdapter;
        full_design[i].neutral_number = full_design[i].rightAdapter;

        full_design[i].test_number = full_design[i].leftTest;
        full_design[i].probe_number = full_design[i].rightTest;


        // otherwise if right side is adapted and tested and left side is neutral and probe
    } else if (full_design[i].rightAdapter === 48) {

        full_design[i].adapter_number = full_design[i].rightAdapter;
        full_design[i].neutral_number = full_design[i].leftAdapter;

        full_design[i].test_number = full_design[i].rightTest;
        full_design[i].probe_number = full_design[i].leftTest;
   }
   // now for small adapts
    } else if (full_design[i].trialType === 'PSETrials_SmallAdapt') {

        // if the adapt side (where you're shown a small amount) is the left side...
        if (full_design[i].leftAdapter === 24) {
            // then left side is the adapter, left side is the test, right side is neutral at 80, right side is probe at 80?
            full_design[i].adapter_number = full_design[i].leftAdapter;
            full_design[i].neutral_number = full_design[i].rightAdapter;
    
            full_design[i].test_number = full_design[i].leftTest;
            full_design[i].probe_number = full_design[i].rightTest;
        } else if (full_design[i].rightAdapter === 24) {

            full_design[i].adapter_number = full_design[i].rightAdapter;
            full_design[i].neutral_number = full_design[i].leftAdapter;
    
            full_design[i].test_number = full_design[i].rightTest;
            full_design[i].probe_number = full_design[i].leftTest;
        }
    } else if (full_design[i].trialType === 'PSETrials_Baseline') {
        // full_design[i].adapter_number = 0;
        // full_design[i].neutral_number = 0;

        if (full_design[i].rightAdapter === 24 && full_design[i].leftTest !== 24) {
            // then left side is the adapter, left side is the test, right side is neutral at 80, right side is probe at 80?
    
            full_design[i].adapter_number = full_design[i].leftAdapter;
            full_design[i].neutral_number = full_design[i].rightAdapter;

            full_design[i].test_number = full_design[i].leftTest;
            full_design[i].probe_number = full_design[i].rightTest;
            
        } else if (full_design[i].leftAdapter === 24 && full_design[i].rightTest !== 24) {

            full_design[i].adapter_number = full_design[i].rightAdapter;
            full_design[i].neutral_number = full_design[i].leftAdapter;

            full_design[i].test_number = full_design[i].rightTest;
            full_design[i].probe_number = full_design[i].leftTest;
        } else { //the rest of the 24s
            full_design[i].adapter_number = full_design[i].rightAdapter;
            full_design[i].neutral_number = full_design[i].leftAdapter;

            full_design[i].test_number = full_design[i].rightTest;
            full_design[i].probe_number = full_design[i].leftTest;
        }
    }
}

        // if (full_design[i].leftTest === 24 && full_design[i].leftTest !== 24) {
        //     // then left side is the adapter, left side is the test, right side is neutral at 80, right side is probe at 80?
    
        //     full_design[i].adapter_number = 0;
        //     full_design[i].neutral_number = 0;

        //     full_design[i].test_number = full_design[i].rightTest;
        //     full_design[i].probe_number = full_design[i].leftTest;
        // } else if (full_design[i].rightTest === 24) {

        //     full_design[i].test_number = full_design[i].leftTest;
        //     full_design[i].probe_number = full_design[i].rightTest;
        // }


//fisher-yates shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index between 0 and i
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}

// Shuffle your full_design array
full_design = shuffleArray(full_design);
//var full_design = jsPsych.randomization.factorial(factors, numReps); //35


const canvas = document.getElementById('experimentCanvas');

const timeline = [];
// On the top of your code


canvas.width = window.innerWidth;// canvasSizeX;
canvas.height = window.innerHeight; //canvasSizeY;

function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement('a'),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}
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


//////////////////*************************TIMELINR ********************//////////////////

const allImgs = ['img/demo5Welcome.png','img/ladybug.png'];

var preload = {
    type: 'preload',
    images: allImgs,
    audio: ['responseTone.mp3'],
    video: ["video/TaskInstructions3.mp4", "video/endTraining.mp4",'video/hiThere.mp4'],
    show_detailed_errors: true 
};
timeline.push(preload);


var demo5Welcome = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/demo5Welcome.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
    response_ends_trial: true,
    on_finish: function(data) {
        //console.log('A trial just sorta ended.');
        data.realTrialType = 'demo5welcome';
      },
};

timeline.push(demo5Welcome);



if (fullScreen == 1) {
    timeline.push({
        type: 'fullscreen',
        fullscreen_mode: true
    });
}

var intro_T1_Welcome = {
    type: 'html-keyboard-response', 
    stimulus: `<div id="instruction-container" <div style="position: relative; width: 100%; height: 100vh; overflow: hidden; margin: 0 auto;">
    <video autoplay loop muted style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-height: 100%; height: 100vh; width: auto; z-index: -100;">
        <source src="video/helloBackground.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <div style="position: relative; z-index: 1; text-align: center; color: black;">
        <p style="font-weight: bold; font-size: 40px; padding-top: 200px;">What a beautiful ${todayDate} to do some awesome science!</p>
        <p style="font-size: 24px; padding: 20px;">By completing this survey or questionnaire, you are consenting to be in this research study.</p>
        <p style="font-size: 24px; padding: 20px;">Your participation is voluntary and you can stop at any time.</p>
    </div>
</div>
  `,

  response_ends_trial: true,
  on_finish: function(data) {
    //console.log('A trial just sorta ended.');
    data.realTrialType = 'instructionsConsent';
  },
};
timeline.push(intro_T1_Welcome);



var hiThere = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" <div style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
    <video autoplay muted style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-height: 100%; height: 100vh; width: auto; z-index: 2000;">
    <source src="video/hiThere.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
</div>
    `,
    trial_duration: 18000,
    response_ends_trial: true,
    on_finish: function(data) {
        //console.log('A trial just sorta ended.');
        data.realTrialType = 'instructionsWelcome';
      },
};
if (pilotMode == 0) {
timeline.push(hiThere);
}






var targetInstructionsGeneral1 = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/TaskInstructions1.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
    response_ends_trial: false,
    stimulus_duration: 5000,
    trial_duration: 5000,
    on_finish: function(data) {
        //console.log('A trial just sorta ended.');
        data.realTrialType = 'instructions1';
      },
};
if (pilotMode == 0) {
timeline.push(targetInstructionsGeneral1);
}


var targetInstructionsGeneral1Cont = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/TaskInstructions1_cont.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
    response_ends_trial: true,
    on_finish: function(data) {
     
        data.realTrialType = 'instructions1Cont';
      },
};
if (pilotMode == 0) {
timeline.push(targetInstructionsGeneral1Cont);
}

// 03 CONT: SECOND PAGE OF INSTRUCTIONS CONT

var targetInstructionsGeneral2 = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/TaskInstructions2.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
    response_ends_trial: false,
    stimulus_duration: 10000,
    trial_duration: 10000,
    on_finish: function(data) {
        //console.log('A trial just sorta ended.');
        data.realTrialType = 'instructions2';
      },
};
if (pilotMode == 0) {
timeline.push(targetInstructionsGeneral2);
}

    var targetInstructionsGeneral2Cont = {
        type: 'html-keyboard-response',
        stimulus: `
        <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
            <img src='img/TaskInstructions2_cont.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
        </div>
        `,
        response_ends_trial: true,
        on_finish: function(data) {
            //console.log('A trial just sorta ended.');
            data.realTrialType = 'instructions2Cont';
          },
    };
    if (pilotMode == 0) {
    timeline.push(targetInstructionsGeneral2Cont);
    }

// // 04: THIRD PAGE OF INSTRUCTIONS
// var targetInstructions3General = {
//     type: 'video-keyboard-response',
//     stimulus: [
//         'video/TaskInstructions3.mp4',
//     ],
//     response_ends_trial: true,
//     height: 1000,
//     autoplay: true,
//     trial_ends_after_video: false,
// };


// Call this function before starting the main experiment
resetExperimentLayout();

// 04: THIRD PAGE OF INSTRUCTIONS
// var targetInstructions3General = {
//     type: 'video-keyboard-response',
//     stimulus: [
//         'video/TaskInstructions3.mp4'
//     ],
//     response_ends_trial: true,
//     width: 900,
//     height: 900,
//     autoplay: true,
//     trial_ends_after_video: true,
// };
// if (pilotMode == 0) {
//     timeline.push(targetInstructions3General);
// }

var targetInstructions3General = {
    type: 'html-keyboard-response',
    stimulus: `
    
    <div id="instruction-container" <div style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
    <video autoplay style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-height: 100%; height: 100vh; width: auto; z-index: 2000;">
    <source src="video/TaskInstructions3.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
</div>
    `,
    stimulus_duration: 47000,
    trial_duration: 47000,
    response_ends_trial: false,

    on_finish: function(data) {
        //console.log('A trial just sorta ended.');
        data.realTrialType = 'instructions3';
      },
};

if (pilotMode == 0) {
    timeline.push(targetInstructions3General);
    }
    
 

resetExperimentLayout();



var targetInstructionsGeneral4 = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/TaskInstructions4.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
    response_ends_trial: false,
    stimulus_duration: 10000,
    trial_duration: 10000,
    on_finish: function(data) {
        //console.log('A trial just sorta ended.');
        data.realTrialType = 'instructions4';
      },
};
if (pilotMode == 0) {
timeline.push(targetInstructionsGeneral4);
}

var targetInstructionsGeneral4Cont = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/TaskInstructions4_cont.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
    response_ends_trial: true,
    on_finish: function(data) {
        //console.log('A trial just sorta ended.');
        data.realTrialType = 'instructions4Cont';
      },
};
if (pilotMode == 0) {
timeline.push(targetInstructionsGeneral4Cont);
}

var targetInstructionsGeneral5 = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/TaskInstructions5.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
    stimulus_duration: 5000,
    trial_duration: 5000,
    response_ends_trial: false,
    on_finish: function(data) {
        //console.log('A trial just sorta ended.');
        data.realTrialType = 'instructions5';
      },
};


if (pilotMode == 0) {
    timeline.push(targetInstructionsGeneral5);
}
// 03 CONT: SECOND PAGE OF INSTRUCTIONS CONT
var targetInstructionsGeneral5Cont = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/TaskInstructions5_cont.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
    response_ends_trial: true,
    on_finish: function(data) {
        //console.log('A trial just sorta ended.');
        data.realTrialType = 'instructions5Cont';
      },
};
if (pilotMode == 0) {
timeline.push(targetInstructionsGeneral5Cont);
}

var targetInstructionsGeneral6 = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/TaskInstructions6.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
    stimulus_duration: 5000,
    trial_duration: 5000,
    response_ends_trial: false,

    on_finish: function(data) {
        data.realTrialType = 'instructions6';
      },

};
if (pilotMode == 0) {
timeline.push(targetInstructionsGeneral6);
}

var targetInstructionsGeneral6Cont = {
    type: 'html-keyboard-response',
    stimulus: `
    <div id="instruction-container" style="position: relative; width: 100vh; height: 100vh; margin: 0 auto;"> 
        <img src='img/TaskInstructions6_cont.png' style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); max-height: 100vh; width: auto; z-index: 2000;">
    </div>
    `,
  
    response_ends_trial: true,
    on_finish: function(data) {
        data.realTrialType = 'instructions6Cont';
      },

};
if (pilotMode == 0) {
timeline.push(targetInstructionsGeneral6Cont);
}



function resetExperimentLayout() {
    // Select the instruction container element and remove it or reset its styles
    var instructionContainer = document.getElementById('instruction-container');
    if (instructionContainer) {
        instructionContainer.removeAttribute('style');
        // Or if you want to remove the container entirely
        // instructionContainer.parentNode.removeChild(instructionContainer);
    }
}

// Call this function before starting the main experiment
resetExperimentLayout();

// Global vars? 
let globalCtx;

let ladyBug1, ladyBug2;
///// TRAINING




// This draws the ladybug with dots that are the same area but different in number and they're not all in the center either. 
function drawLadyBug(ctx, ladybug) {
   // ctx.font = "30px Arial";
   // ctx.fillText("Hello World", 10, 50);
   resetExperimentLayout();
    if (ladybug.redrawDots) {
        ladybug.dots = []; // Clear previous dots
        let remainingArea = TOTAL_AREA;
        let AreaCheck = 0;
        for (let i = 0; i < ladybug.dotCount; i++) {
            // const allocatedArea = Math.random() * (remainingArea / (ladybug.dotCount - i));
            // const radius = Math.sqrt(allocatedArea / Math.PI);
            // remainingArea -= allocatedArea;
            const radius = ladybug.dotSize;

            let overlaps = true;
            while (overlaps) {
                overlaps = false;
                const angle = Math.random() * Math.PI * 2; // Random angle in radians
                const maxDist = ladybug.size - (radius+edgeBuffer); // Maximum distance from center
                const distance = Math.random() * maxDist; // Random distance from center

                // Convert polar to Cartesian coordinates
                const relX = distance * Math.cos(angle);
                const relY = distance * Math.sin(angle);

                for (const dot of ladybug.dots) {
                    const distance = Math.sqrt(Math.pow(dot.relX - relX, 2) + Math.pow(dot.relY - relY, 2));
                    if (distance < ((dot.radius + internalDotBuffer) + radius)) {
                        overlaps = true;
                        break;
                    }
                }

                if (!overlaps) {
                    ladybug.dots.push({ relX, relY, radius });
                }
            }
            // AreaCheck += Math.PI * Math.pow(radius, 2);
            //console.log(`Total calculated dot area: ${AreaCheck}`);
        }
        var dotCoordinates = [];
        for (const dot of ladybug.dots) {
            //Now dotCoordinates contains the actual x and y coordinates for each dot on the ladybug
            dotCoordinates.push([ladybug.x + dot.relX, ladybug.y + dot.relY]);
        };
            // Now convHullCoordinates contains the point coordinates of the convex hull shape
            let convHullCoordinates = convexHull([dotCoordinates]);

            // Now that we have convHull coordinates, we need to transform them into an array of the structure
            //verticesInput.x and verticesInput.y. This will allow us to get the area
            var verticesInput = {
                x: [],  // Initializing with empty arrays
                y: []   // Initializing with empty arrays
            };
            
            for (const convHullDot of convHullCoordinates[0]) {
                verticesInput.x.push(convHullDot[0]);
                verticesInput.y.push(convHullDot[1]);
            }

            //console.log(polygonArea(verticesInput.x, verticesInput.y, verticesInput.y.length));
        ladybug.redrawDots = false;  // Add this line to reset the flag
    }
  
    // Draw the body of the ladybug (unchanged)
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(ladybug.x, ladybug.y, ladybug.size, 0, Math.PI * 2); 
    ctx.fill();

    // Draw the dots with variable size
    ctx.fillStyle = `rgba(0, 0, 0, ${ladybug.alpha})`;

    if (trialType === 'delay2') {
        ctx.fillStyle = 'red';
        ctx.lineWidth = 10;
        // ctx.strokeStyle = "#fbf719"; 
        // ctx.stroke();
    }

      if (trialType === 'test') {
        ctx.lineWidth = 10;
        // ctx.strokeStyle = "#fbf719"; 
        // ctx.stroke();
        
    }

    //  if (trialType === 'adapt' && jsPsych.timelineVariable('trialType') === 'PSETrials_Baseline' ) {
    //     ctx.fillStyle = 'red';
    //  }



    if (trialType === 'clearAll') {
        ctx.fillStyle = 'red';
    }


    
    for (const dot of ladybug.dots) {
        ctx.beginPath();
        ctx.arc(ladybug.x + dot.relX, ladybug.y + dot.relY, dot.radius, 0, Math.PI * 2);  // Use variable radius
        ctx.fill();
    }
}

var trial_count = 0;
let audio = new Audio('responseTone.mp3');
audio.loop = false;
var breakCheck = {
    type: 'html-keyboard-response',
    stimulus: '<div style="font-size:60px; color: black; line-height: 2; text-align: center;">Please wait...</div>', // Default message
    data: {
        realTrialType: 'ITI'
    },
    on_start: function(breakCheck) {
        trial_count++;
        if (trial_count % numTrialsBreak == 0 && trial_count != 0) {
            breakCheck.stimulus = '<div style="font-size:60px; text-align: center; color: black; line-height: 2;">  <p>  </p> Wow! You\'ve completed ' + trial_count + ' out of ' + totalNumTrials + ' trials! Take a quick break, then press any key when you\'re ready to continue.</div>';
            var audio = new Audio('clapping.mp3'); // Ensure this path is correct
            audio.play();
        } else if (trial_count % numTrialsBreak !== 0) {  
            breakCheck.trial_duration = 0;
            breakCheck.choices = jsPsych.NO_KEYS;
            breakCheck.stimulus = '<div style="font-size:60px; color: black; line-height: 2; text-align: center;"> </div>'; 
        }
    }
};

// //let ladyBug1, ladyBug2; 
// var breakCheck = {
//     type: 'html-keyboard-response',
//    // stimulus: '<div style="font-size:60px; color: black;">Please wait...</div>', // Default message
//     stimulus: '<div style="position: relative; width: 100vh; height: 100vh; margin: 0 auto; font-size:60px; color: black;  line-height: 1.5; text-align: center;" ">Wow! You\'ve completed ' + trial_count + ' out of ' + totalNumTrials + ' trials! Take a quick break, then press any key when you\'re ready to continue.</div>',
//     data: {
//         realTrialType: 'ITI'
//     },
//     on_start: function(breakCheck) {
//         trial_count++;
//         if (trial_count  % numTrialsBreak == 0 && trial_count != 0) {
//             breakCheck.stimulus = '<div style="font-size:60px; text-align: center; color: black;"> </p> <p>  </p><p> Wow! You\'ve completed ' + trial_count + ' out of ' + totalNumTrials + ' trials! Take a quick break, then press any key when you\'re ready to continue.</div>';
//             var audio = new Audio('clapping.mp3'); // Ensure this path is correct
//             audio.play();
//         } else if (trial_count % numTrialsBreak !== 0) {  
//             breakCheck.trial_duration = 0;
//             breakCheck.choices = jsPsych.NO_KEYS;
//             // If you want to keep the default message, you can remove the next line
//             breakCheck.stimulus = '<div style="font-size:60px; color: black;"> </div>'; 
//         }
//     }
// };







//breakCheck.stimulus =  `Wow! You've completed ${trial_count} out of ${totalNumTrials} trials! </p> <p>  </p><p> Take a quick break, then press any key when you're ready to continue.`;

var LadyBugTrial = {
    timeline: [{
        type: 'html-keyboard-response',
       // trial_duration: jsPsych.timelineVariable('trialDur'),//5000,//30000,
        response_ends_trial: false,//true,
        choices: jsPsych.NO_KEYS,

        stimulus: `
        <style>
            html, body {
                height: 100%;
                overflow: hidden;
                margin: 0; /* Remove default margin */
                padding: 0; /* Remove default padding */
            }
            #jspsych-content {
                height: 100%;
            }
            #experimentCanvas {
                width: 100%;
                height: 100%;
            }
            .fixation {
                position: absolute;
                font-size: 60px;
                left: 48%;
                top: 50%;
                transform: translate(-50%, -50%);
                margin: 0;
            }
        </style>
        <div style="position: absolute; width: 100%; height: 100%;">
            <canvas id="experimentCanvas"></canvas>
            <div class="fixation">+</div>
        </div>`,

        //stimulus: `<div style="position: absolute; width: 100vw; height: 100vh; font-size: ${fixCrossSize}px;"> <canvas id="experimentCanvas" style="width:100%; height:100%;" ></canvas> <div id="experimentCanvas" width=${window.innerWidth} height= ${window.innerHeight} div style="position: absolute; left: ${(window.innerWidth/ 2) - (fixCrossSize/2)}px; top: ${(window.innerHeight / 2) - (fixCrossSize/2)}px;">+</div> </div>`,
        //stimulus: '<canvas id="experimentCanvas" width="1000" height="0"> </canvas>',

        on_load: function() {
          //  waitingForResponseFlag = false; 
          
            trialType = 'adapt';
            intervalId = setInterval(animate, 1000 / 100);
            //console.log('A trial just started...');
            //trial_count++;
            
            // if (typeof intervalId === 'undefined') {
            //     intervalId = setInterval(animate, 1000 / 100);
            // }
         

            canvas.style.zIndex = 100000 + trial_count;
            
            //canvas.id = 'experimentCanvas';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);
            let ctx = canvas.getContext('2d');
            // ctx.font = "30px Arial";
            // ctx.fillText("Hello World", 10, 50);
            
            // Calculate center positions for ladybugs
            let center_x_1 = canvas.width / 4;  // For first half
            let center_x_2 = 3 * canvas.width / 4;  // For second half
            let center_y = canvas.height / 4;  // Common center for both

            //note: previous dotsize was ladyBugSize /4
                let ladyBug1 = { fadeCount: 0, size: ladyBugSize, dotSize: ladyBugDotSize, x: center_x_1, y: center_y, dotCount: jsPsych.timelineVariable('leftAdapter'), alpha: .01, noiseOffsetX: 50000000, noiseOffsetY: 1000000,redrawDots: false, dots: [],angle: Math.random() * 2 * Math.PI, totalNumCycles: jsPsych.timelineVariable('numFadeCycles') };
                let ladyBug2 = { fadeCount: 0,size: ladyBugSize, dotSize: ladyBugDotSize, x: center_x_2, y: center_y, dotCount: jsPsych.timelineVariable('rightAdapter'), alpha: .01, noiseOffsetX: 2000000, noiseOffsetY: 3000000 ,redrawDots: false, dots: [], angle: Math.random() * 2 * Math.PI,totalNumCycles: jsPsych.timelineVariable('numFadeCycles')  };  

                
             if (trial_count >= 2) {
                ladyBug1.x = jsPsych.data.get().values()[0].ladyBug1.x;//[old X] Math.random() * 2 * Math.PI ;
                ladyBug2.x = jsPsych.data.get().values()[0].ladyBug2.x;;//[old x] //Math.random() * 2 * Math.PI ;

                ladyBug1.y = jsPsych.data.get().values()[0].ladyBug1.y;//[old X] Math.random() * 2 * Math.PI ;
                ladyBug2.y =  jsPsych.data.get().values()[0].ladyBug2.y;//[old x]
               
                ladyBug1.fadeCount = 0;
                ladyBug2.fadeCount = 0;

                ladyBug1.angle = jsPsych.data.get().values()[0].ladyBug1.angle;
                ladyBug2.angle = jsPsych.data.get().values()[0].ladyBug2.angle;
                
            }    

            jsPsych.data.addProperties({
                ladyBug1: ladyBug1,
                ladyBug2: ladyBug2,
                ctx: ctx,
                intervalId: intervalId,
            });

            function preventScroll(e) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                }
            }

            function moveLadyBug(ladybug, boundaryX, boundaryY, minBoundaryX, side) {
                const speed = 2;//0; // Constant velocity
                let angle; 
                if (trial_count < 1) {
                 angle = ladybug.angle || Math.random() * 2 * Math.PI; // Initialize angle if not present
                }
                
                // if we don't have a position
                if  (trial_count >= 1) {
                     angle = ladybug.angle;
                }
                
                // Randomly decide if the ladybug should change direction
                if (Math.random() < 0.01) {
                    angle = Math.random() * 2 * Math.PI;
                }
      
                // Calculate new position
                let dx = speed * Math.cos(angle);
                let dy = speed * Math.sin(angle);
                let newX = ladybug.x + dx;
                let newY = ladybug.y + dy;
      
                // When hitting vertical boundaries, update angle
                if (newX < minBoundaryX + distFromBoundary || newX > boundaryX - distFromBoundary) {
                    if (side === 'left') {
                        angle = Math.random() * Math.PI; // 0 to 180 degrees
                    } else {
                        angle = Math.PI + Math.random() * Math.PI; // 180 to 360 degrees
                    }
                }
      
                // When hitting horizontal boundaries, update angle
                if (newY < distFromBoundary || newY > boundaryY - distFromBoundary) {
                    if (dx > 0) {
                        angle = Math.random() * Math.PI - Math.PI / 2; // -90 to 90 degrees
                    } else {
                        angle = Math.random() * Math.PI + Math.PI / 2; // 90 to 270 degrees
                    }
                }
      
                // Apply new position based on new angle
                dx = speed * Math.cos(angle);
                dy = speed * Math.sin(angle);
                newX = ladybug.x + dx;
                newY = ladybug.y + dy;
      
                // Apply boundary constraints
                newX = Math.max(Math.min(newX, boundaryX - distFromBoundary), minBoundaryX + distFromBoundary);
                newY = Math.max(Math.min(newY, boundaryY - distFromBoundary), distFromBoundary);
      
                // Update position
                ladybug.x = newX;
                ladybug.y = newY;
      
                // Store new angle for next iteration
                ladybug.angle = angle;
            }

           
            let initialTime = null;

            function fadeDotsInAndOut(ladybug) {

                if (trialType === 'delay2') {
                    let initialTime = null;
                }
                //let initialTime = null;


                 currentTime = Date.now();
                if (initialTime === null) {
                    initialTime = currentTime;
                    
                }

                const elapsedTime = currentTime - initialTime;
                let cyclesCompleted = Math.floor(elapsedTime / (1000 * Math.PI));
                //cyclesCompleted = Math.floor(elapsedTime / (2 * Math.PI * 500));
           
                    // Calculate the alpha value
                 const alphaValue = Math.sin((currentTime - initialTime) / 500) * 0.5 + 0.5;
                    ladybug.alpha = alphaValue;
        
                if (trialType === 'adapt' && elapsedTime == 0) {
                    initialTime = currentTime;
                    ladybug.alpha = 0;
                    ladybug.alpha = Math.sin((currentTime - initialTime) / 500) * 0.5 + 0.5;
                }

                if (trialType === 'adapt' && full_design[trial_count].trialType === 'PSETrials_Baseline') {
                  //  initialTime = currentTime;
                  //CHANGE ME, COMMENT OUT FOR NON PILOT
                  //  ladybug.alpha = 0;
                   // ladybug.alpha = Math.sin((currentTime - initialTime) / 500) * 0.5 + 0.5;
                }

                if (ladybug.alpha < 0.001 && trialType === 'adapt' && ladybug.fadeCount < ladybug.totalNumCycles) {
                    ladybug.redrawDots = true;
                }
                if (trialType === 'delay') {
                    ladybug.alpha = 0;
                    ladybug.redrawDots = true;
                    ladybug.fadeCount = 0;
                    initialTime = null;
                    cyclesCompleted = null;
                }

                if (trialType === 'test' ) {
                    ladybug.alpha = 1;
                    ladybug.redrawDots = false;
                    ladybug.fadeCount = 0;
                    initialTime = null;
                    cyclesCompleted = null;
                }

                if (trialType === 'delay2' ) {
                    ladybug.alpha = 0;
                    ladybug.redrawDots = false;
                    ladybug.fadeCount = 0;
                    initialTime = null;
                    cyclesCompleted = null;
                }

                if (trialType === 'clearAll' ) {
                    ladybug.alpha = 0;
                    ladybug.redrawDots = false;
                    ladybug.fadeCount = 0;
                    initialTime = null;
                    cyclesCompleted = null;
                }

                ladybug.fadeCount = cyclesCompleted;
                
                if (trialType === 'adapt' && ladybug.fadeCount >= ladybug.totalNumCycles && Math.abs(ladybug.alpha - 0) < 0.001) {
                   // let intervalId = jsPsych.data.get().values()[0].intervalId;
                    jsPsych.finishTrial(); 
                    ladybug.fadeCount = 0;
                    initialTime = null;
                    cyclesCompleted = null;
                }
            }
            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
    
                moveLadyBug(ladyBug1, canvas.width / 2, canvas.height, 0,'left');
                moveLadyBug(ladyBug2, canvas.width, canvas.height, canvas.width/2, 'right');
    
                fadeDotsInAndOut(ladyBug1);
                fadeDotsInAndOut(ladyBug2);
      
                if (trialType === 'adapt') {
                    ladyBug1.dotCount = full_design[trial_count].leftAdapter; //jsPsych.timelineVariable('ladybug1NumAdaptDots');
                    ladyBug2.dotCount =  full_design[trial_count].rightAdapter;//jsPsych.timelineVariable('ladybug2NumAdaptDots');
                };

                if (trialType === 'delay') {
                    //console.log(trial_count);
                    ladyBug1.dotCount = full_design[trial_count].leftTest; //jsPsych.timelineVariable('ladybug1NumAdaptDots');
                    ladyBug2.dotCount =  full_design[trial_count].rightTest;//jsPsych.timelineVariable('ladybug2NumAdaptDots');
                };

                if (trialType === 'delay2') {
                    ladyBug1.dotCount = 0; //jsPsych.timelineVariable('ladybug1NumAdaptDots');
                    ladyBug2.dotCount = 0;//jsPsych.timelineVariable('ladybug2NumAdaptDots');
                };


                if (trialType === 'test') {
                    ladyBug1.dotCount = full_design[trial_count].leftTest; //jsPsych.timelineVariable('ladybug1NumAdaptDots');
                    ladyBug2.dotCount =  full_design[trial_count].rightTest;//jsPsych.timelineVariable('ladybug2NumAdaptDots');
               
                    // console.log(ladyBug1.dotCount);
                    // console.log(ladyBug2.dotCount);
                };
           
                drawLadyBug(ctx, ladyBug1); 
                drawLadyBug(ctx, ladyBug2); 
            }
        },
        // After random time, end trial and show new dots. 
        on_finish: function(data) {
            //console.log('A trial just sorta ended.');
            data.realTrialType = 'adapt';

            //Now we start making our test stimuli:
            let ladyBug1 = jsPsych.data.get().values()[0].ladyBug1;
            let ladyBug2 = jsPsych.data.get().values()[0].ladyBug2;
            let ctx = jsPsych.data.get().values()[0].ctx;
            
            // Generate new number of TEST dots for both ladybugs
            ladyBug1.dotCount = jsPsych.timelineVariable('leftTest');
            ladyBug2.dotCount = jsPsych.timelineVariable('rightTest');
      
                globalCtx = data.ctx;
                ladyBug1.alpha = 0.01;  // Set the last alpha value
                ladyBug2.alpha = 0.01;  // Set the last alpha value
                ladyBug1.redrawDots = true;
                ladyBug2.redrawDots = true;
        }, 
    }]   
};

var delay = {
    timeline: [{
        type: 'html-keyboard-response',
        trial_duration: jsPsych.timelineVariable('delayDuration'),
        response_ends_trial: false,//true,
        choices: jsPsych.NO_KEYS,
        stimulus: `
        <style>
            html, body {
                height: 100%;
                overflow: hidden;
                margin: 0; /* Remove default margin */
                padding: 0; /* Remove default padding */
            }
            #jspsych-content {
                height: 100%;
            }
            #experimentCanvas {
                width: 100%;
                height: 100%;
            }
            .fixation {
                position: absolute;
                font-size: 60px;
                left: 48%;
                top: 50%;
                transform: translate(-50%, -50%);
                margin: 0;
                
            }
        </style>
        <div style="position: absolute; width: 100%; height: 100%;">
            <canvas id="experimentCanvas"></canvas>
            <div class="fixation">+</div>
        </div>`,
        //stimulus: '<canvas id="experimentCanvas" width="1000" height="0"></canvas>',
        //basically, the empty bugs just vibe for a bit. 

        on_load: function() {
            trialType = 'delay';
           let ladyBug1 = jsPsych.data.get().values()[0].ladyBug1;
           let ladyBug2 = jsPsych.data.get().values()[0].ladyBug2;
           // console.log('delay...');
        },

        on_finish: function(data) {
            let ladyBug1 = jsPsych.data.get().values()[0].ladyBug1;
            let ladyBug2 = jsPsych.data.get().values()[0].ladyBug1;
            let ctx = jsPsych.data.get().values()[0].ctx;
            data.realTrialType = 'delay1';
        }

    }]
};

var test = {
    timeline: [{
        type: 'html-keyboard-response',
        response_ends_trial: true,//true,
        trial_duration: 500,
        stimulus_duration: 500,
        choices: response_choices,
        stimulus: `
            <style>
                html, body {
                    height: 100%;
                    overflow: hidden;
                    margin: 0; /* Remove default margin */
                    padding: 0; /* Remove default padding */
                }
                #jspsych-content {
                    height: 100%;
                }
                #experimentCanvas {
                    width: 100%;
                    height: 100%;
                }
                .fixation {
                    position: absolute;
                    font-size: 60px;
                    left: 48%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    margin: 0;
                }
            </style>
            <div style="position: absolute; width: 100%; height: 100%;">
                <canvas id="experimentCanvas"></canvas>
                <div class="fixation">+</div>
            </div>`,
        on_load: function() {
            trialType = 'test';
            audio.play();

            let ladyBug1 = jsPsych.data.get().last(1).values()[0].ladyBug1;
            let ladyBug2 = jsPsych.data.get().last(1).values()[0].ladyBug2;

            ladyBug1.alpha = 1;  // Reset the alpha value
            ladyBug2.alpha = 1;  // Reset the alpha value
           
   
            //('waiting for response...');
        },
        on_finish: function(data) {

            let ladyBug1 = jsPsych.data.get().values()[0].ladyBug1;
            let ladyBug2 = jsPsych.data.get().values()[0].ladyBug2;
            // drawLadyBug(globalCtx, ladyBug1);
            // drawLadyBug(globalCtx, ladyBug2);

            //  ladyBug1.alpha = .01;
            //  ladyBug2.alpha = .01;

            let ctx = jsPsych.data.get().values()[0].ctx;

            data.rightAdapter = jsPsych.timelineVariable('rightAdapter');
            data.leftAdapter = jsPsych.timelineVariable('leftAdapter');
            data.leftTest = jsPsych.timelineVariable('leftTest');
            data.rightTest = jsPsych.timelineVariable('rightTest');
            data.Condition = jsPsych.timelineVariable('trialType');
            data.delayDuration = jsPsych.timelineVariable('delayDuration'); 
            data.numFadeCycles = jsPsych.timelineVariable('numFadeCycles'); 
            data.realTrialType = 'test1';
        
 
        }

    }]
};


var delay2 = {
    timeline: [{
        type: 'html-keyboard-response',
        choices: response_choices,
        response_ends_trial: true,//true,
        stimulus: `
        <style>
            html, body {
                height: 100%;
                overflow: hidden;
                margin: 0; /* Remove default margin */
                padding: 0; /* Remove default padding */
            }
            #jspsych-content {
                height: 100%;
            }
            #experimentCanvas {
                width: 100%;
                height: 100%;
            }
            .fixation {
                position: absolute;
                font-size: 60px;
                left: 48%;
                top: 50%;
                transform: translate(-50%, -50%);
                margin: 0;
            }
        </style>
        <div style="position: absolute; width: 100%; height: 100%;">
            <canvas id="experimentCanvas"></canvas>
            <div class="fixation">+</div>
        </div>`,//stimulus: '<canvas id="experimentCanvas" width="1000" height="0"></canvas>',
        //basically, the empty bugs just vibe for a bit. 

        on_load: function(data) {
            trialType = 'delay2';
            lasttrialResponse = null;
           let ladyBug1 = jsPsych.data.get().values()[0].ladyBug1;
           let ladyBug2 = jsPsych.data.get().values()[0].ladyBug2;
           console.log(ladyBug1.dotCount);
           console.log(ladyBug2.dotCount);
           ladyBug1.dotCount = 0;
           ladyBug2.dotCount = 0;

           // console.log('delay3...');

        
        },

        on_finish: function(data) {
            lasttrialResponse = null;
            let ladyBug1 = jsPsych.data.get().values()[0].ladyBug1;
            let ladyBug2 = jsPsych.data.get().values()[0].ladyBug2;
             ladyBug1.dotCount = 0;
             ladyBug2.dotCount = 0;
            // drawLadyBug(globalCtx, ladyBug1);
            // drawLadyBug(globalCtx, ladyBug2);
            let ctx = jsPsych.data.get().values()[0].ctx;

            ladyBug1.cyclesCompleted = 4;
            ladyBug2.cyclesCompleted = 4;
            trialType = 'clearAll';
            data.realTrialType = 'test2';

        }

    }]
};


var if_node = {
    timeline: [delay2],
    conditional_function: function(){
        // get the data from the previous trial,
        // and check which key was pressed
        var data = jsPsych.data.get().last(1).values()[0];
        if(jsPsych.pluginAPI.compareKeys(data.response, 'ArrowLeft')){
            return false;
        } else if(jsPsych.pluginAPI.compareKeys(data.response, 'ArrowRight')){
            return false;
        }else {
            return true;
        }
    }
}

var returnOrContinueTrial = {
    type: 'html-button-response',
    stimulus: `
    <div style="position: relative; width: 100vw; height: 100vh; overflow: hidden; margin: 0 auto;">
      <img src="returnorcontinue.png" style="position: absolute; top: 40%; left: 50%; transform: translate(-50%, -50%); max-height: 60vh; width: auto;">
    </div>
  `,
    choices: ['Return to Main Page','Show Me Another!'],
    on_finish: function(data) {
      if (data.response == 0) {
        // Button index 0 corresponds to 'Return to Main Page'
        window.location.href = 'index.html'; // Change 'index.html' to your main page path
      }
      // Button index 1 will proceed to the next trial in jsPsych timeline
    }
  };

var clearAll = {
    timeline: [{
        type: 'html-keyboard-response',
        response_ends_trial: false,//true,
        choices: jsPsych.NO_KEYS,
        trial_duration: 0,
        stimulus: `
        <style>
            html, body {
                height: 100%;
                overflow: hidden;
                margin: 0; /* Remove default margin */
                padding: 0; /* Remove default padding */
            }
            #jspsych-content {
                height: 100%;
            }
            #experimentCanvas {
                width: 100%;
                height: 100%;
            }
            .fixation {
                position: absolute;
                font-size: 60px;
                left: 48%;
                top: 50%;
                transform: translate(-50%, -50%);
                margin: 0;
            }
        </style>
        <div style="position: absolute; width: 100%; height: 100%;">
            <canvas id="experimentCanvas"></canvas>
            <div class="fixation">+</div>
        </div>`, //stimulus: '<canvas id="experimentCanvas" width="1000" height="0"></canvas>',
    
        on_load: function() {
             
            trialType = 'clearAll';
        
            let ladyBug1 = jsPsych.data.get().last(1).values()[0].ladyBug1;
            let ladyBug2 = jsPsych.data.get().last(1).values()[0].ladyBug2;

            function resetLadyBug(ladyBug) {
                for (var property in ladyBug) {
                    if (ladyBug.hasOwnProperty(property)) {
                        ladyBug[property] = null;
                        ladyBug.fadeCount = 0;
                        //ladyBug.redrawDots = 1;
                    }
                }
            }
            ladyBug1.dotCount = 0;
            ladyBug2.dotCount = 0;

            ladyBug1.alpha = 0;
            ladyBug2.alpha = 0;

            
            globalCtx.clearRect(0, 0, globalCtx.canvas.width, globalCtx.canvas.height);
           // console.log('clearing');
            initialTime = null;
            clearInterval(intervalId);

        },
        on_finish: function(data) {
            data.realTrialType = 'clearAll';
        }

    }]
};

if (pilotMode == 1){
    var shuffledArray = [ LadyBugTrial,delay,test, if_node,clearAll, returnOrContinueTrial,breakCheck];
} else {
var shuffledArray = [ LadyBugTrial,delay,test, if_node, clearAll, returnOrContinueTrial,breakCheck];
}
//////////////////************NOW PUT IT ALL TOGETHER AND WHAT DO YOU GET?! (an experiment)***********//////////////////

// var mainExperiment = {
//     timeline: shuffledArray,
//     repetitions: 1,
//     timeline_variables: full_design,
//     override_safe_mode: true,
//     randomize_order: false,
// };

/////TRAINING

// INITIALIZE TRAINING TIMELINE
// var training = {
//     timeline: [ LadyBugTrial,delay,test, if_node, clearAll, breakCheck ],
//     timeline_variables: full_design_short,
//     repetitions: 0,
//     randomize_order: false
// };

if (pilotMode == 1) {
var training = {
    timeline: [ LadyBugTrial,delay,test, if_node, clearAll, returnOrContinueTrial,breakCheck ],
    timeline_variables: full_design_short,
    repetitions: 0,
    randomize_order: false
};
} else {
    var training = {
        timeline: [ LadyBugTrial,delay,test, if_node, clearAll, returnOrContinueTrial, breakCheck ],
        timeline_variables: full_design_short,
        repetitions: 0,
        randomize_order: false
    };   
}

//timeline.push(training);
//END OF TRAINING



// 04: THIRD PAGE OF INSTRUCTIONS
var endTraining = {
    type: 'html-keyboard-response',
    stimulus: `<div id="instruction-container" <div style="position: relative; width: 100vh; height: 100vh; overflow: hidden; margin: 0 auto;">
    <video autoplay loop muted style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); min-height: 100%; height: 100vh; width: auto; z-index: 2000;">
        <source src="video/endTraining.mp4" type="video/mp4">
        Your browser does not support the video tag.
    </video>
    <div style="position: relative; z-index: -10; text-align: center; color: color: rgba(255, 255, 255, 0);">
        <p style="font-weight: bold; font-size: 40px; padding-top: 200px;">What a beautiful ${todayDate} to do some awesome science!</p>
        <p style="font-size: 24px; padding: 20px;">By completing this survey or questionnaire, you are consenting to be in this research study.</p>
        <p style="font-size: 24px; padding: 20px;">Your participation is voluntary and you can stop at any time.</p>
    </div>
</div>

  `,
    response_ends_trial: true,
 
    on_finish: function(data) {
        data.realTrialType = 'endTraining';
        trial_count = 0;
     },
};

    //timeline.push(endTraining);

    trial_count = 0;

if (pilotMode == 1) {
    var mainExperiment = {
        timeline: shuffledArray,
        repetitions: 1,
        timeline_variables: full_design,
        // timeline_variables: full_design_short,
        override_safe_mode: true,
        randomize_order: false,
    };
}

if (pilotMode != 1) {
    var mainExperiment = {
        timeline: shuffledArray,
        repetitions: 1,
        timeline_variables: full_design,
        override_safe_mode: true,
        randomize_order: false,
    };
    
}

timeline.push(mainExperiment);

function saveData(name, data){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'write_data.php'); // 'write_data.php' is the path to the php file described above.
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({filename: name, filedata: data}));
}



function convertJsonToCsv(json) {
    const keys = Object.keys(json[0]);
    const csvRows = [];
  
    // headers
    csvRows.push(keys.join(','));
  
    // data
    for (const row of json) {
        csvRows.push(keys.map(key => row[key]).join(','));
    }
  
    return csvRows.join('\n');
}

let csvStr = convertJsonToCsv(full_design);
if (saveTrialStructure == 1) {
download(csvStr, 'full_design.csv', 'text/csv');
}


if (saveDataLocally == 1) {
    jsPsych.init({
        timeline: timeline,
        randomize_order: false,
        override_safe_mode: true,
        on_finish: function () {
            jsPsych.data.getInteractionData().values();
            jsPsych.data.displayData('csv');
            jsPsych.data.get().localSave('csv','mydata.csv');
        }
    });
}


if (saveDataToServer == 1) {
    jsPsych.init({
        timeline: timeline,
        randomize_order: false,
        override_safe_mode: true,
        // save data to server
        on_finish: function(){ saveData(subject_id, jsPsych.data.get().csv()),
        jsPsych.data.getInteractionData().values();
        //jsPsych.data.displayData('csv');
        jsPsych.data.get().localSave('csv','mydata.csv');
        document.body.innerHTML = `
        <p> 
        <div style='width: 700px;'>
        <div style='float: center;'><img src='img/yay.png'></img>
        </div>
        <center> Thank you for completing the experiment! You're a star! </p>
        </p> Please wait. You will be automatically redirected and can continue to combat the monotony of everyday life in 10 seconds. </p>
        </p> <strong>Please do not click out of this page or close this tab. </strong> </p>
        <p>Thank you! </center>  </p>
        `;
        document.documentElement.style.textAlign = 'center';
      //save data locally too:


        setTimeout(function () { location.href = 'https://www.generatormix.com/random-compliment-generator?number=1'; }, 15000);
        

    
        }
    });
}