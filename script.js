let videoPlayer=document.querySelector("video");
let videoRecordButton=document.querySelector("#record-video");

let constraint={video:true};
let capturedButton =document.querySelector("#click-image");

capturedButton.addEventListener("click",function(){
  var audio = new Audio('shutter.wav');
  audio.play();
  capture();
});

let mediaRecorder;

let chunks=[];

let recordState=false;


// variable for timer
let timeInterval;
let minute=0,second=0;
videoRecordButton.addEventListener("click",function(e){
  if(recordState==false){
    mediaRecorder.start();
    videoRecordButton.innerHTML="<img src=https://img.icons8.com/color/48/000000/stop.png/>";
    recordState=true;
    timeInterval=setInterval(function () {
      if(second==60){
        second=0;
        minute+=1;
      }

      if(minute<10){
        document.querySelector(".minute").innerText="0"+minute;
      }
      else{
        document.querySelector(".minute").innerText=minute;
      }
      if(second<10){
        document.querySelector(".second").innerText="0"+second;
      }
      else
      {   
      document.querySelector(".second").innerText=second;
     }
      second+=1;
    },1000)
    
  }
  else{//step4
   recordState=false;
  mediaRecorder.stop();
  clearInterval(timeInterval)
  second=0;
  minute=0;
  document.querySelector(".minute").innerText="00";
    document.querySelector(".second").innerText="00";
   videoRecordButton.innerHTML='<img src="https://img.icons8.com/flat-round/48/000000/record.png"/> ';
  }
})

navigator.mediaDevices.getUserMedia(constraint)
.then(function(mediastream)
{
  //console.log(mediastream.getVideoTracks()[0].getCapabilities()) return the functionality of the hardware
  mediaRecorder=new MediaRecorder(mediastream);
  videoPlayer.srcObject=mediastream
  mediaRecorder.ondataavailable=function(e)
  {
    chunks.push(e.data)
    console.log(typeof(e))
    console.log(e.data)
   
  }
  mediaRecorder.onstop=function(e){
    let blob=new Blob(chunks,{type:"video/mp4"})
    chunks=[];
    addData("video",blob);
    // let a=document.createElement("a");
    // a.href=url;
    // a.download="temp.mp4";
    // a.click();
  }
})
//video-recording end 


//image-capture start
function capture(){
  let canvas=document.createElement("canvas");
  canvas.height=videoPlayer.videoHeight;//height of video 
  canvas.width=videoPlayer.videoWidth;//width of video
  
  let ctx=canvas.getContext("2d");//create a pen
  //ZOOM IN AND ZOOM OUT SAVE
  ctx.translate(canvas.width/2,canvas.height/2);
  ctx.scale(zoom,zoom);
  ctx.translate(-(canvas.width/2),-(canvas.height/2));
  //END


  ctx.drawImage(videoPlayer,0,0);
  //draw the image whatever see on videoplayer at position  at cordinate dx and dy destination x and y cordinate
  if(filter!=""){
    ctx.fillStyle=filter;
    ctx.fillRect(0,0,canvas.width,canvas.height)
  }
  addData("image",canvas.toDataURL())
  // let a=document.createElement("a");
  // a.href=canvas.toDataURL();
  // a.download="image.jpg";
  // a.click();
}
//image capture end

//filter to the images

let filter="";
let allFilter=document.querySelectorAll(".filter");
for(i of allFilter){
  i.addEventListener("click",function(e){
    filter=e.currentTarget.style.backgroundColor;
        addFilterToScreen(filter)
  });
}
function addFilterToScreen(filter){
  let prevFilter=document.querySelector(".screen-filter");
  if(prevFilter){//if previousscreent filter exist than remove it
    prevFilter.remove()
  }
  let filterScreen=document.createElement("div");
  filterScreen.style.height=videoPlayer.offsetHeight+"px";//this will only give the height of video-player
  filterScreen.style.width=videoPlayer.offsetWidth+"px";//this will only give the width of video-player
  // filterScreen.style.position="fixed";
  // filterScreen.style.top=0;
  filterScreen.classList.add("screen-filter")
  filterScreen.style.backgroundColor=filter;
  document.querySelector(".filter-screen-parent").append(filterScreen)//if we dont put position fixed it will set below of video
}

//zoom in and zoom out

let zoom=1;
let zoomIn=document.querySelector(".zoom-in");
let zoomOut=document.querySelector(".zoom-out");
zoomIn.addEventListener("click",function(e){
  if(zoom<2.0){
  zoom+=0.1;
  videoPlayer.style.transform=`scale(${zoom})`
  }
})
zoomOut.addEventListener("click",function(){
  if(zoom>1.0){
    zoom-=0.1;
    videoPlayer.style.transform=`scale(${zoom})`
    }
})

let frame=document.querySelector(".frame");
frame.style["max-width"]=videoPlayer.offsetWidth;

//open and close modal
let openModal=document.querySelector(".show-gallary")



openModal.addEventListener("click",function(){
  let modal=document.createElement("div")
  modal.classList.add("modal");
  modal.innerHTML=`
  <div class="title">
    <span style="margin-top:10px;display:inline-block;">Gallery</span>
    <span class="close-modal" style="float:right;margin-top:10px; margin-right:10px;cursor:pointer;">X</span>
  </div>
  <div class="gallery">
  
  </div>
  `
document.querySelector("body").appendChild(modal)
getData()//fetch data

  let closeModal=document.querySelector(".close-modal")//when modal is added then we can put eventlistner
  closeModal.addEventListener("click",function(){
  document.querySelector(".modal").remove();
})
})
