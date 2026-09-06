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
    <td class="water_unit"></td>
    <td class="water"></td>
    <td class="electric_start"></td>
    <td class="electric_end"></td>
    <td class="electric_unit"></td>
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

        const house = `2/${i}`;

        const d = data.find(x => x.house === house);

        if (!d) return;


        // 🔹 แสดงข้อมูลด้วย textContent
        row.querySelector(".name").textContent = d.name || "";
        row.querySelector(".rent").textContent = d.rent || "";

        // น้ำ
        row.querySelector(".water_start").textContent = d.water_start || "";
        row.querySelector(".water_end").textContent = d.water_end || "";
        row.querySelector(".water_unit").textContent = d.water_unit || "";
        row.querySelector(".water").textContent = d.water || "";

        // ไฟ
        row.querySelector(".electric_start").textContent = d.electric_start || "";
        row.querySelector(".electric_end").textContent = d.electric_end || "";
        row.querySelector(".electric_unit").textContent = d.electric_unit || "";
        row.querySelector(".electric").textContent = d.electric || "";

        // อื่นๆ
        row.querySelector(".other").textContent = d.other || "";

        // หมายเหตุ
        row.querySelector(".note").textContent = d.note || "";

        // รวม
        row.querySelector(".total").textContent = d.total || "0";
      });

    })
    .catch(error => {
      console.error(error);
      alert("โหลดข้อมูลไม่สำเร็จ");
    });

});


// 🔹 ออกบิล
function goReceipt() {

  let data = [];

  document.querySelectorAll("#table tr").forEach((row, i) => {

    if (i === 0) return;

    let name = row.querySelector(".name").textContent.trim();

    // ไม่มีชื่อ = ไม่ออกบิล
    if (!name) return;


    // ค่าเช่า
    let rent =
      Number(row.querySelector(".rent").textContent) || 0;


    // น้ำ
    let wStart =
      Number(row.querySelector(".water_start").textContent) || 0;

    let wEnd =
      Number(row.querySelector(".water_end").textContent) || 0;

    let wUnit =
      Number(row.querySelector(".water_unit").textContent) || 0;

    let water =
      Number(row.querySelector(".water").textContent) || 0;


    // ไฟ
    let eStart =
      Number(row.querySelector(".electric_start").textContent) || 0;

    let eEnd =
      Number(row.querySelector(".electric_end").textContent) || 0;

    let eUnit =
      Number(row.querySelector(".electric_unit").textContent) || 0;

    let elec =
      Number(row.querySelector(".electric").textContent) || 0;


    // อื่นๆ
    let other =
      Number(row.querySelector(".other").textContent) || 0;


    // หมายเหตุ
    let note =
      row.querySelector(".note").textContent.trim();


    // 🔹 คำนวณยอดรวมใหม่
    let total = Number(row.querySelector(".total").textContent) || 0;


    data.push({

      house: `2/${i}`,

      name,

      rent,

      wStart,
      wEnd,
      wUnit,
      water,

      eStart,
      eEnd,
      eUnit,
      elec,

      other,

      note,

      total

    });

  });


  // 🔹 เก็บข้อมูลไว้ให้ receipt.html
  localStorage.setItem(
    "billData",
    JSON.stringify(data)
  );


  // 🔹 ไปหน้าออกบิล
  window.location.href = "receipt.html";
}
