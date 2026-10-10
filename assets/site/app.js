"use strict";
const scenes={
  1:{name:"第一场",title:"侯府 · 人物关系与冲突",description:"算盘、家书与人物反应，构成开场的叙事线索。",images:[["A034","S1-01 · 红烛"],["A035","S1-02 · 沈知微拨算盘"],["A036","S1-03 · 永安侯拍信"],["A037","S1-04 · 侯夫人哭"]]},
  2:{name:"第二场",title:"大殿 · 婚礼与反差",description:"从全景交代空间，再以人物近景、特写和动作镜头推进情节。",images:[["A012","S2-01 · 全景"],["A015","S2-04 · 萧承稷侧头低声问"],["A016","S2-05 · 李德全凑耳耳语"],["A020","S2-10a · 绣鞋磕地特写"]]},
  3:{name:"第三场",title:"婚房 · 对话与角色塑造",description:"婚房空间、盖头与人物对话，连接场景关系和角色互动。",images:[["A003","婚房场景"],["A004","女坐婚房"],["A005","金杆盖头"],["A006","婚房内去头罩"]]}
};
function pictureCard(path,title,id){
  const figure=document.createElement("figure"),button=document.createElement("button"),img=document.createElement("img"),caption=document.createElement("figcaption");
  button.className="image-button";button.dataset.image=path;button.dataset.title=title;button.setAttribute("aria-label","查看图片："+title);
  img.src=path;img.alt=title;img.loading="lazy";button.append(img);figure.append(button);
  if(id){const small=document.createElement("small");small.textContent=id;caption.append(small)}
  caption.append(document.createTextNode(title));figure.append(caption);return figure;
}
function selectScene(num,moveFocus=false){
  const scene=scenes[num];
  document.querySelectorAll("[data-scene]").forEach(tab=>{const active=Number(tab.dataset.scene)===Number(num);tab.setAttribute("aria-selected",String(active));tab.tabIndex=active?0:-1;if(active&&moveFocus)tab.focus()});
  document.getElementById("scene-panel").setAttribute("aria-labelledby","scene-tab-"+num);
  document.getElementById("scene-heading").textContent=scene.title;document.getElementById("scene-description").textContent=scene.description;
  const storyboard=document.getElementById("storyboard");storyboard.replaceChildren(...scene.images.map(([id,label])=>pictureCard("assets/scene-"+num+"/"+id+".jpg",label,id)));
  const clip=document.getElementById("scene-clip"),cut=document.getElementById("scene-cut");
  clip.dataset.video="media/clips/scene-"+num+"-example.mp4";clip.dataset.title=scene.name+" · 单镜头示例";
  cut.dataset.video="media/scenes/scene-"+num+".mp4";cut.dataset.title=scene.name+" · 分场剪辑";
  document.getElementById("scene-note").textContent=num===3?"展示 4 张留存素材；原命名不统一，此处不补造正式分镜编号。":"选取 4 张留存首帧；标签沿用素材说明。";
}
document.querySelectorAll("[data-scene]").forEach(tab=>{
  tab.addEventListener("click",()=>selectScene(Number(tab.dataset.scene)));
  tab.addEventListener("keydown",e=>{const n=Number(tab.dataset.scene);let next;if(e.key==="ArrowRight")next=n%3+1;else if(e.key==="ArrowLeft")next=(n+1)%3+1;else if(e.key==="Home")next=1;else if(e.key==="End")next=3;if(next){e.preventDefault();selectScene(next,true)}});
});
selectScene(1);
const dialog=document.getElementById("media-dialog"),content=document.getElementById("dialog-content");let opener=null;
function openMedia(button){
  opener=button;content.replaceChildren();document.querySelectorAll("audio").forEach(audio=>audio.pause());
  document.getElementById("dialog-title").textContent=button.dataset.title||"作品预览";
  if(button.dataset.video){const video=document.createElement("video");video.controls=true;video.playsInline=true;video.preload="metadata";video.src=button.dataset.video;video.setAttribute("aria-label",button.dataset.title);content.append(video);document.getElementById("dialog-note").textContent="AI 生成作品 · 720p / 30fps 轻量预览 · 视频中包含字幕";dialog.showModal();video.play().catch(()=>{});
  }else{const img=document.createElement("img");img.src=button.dataset.image;img.alt=button.dataset.title;content.append(img);document.getElementById("dialog-note").textContent="AI 生成图像 · 制作过程参考素材";dialog.showModal()}
  document.body.classList.add("modal-open");document.getElementById("dialog-close").focus();
}
document.addEventListener("click",e=>{const button=e.target.closest("button[data-video],button[data-image]");if(button)openMedia(button)});
document.getElementById("dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog.addEventListener("close",()=>{content.querySelectorAll("video").forEach(v=>{v.pause();v.removeAttribute("src");v.load()});content.replaceChildren();document.body.classList.remove("modal-open");if(opener)opener.focus()});
document.querySelectorAll("audio").forEach(audio=>audio.addEventListener("play",()=>{document.querySelectorAll("audio").forEach(other=>{if(other!==audio)other.pause()})}));
const assets=window.PORTFOLIO_ASSETS||[];
function renderAssets(){const search=document.getElementById("asset-search").value.trim().toLocaleLowerCase(),category=document.getElementById("asset-category").value;const filtered=assets.filter(a=>a.public.endsWith(".jpg")&&(category==="all"||a.public.split("/")[1]===category)&&(a.label+" "+a.source_id).toLocaleLowerCase().includes(search));const grid=document.getElementById("asset-grid");grid.replaceChildren(...filtered.map(a=>pictureCard(a.public,a.label,a.source_id)));document.getElementById("asset-count").textContent=filtered.length+" 张图片";if(!filtered.length){const empty=document.createElement("p");empty.className="empty-state";empty.textContent="没有匹配的素材，试试其他名称或类别。";grid.append(empty)}}
document.getElementById("asset-search").addEventListener("input",renderAssets);document.getElementById("asset-category").addEventListener("change",renderAssets);renderAssets();
