const data = JSON.parse(localStorage.getItem("billData")) || [];
const container = document.getElementById("container");

let html = "";

data.forEach((d, i) => {
  html += `
    <div class="bill">
      <h3>ห้อง ${d.house}</h3>
      <p>${d.name}</p>
      <p>รวม: ${d.total} บาท</p>
    </div>
  `;
});

container.innerHTML = html;
