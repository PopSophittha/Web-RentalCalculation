const data = JSON.parse(localStorage.getItem("data"));
const list = document.getElementById("list");

let html = "";
let sum = 0;

data.forEach(d => {
  if (!d.name) return;

  html += `<p>บ้าน ${d.house} - ${d.name}: ${d.total} บาท</p>`;
  sum += +d.total;
});

html += `<hr><h3>รวมทั้งหมด: ${sum} บาท</h3>`;

list.innerHTML = html;

// export PNG
function download() {
  html2canvas(document.querySelector("#receipt")).then(canvas => {
    let link = document.createElement("a");
    link.download = "receipt.png";
    link.href = canvas.toDataURL();
    link.click();
  });
}
