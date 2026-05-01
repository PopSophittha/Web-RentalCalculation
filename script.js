const API_URL = "https://script.google.com/macros/s/AKfycbzhJ7qq1lXDhdwVN6MhWFpZjCMeVbNQOEr0MID6FCFUyBGCxbgbhmyRYvMEYT-i-ySsJA/exec";
const WATER_RATE = 30;

const table = document.getElementById("table");

// สร้าง 20 หลัง (2/1 - 2/20)
for (let i = 1; i <= 20; i++) {
  let row = table.insertRow();

  row.innerHTML = `
    <td>2/${i}</td>
    <td><input class="name"></td>
    <td><input class="rent"></td>

    <td>
      <input class="water_start" placeholder="เริ่ม">
      <input class="water_end" placeholder="สุดท้าย">
      <div class="water_unit">0</div>
    </td>

    <td><input class="electric"></td>
    <td><input class="other"></td>
    <td><input class="note"></td>

    <td class="total">0</td>
  `;
}

// คำนวณ
document.addEventListener("input", () => {
  document.querySelectorAll("table tr").forEach((row, i) => {
    if (i === 0) return;

    let rent = +row.querySelector(".rent")?.value || 0;
    let elec = +row.querySelector(".electric")?.value || 0;
    let other = +row.querySelector(".other")?.value || 0;

    let wStart = +row.querySelector(".water_start")?.value || 0;
    let wEnd = +row.querySelector(".water_end")?.value || 0;

    let unit = Math.max(wEnd - wStart, 0);
    let water = unit * WATER_RATE;

    row.querySelector(".water_unit").innerText = `${unit} หน่วย (${water} บาท)`;

    let total = rent + elec + water + other;
    row.querySelector(".total").innerText = total;
  });
});

// บันทึก
function save() {
  let rows = [];

  document.querySelectorAll("table tr").forEach((row, i) => {
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

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ rows })
  })
  .then(res => res.json())
  .then(() => alert("บันทึกแล้ว"));
}
