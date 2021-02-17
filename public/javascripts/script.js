document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

const parte1 = document.querySelectorAll("#parte1")
const parte2 = document.querySelectorAll("#parte2")
const btn1 = document.querySelector("#btn-parte1")
const btn2 = document.querySelector("#btn-parte1")

console.log(parte1,parte2,btn1)

btn1.addEventListener("click", () => {
  for(let i =0 ; i<parte1.length;i++){
    parte1[i].classList.add("hidden")
    parte1[i].classList.remove("block")
    btn1.classList.add("hidden")
    btn1.classList.remove("block")
  }
  for(let i =0 ; i<parte2.length;i++){
    parte2[i].classList.add("block")
    parte2[i].classList.remove("hidden")
    btn2.classList.add("block")
    btn2.classList.remove("hidden")
  }
})


