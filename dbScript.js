let request = indexedDB.open("camera",1);//database not be same of diffrent version
let db;
request.onsuccess = function(e) {
    db = request.result;
 
}

request.onerror=function(){
    console.log("error");
}
request.onupgradeneeded = function() {
    db = request.result;
    db.createObjectStore("gallery", { keyPath: "nId"});//create a store like table in database where primary-key is nId
}

function addData(type,url){
    let tx=db.transaction("gallery","readwrite");
    let store=tx.objectStore("gallery");
    store.add({nId:Date.now(),type:type,url:url})
}
function getData(){
  let gallery=document.querySelector(".gallery");
  gallery.innerHTML="";
    let tx=db.transaction("gallery","readonly");
    let store=tx.objectStore("gallery");
    let req=store.openCursor()
    req.onsuccess=function(){
        let cursor=req.result;
        if(cursor)
        {
            if(cursor.value.type=="image"){ 
                let images=document.createElement("div");
                images.classList.add("images");
                images.innerHTML=`  
                                <img src="${cursor.value.url}" alt="" >
                                <div class="button">
                                <button class="download${cursor.value.nId}">Download</button>
                                <button class="delete${cursor.value.nId}">Delete</button>
                                </div>
                               `
                               let filename=cursor.value.nId+".png";
                               let url=cursor.value.url;
                               let nId=cursor.value.nId;
                               gallery.appendChild(images)
                document.querySelector(`.download${cursor.value.nId}`).addEventListener("click",function(){
                    download(filename,url)
                }); 
              
                document.querySelector(`.delete${cursor.value.nId}`).addEventListener("click",function(){
                    deletefromgallary(nId)
                })
                }
            else{
                let video=document.createElement("div");
                video.classList.add("video");
                let videourl=URL.createObjectURL(cursor.value.url);//create video url
                video.innerHTML=`<video src=${videourl} autoplay loop></video>
                                <div class="button">
                                <button class="download${cursor.value.nId}">Download</button>
                                <button class="delete${cursor.value.nId}">Delete</button>
                                </div>
                `//each download has unique class
                gallery.appendChild(video)
                let fileName = cursor.value.nId + ".mp4";
                let nId=cursor.value.nId;
                document.querySelector(`.download${cursor.value.nId}`).addEventListener("click", function(){
                    download(fileName,videourl);
                });
                document.querySelector(`.delete${cursor.value.nId}`).addEventListener("click",function(){
                    deletefromgallary(nId)
                })
            }
            cursor.continue();
        }
        else
        {
           console.log("All Data fetched") 
        }
        
    }
}
function download(name,url){
    let a=document.createElement("a");
  a.href=url;
  a.download=name;
  a.click();
}

function deletefromgallary(nid)
{
    let tx=db.transaction("gallery","readwrite");
    let store=tx.objectStore("gallery");
    store.delete(Number(nid));//typecast string to number
    getData();
}  