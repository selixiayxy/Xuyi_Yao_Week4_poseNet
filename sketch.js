// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
Created by Xuyi Yao(Selicia)
Weekly Experiement #4 Counter Action 
This experiement intends to control the falling of balls using body movement.
Inspires from waacking dance, I use poseNet to detect six points of body, left/right wrist, left/right elbow, left/right shoulder. 
Distance between left and right wrist - control the falling speed of ball
Distance between left wrist, left shoulder - control the amplitude of sound
Distance between right wrist, right shoulder - control the frequency of sound 
Distance between left wrist and right shoulder, right wrist and left shoulder - control the color of falling ball

reference:
https://learn.ml5js.org/#/reference/posenet

=== */

let video;
let poseNet;
let poses = [];
let osc, fft;


let stars = [];
let numStars = 10;




function setup() {
  createCanvas(640, 480);
  
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
  osc = new p5.TriOsc(); // set frequency and type
  osc.amp(0.1);
  
  
  fft = new p5.FFT();
  osc.start();
  
  for(let i=0;i<numStars;i++){
		let gap = width/numStars;
		stars[i] = new Star(i*gap+gap/2,0,gap/2*noise(i));
	}


  
  
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);


  receivePose();
}



function receivePose(){
   for (let i = 0; i < poses.length; i++) {
     
     //detect pose and get the points 
     let pose = poses[i].pose;
     let lw = pose.leftWrist;//(x,y) = (lw.x,lw.y)
     let le = pose.leftElbow;
     let ls = pose.leftShoulder;
     let rw = pose.rightWrist;
     let re = pose.rightElbow;
     let rs = pose.rightShoulder; 

     
     //define the distance between different two points shoulde
     let wristDist = dist(lw.x,lw.y,rw.x,rw.y);
     let elbowDist = dist(le.x,le.y,re.x,re.y);
     let leftDist = dist(lw.x,lw.y,ls.x,ls.y);
     let rightDist = dist(rw.x,rw.y,rs.x,rs.y);
     
     console.log(wristDist);

     
     let freq = map(rightDist,0,100,10,100);
     osc.freq(freq);
     
      let amp = map(leftDist, 0, 100, 0.5, 0.01);
      osc.amp(amp);

       
      
     let r = map(elbowDist,0,500,0,255);
     let g = map(dist(lw.x,lw.y,rs.x,rs.y),0,500,0,255);
     let b = map(dist(rw.x,rw.y,ls.x,ls.y),0,500,0,255);
     let col = color(r,g,b);
     
 
     
	let grange = map(wristDist,10,500,0.01,5);
     
	for(let i=0;i<stars.length;i++){
		stars[i].show(col);
		stars[i].checkEdge();
		stars[i].update(grange);

	}
	
     
     

     
 
  }
  
}


class Star {
	constructor(x,y,size) {
		this.x = x;	
		this.y = y;
		this.size = size;
	}
	
	
	show(col) {
	noStroke();
		fill(col);
		ellipse(this.x, this.y,this.size+this.size);
	}
	
	update(force) {
		this.y = this.y+force;

	}

	checkEdge(){
		
		if(this.y>=height){
			this.y =0;
		}
	}
	
	
}




