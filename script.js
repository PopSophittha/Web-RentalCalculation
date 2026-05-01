const API_URL = "https://script.google.com/macros/s/AKfycbykekiql--2yusfglJ1QpX7J5Bz3q9YbeUNXinxjMo0lrhLHqKK60U8wfyStkt5Purf9w/exec";

// สร้าง 20 แถว
const table = document.getElementById("table");

for (let i = 1; i <= 20; i++) {
  let row = table.insertRow();

  row.innerHTML = `
    <td>${i}</td>
    <td><input class="name"></td>
    <td><input class="rent"></td>
    <td><input class="water"></td>
    <td><input class="electric"></td>
    <td class="total">0</td>
  `;
}

// คำนวณ
document.addEventListener("input", () => {
  document.querySelectorAll("tr").forEach(row => {
    let r = +row.querySelector(".rent")?.value || 0;
    let w = +row.querySelector(".water")?.value || 0;
    let e = +row.querySelector(".electric")?.value || 0;

    let total = r + w + e;
    if (row.querySelector(".total")) {
      row.querySelector(".total").innerText = total;
    }
  });
});

// บันทึก
function save() {
  let rows = [];

  document.querySelectorAll("table tr").forEach((row, i) => {
    if (i === 0) return;

    rows.push({
      house: i,
      name: row.querySelector(".name").value,
      rent: row.querySelector(".rent").value,
      water: row.querySelector(".water").value,
      electric: row.querySelector(".electric").value,
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

// ไปหน้าใบเสร็จ
function goReceipt() {
  localStorage.setItem("data", JSON.stringify(getData()));
  window.location.href = "receipt.html";
}

function getData() {
  let rows = [];

  document.querySelectorAll("table tr").forEach((row, i) => {
    if (i === 0) return;

    rows.push({
      house: i,
      name: row.querySelector(".name").value,
      total: row.querySelector(".total").innerText
    });
  });

  return rows;
}
