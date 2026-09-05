const API_URL = "https://script.google.com/macros/s/AKfycbzsj13KIFkvNySAzw2pdGgs5jr7-qrWYlrHU5YaSnIDP1O1k0CZiCgx3PB6jo3Tm-SW3Q/exec";

const table = document.getElementById("table");

// 🔹 สร้าง 20 ห้อง
for (let i = 1; i <= 20; i++) {
  let row = table.insertRow();

  row.innerHTML = `
    <td>2/${i}</td>
    <td class="name"></td>
    <td class="rent"></td>
    <td class="water_start"></td>
    <td class="water_end"></td>
    <td class="wUnit"></td>
    <td class="water"></td>
    <td class="electric_start"></td>
    <td class="electric_end"></td>
    <td class="eUnit"></td>
    <td class="electric"></td>
    <td class="other"></td>
    <td class="note"></td>
    <td class="total">0</td>
  `;
}

// 🔹 โหลดข้อมูลจาก Google Sheet
window.addEventListener("DOMContentLoaded", () => {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {

      document.querySelectorAll("#table tr").forEach((row, i) => {
        if (i === 0) return;

        const d = data.find(x => x.house === `2/${i}`);
        if (!d) return;

        row.querySelector(".name").value = d.name || "";
        row.querySelector(".rent").value = d.rent || "";
        
        row.querySelector(".water_start").value = d.water_start || "";
        row.querySelector(".water_end").value = d.water_end || "";
        row.querySelector(".wUnit").value = d.wUnit || "";
        row.querySelector(".water").value = d.water || "";
        
        row.querySelector(".electric_start").value = d.electric_start || "";
        row.querySelector(".electric_end").value = d.electric_end || "";
        row.querySelector(".eUnit").value = d.eUnit || "";
        row.querySelector(".electric").value = d.electric || "";
        
        row.querySelector(".other").value = d.other || "";
        row.querySelector(".note").value = d.note || "";
        row.querySelector(".total").value = d.total || "";
      });

      document.dispatchEvent(new Event("input"));
    })
    .catch(() => alert("โหลดข้อมูลไม่สำเร็จ"));
});

// 🔹 ออกบิล
function goReceipt() {
  let data = [];

  document.querySelectorAll("#table tr").forEach((row, i) => {
    if (i === 0) return;

    let name = row.querySelector(".name").value;
    if (!name) return;

    let rent = +row.querySelector(".rent").value || 0;
    let elec = +row.querySelector(".electric").value || 0;
    let other = +row.querySelector(".other").value || 0;

    let wStart = +row.querySelector(".water_start").value || 0;
    let wEnd = +row.querySelector(".water_end").value || 0;

    let unit = Math.max(wEnd - wStart, 0);
    let water = unit * WATER_RATE;

    let note = row.querySelector(".note").value;
    let total = rent + elec + water + other;

    data.push({
      // house: `2/${i}`,
      name,
      name,
      rent,
      elec,
      other,
      wStart,
      wEnd,
      unit,
      water,
      note,
      total
    });
  });

  localStorage.setItem("billData", JSON.stringify(data));
  window.location.href = "receipt.html";
}
