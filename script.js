const API_URL = "https://script.google.com/macros/s/AKfycbxC-AA3Al1351HVlp-XYQMRNs-VxB4NJi8Kk_WomnWnEDcpdGOib-aScNpx5qouyXacRw/exec";
const WATER_RATE = 30;

const table = document.getElementById("table");

// สร้าง 20 หลัง
for (let i = 1; i <= 20; i++) {
  let row = table.insertRow();

  row.innerHTML = `
    <td>2/${i}</td>
    <td><input class="name"></td>
    <td><input class="rent"></td>

    <td><input class="water_start"></td>
    <td><input class="water_end"></td>
    <td class="water_unit">0</td>

    <td><input class="electric"></td>
    <td><input class="other"></td>
    <td><input class="note"></td>

    <td class="total">0</td>
  `;
}

// คำนวณ
document.addEventListener("input", () => {
  document.querySelectorAll("#table tr").forEach((row, i) => {
    if (i === 0) return;

    let rent = +row.querySelector(".rent")?.value || 0;
    let elec = +row.querySelector(".electric")?.value || 0;
    let other = +row.querySelector(".other")?.value || 0;

    let wStart = +row.querySelector(".water_start")?.value || 0;
    let wEnd = +row.querySelector(".water_end")?.value || 0;

    let unit = Math.max(wEnd - wStart, 0);
    let water = unit * WATER_RATE;

    row.querySelector(".water_unit").innerText = unit;

    let total = rent + elec + water + other;
    row.querySelector(".total").innerText = total;
  });
});

// บันทึก
function save() {
  let rows = [];

  document.querySelectorAll("#table tr").forEach((row, i) => {
    if (i === 0) return;

    let wStart = +row.querySelector(".water_start")?.value || 0;
    let wEnd = +row.querySelector(".water_end")?.value || 0;
    let unit = Math.max(wEnd - wStart, 0);
    let water = unit * WATER_RATE;

    rows.push({
      house: `2/${i}`,
      name: row.querySelector(".name").value,
      rent: row.querySelector(".rent").value,
      water_start: wStart,
      water_end: wEnd,
      water_unit: unit,
      water: water,
      electric: row.querySelector(".electric").value,
      other: row.querySelector(".other").value,
      note: row.querySelector(".note").value,
      total: row.querySelector(".total").innerText
    });
  });
  
  localStorage.setItem("formData", JSON.stringify(rows));
  
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ rows })
  })
  .then(res => res.json())
  .then(() => alert("บันทึกแล้ว"));
}

// 👉 ออกบิล
function goReceipt() {
  let data = [];

  document.querySelectorAll("#table tr").forEach((row, i) => {
    if (i === 0) return;

    let name = row.querySelector(".name").value;
    if (!name) return;

    let rent = +row.querySelector(".rent")?.value || 0;
    let elec = +row.querySelector(".electric")?.value || 0;
    let other = +row.querySelector(".other")?.value || 0;

    let wStart = +row.querySelector(".water_start")?.value || 0;
    let wEnd = +row.querySelector(".water_end")?.value || 0;

    let unit = Math.max(wEnd - wStart, 0);
    let water = unit * 30;

    let total = rent + elec + water + other;

    data.push({
      house: `2/${i}`,
      name: name,
      rent: rent,
      elec: elec,
      other: other,
      wStart: wStart,
      wEnd: wEnd,
      unit: unit,
      water: water,
      total: total
    });
  });

  localStorage.setItem("billData", JSON.stringify(data));
  window.location.href = "receipt.html";
}

window.onload = function () {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {

      document.querySelectorAll("#table tr").forEach((row, i) => {
        if (i === 0) return;

        const house = `2/${i}`;
        const d = data.find(x => x.house === house);

        if (!d) return;

        row.querySelector(".name").value = d.name || "";
        row.querySelector(".rent").value = d.rent || "";
        row.querySelector(".water_start").value = d.water_start || "";
        row.querySelector(".water_end").value = d.water_end || "";
        row.querySelector(".electric").value = d.electric || "";
        row.querySelector(".other").value = d.other || "";
        row.querySelector(".note").value = d.note || "";
      });

      // trigger คำนวณใหม่
      document.dispatchEvent(new Event("input"));
    });
};
