const canvas = document.getElementById("certificate");
const ctx = canvas.getContext("2d");
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const generateBtn = document.getElementById("generate");
const pngBtn = document.getElementById("downloadPng");
const pdfBtn = document.getElementById("downloadPdf");
const statusEl = document.getElementById("status");

const template = new Image();
template.src = "certificate-template.jpg";

let photo = null;
let generated = false;

function setStatus(msg, ok=false){
  statusEl.textContent = msg;
  statusEl.style.color = ok ? "#177245" : "#b42318";
}

function drawPhotoCover(img, x, y, w, h){
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const scale = Math.max(w/iw, h/ih);
  const sw = w/scale, sh = h/scale;
  const sx = (iw-sw)/2, sy = (ih-sh)/2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.clip();
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

function drawCertificate(){
  if (!template.complete || !template.naturalWidth) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(template,0,0,canvas.width,canvas.height);

  const name = nameInput.value.trim();

  // नाम की जगह: मूल सर्टिफिकेट में "मैं, ______" वाली लाइन के ऊपर।
  if(name){
    ctx.save();
    ctx.font = 'bold 44px "Noto Sans Devanagari","Mangal",Arial,sans-serif';
    ctx.fillStyle = "#103d91";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, 785, 514, 800);
    ctx.restore();
  }

  // फोटो की जगह: दाईं ओर बने फोटो बॉक्स के अंदर।
  if(photo){
    drawPhotoCover(photo, 1260, 204, 215, 247);
  }

  generated = true;
  pngBtn.disabled = false;
  pdfBtn.disabled = false;
}

template.onload = () => {
  drawCertificate();
  setStatus("नाम और फोटो डालकर सर्टिफिकेट बनाएं।", true);
};

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if(!file) return;
  if(!file.type.startsWith("image/")){
    setStatus("कृपया JPG, PNG या अन्य इमेज फाइल चुनें।");
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    photo = new Image();
    photo.onload = () => {
      drawCertificate();
      setStatus("फोटो तैयार है। अब सर्टिफिकेट बनाएं।", true);
    };
    photo.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

generateBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if(!name){
    setStatus("कृपया अपना नाम दर्ज करें।");
    nameInput.focus();
    return;
  }
  if(!photo){
    setStatus("कृपया अपनी फोटो चुनें।");
    photoInput.focus();
    return;
  }
  drawCertificate();
  setStatus("सर्टिफिकेट तैयार है। अब डाउनलोड करें।", true);
});

nameInput.addEventListener("input", () => {
  if(photo && nameInput.value.trim()) drawCertificate();
});

pngBtn.addEventListener("click", () => {
  if(!generated) return;
  const safe = (nameInput.value.trim() || "certificate").replace(/[\\/:*?"<>|]+/g,"_");
  const a = document.createElement("a");
  a.download = `${safe}-certificate.png`;
  a.href = canvas.toDataURL("image/png",1);
  a.click();
});

pdfBtn.addEventListener("click", () => {
  if(!generated) return;
  if(!window.jspdf){
    setStatus("PDF सुविधा लोड नहीं हुई। कृपया PNG डाउनलोड करें।");
    return;
  }
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({orientation:"landscape", unit:"px", format:[1536,1024]});
  pdf.addImage(canvas.toDataURL("image/jpeg",0.95),"JPEG",0,0,1536,1024);
  const safe = (nameInput.value.trim() || "certificate").replace(/[\\/:*?"<>|]+/g,"_");
  pdf.save(`${safe}-certificate.pdf`);
});
