

let gride = document.querySelector("#gride");
let vetorSelecionado = null;
let cardModal = document.querySelector(".card-modal")
let warrModal = document.querySelector(".warring")
let conteinerTables = document.querySelector("#conteiner-tables")
let conteinerCardsOperations = document.querySelector("#conteiner-cards-operetions")


// warrModal.showModal()

// -------------------------------------------
// Interact draggable
// -------------------------------------------
interact('.draggable').draggable({
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent',
    })
  ],
  listeners: {
  start() {
    guiaHorizontal.style.display = "block";
    guiaVertical.style.display = "block";
    marcadorInicio.style.display = "block";
    marcadorFim.style.display = "block";
  },

  move(event) {
    const target = event.target;
    const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    const angle = target.querySelector("svg").getAttribute("data-angle") || 0;
    target.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    // Atualizar vetores
    resolution();

    // Obter coordenadas reais
    const gridRect = gridElement.getBoundingClientRect();
    const wrapper = target;
    const svg = target.querySelector("svg");

    const extremos = calcularCoordenadasVetor(svg);

    const cellWidth = gridRect.width / 21;
    const cellHeight = gridRect.height / 15;

    const inicioX = extremos.inicio.x * cellWidth + cellWidth / 2;
    const inicioY = extremos.inicio.y * cellHeight + cellHeight / 2;
    const fimX = extremos.fim.x * cellWidth + cellWidth / 2;
    const fimY = extremos.fim.y * cellHeight + cellHeight / 2;

    // Atualizar linhas-guia (com base no ponto final)
    guiaHorizontal.style.top = `${fimY}px`;
    guiaHorizontal.style.left = `0px`;
    guiaHorizontal.style.width = `${fimX}px`;

    guiaVertical.style.left = `${fimX}px`;
    guiaVertical.style.top = `0px`;
    guiaVertical.style.height = `${fimY}px`;

    // Atualizar marcadores
    marcadorInicio.style.left = `${inicioX - 5}px`;
    marcadorInicio.style.top = `${inicioY - 5}px`;

    marcadorFim.style.left = `${fimX - 5}px`;
    marcadorFim.style.top = `${fimY - 5}px`;
  },

  end() {
    guiaHorizontal.style.display = "none";
    guiaVertical.style.display = "none";
    marcadorInicio.style.display = "none";
    marcadorFim.style.display = "none";
  }
}

});

// -------------------------------------------
// Grid builder
// -------------------------------------------
function desenharGrid() {
  gride.innerHTML = "";
  const totalCelulas = 15 * 21;
  for (let i = 0; i < totalCelulas; i++) {
    const cell = document.createElement("div");
    cell.className = "celulas"
    gride.appendChild(cell);
    for(let i = 0; i < 4; i++){
       const dote = document.createElement("div")
       cell.appendChild(dote);
    }
  }
  
}
desenharGrid();

// Criação dos elementos visuais
const guiaHorizontal = document.createElement("div");
const guiaVertical = document.createElement("div");
const marcadorInicio = document.createElement("div");
const marcadorFim = document.createElement("div");

// Estilização das linhas
[guiaHorizontal, guiaVertical].forEach(linha => {
  linha.style.position = "absolute";
  linha.style.backgroundColor = "red";
  linha.style.zIndex = "999";
  linha.style.display = "none";
});

guiaHorizontal.style.height = "2px";
guiaVertical.style.width = "2px";

// Estilização dos marcadores
[marcadorInicio, marcadorFim].forEach(m => {
  m.style.position = "absolute";
  m.style.width = "10px";
  m.style.height = "10px";
  m.style.borderRadius = "50%";
  m.style.zIndex = "1000";
  m.style.display = "none";
});

marcadorInicio.style.backgroundColor = "black";
marcadorFim.style.backgroundColor = "black";

const gridElement = document.getElementById("gride");

function addElemetsVisulsToGride(){
  gridElement.appendChild(guiaHorizontal);
  gridElement.appendChild(guiaVertical);
  gridElement.appendChild(marcadorInicio);
  gridElement.appendChild(marcadorFim);
}
addElemetsVisulsToGride()








// -------------------------------------------
// Criar vetor
// -------------------------------------------
function creatVector(numColunas) {
  const grid = document.getElementById("gride");
  const gridRect = grid.getBoundingClientRect();

  if (gridRect.width === 0) {
    console.error("Grid ainda não está pronto.");
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.classList.add("draggable");
  wrapper.setAttribute("data-x", 0);
  wrapper.setAttribute("data-y", 0);
  wrapper.setAttribute("data-colspan", numColunas);
  wrapper.style.position = "absolute";

  wrapper.innerHTML = `
    <svg class="vetor" data-angle="0">
      <polygon id="base" fill="white" />
      <polygon id="corpo" fill="white" />
      <polygon id="cabeca" fill="white" />
    </svg>
  `;

  const svg = wrapper.querySelector("svg");
  svg.addEventListener("click", () => {
    vetorSelecionado = svg;
    document.querySelectorAll(".vetor").forEach(v => v.style.outline = "none");
    svg.style.outline = "3px dotted yellow";
    svg.classList.add("is-selected")
    

  });
 
  grid.appendChild(wrapper);
  wrapper.setAttribute("data-name", 'Vetor');

  svg.dispatchEvent(new Event("click"));
  atualizarVetoresComGrid();

  resolution()

  
}

// -------------------------------------------
// Responsividade do vetor
// -------------------------------------------
function atualizarVetoresComGrid() {
  const grid = document.getElementById("gride");
  const gridRect = grid.getBoundingClientRect();
  const cellWidth = gridRect.width / 21;

  const vetores = document.querySelectorAll(".draggable");

  vetores.forEach(wrapper => {
    const numColunas = parseFloat(wrapper.getAttribute("data-colspan")) || 5;
    const comprimento = numColunas * cellWidth;
    const altura = 24;
    const tamPonta = cellWidth * 0.2;
    const corpoComprimento = comprimento - tamPonta;
    const meioAltura = altura / 2;

    const svg = wrapper.querySelector("svg");
    svg.setAttribute("width", comprimento);
    svg.setAttribute("viewBox", `0 0 ${comprimento} ${altura}`);

    const base = svg.querySelector("#base");
    const corpo = svg.querySelector("#corpo");

    base.setAttribute("points", `0,10 2,10 2,14 0,14`);
    corpo.setAttribute("points", `
      2,10 
      ${corpoComprimento},10 
      ${comprimento},${meioAltura} 
      ${corpoComprimento},14 
      2,14
    `.trim());
    corpo.setAttribute("data-comprimento", corpoComprimento);
  });
}


window.addEventListener("resize", atualizarVetoresComGrid());

// -------------------------------------------
// Rotação
// -------------------------------------------
function rotacionar() {
  if (!vetorSelecionado) return;

  const wrapper = vetorSelecionado.closest(".draggable");

  let angle = parseFloat(vetorSelecionado.getAttribute("data-angle")) || 0;
  angle = (angle + 45) % 360;

  vetorSelecionado.setAttribute("data-angle", angle);

  const x = parseFloat(wrapper.getAttribute("data-x")) || 0;
  const y = parseFloat(wrapper.getAttribute("data-y")) || 0;

  wrapper.style.transform = `translate(${x}px, ${y}px) rotate(${angle}deg)`;

  resolution ()
}

// -------------------------------------------
// Resetar grid e vetores
// -------------------------------------------
function resert() {
  gride.innerHTML = "";
  desenharGrid();
  vetorSelecionado = null;
  addElemetsVisulsToGride()
}

// -------------------------------------------
// Coordenadas do vetor
// -------------------------------------------
function calcularCoordenadasVetor(svg) {
  const grid = document.getElementById("gride");
  const wrapper = svg.closest(".draggable");

  const gridRect = grid.getBoundingClientRect();

  const cellWidth = gridRect.width / 21;
  const cellHeight = gridRect.height / 15;

  const dataX = parseFloat(wrapper.getAttribute("data-x")) || 0;
  const dataY = parseFloat(wrapper.getAttribute("data-y")) || 0;

  const wrapperWidth = wrapper.offsetWidth;
  const wrapperHeight = wrapper.offsetHeight;

  // Posição do centro do wrapper
  const centerX = dataX + wrapperWidth / 2;
  const centerY = dataY + wrapperHeight / 2;

  // Ângulo e comprimento do vetor
  const angleDeg = parseFloat(svg.getAttribute("data-angle")) || 0;
  const angleRad = angleDeg * Math.PI / 180;

  const comprimentoSVG = svg.viewBox.baseVal.width;
  const escala = wrapperWidth / comprimentoSVG;
  const comprimentoProjetado = comprimentoSVG * escala;

  // Ponto inicial e final do vetor a partir do centro
  const startX = centerX - Math.cos(angleRad) * (comprimentoProjetado / 2);
  const startY = centerY - Math.sin(angleRad) * (comprimentoProjetado / 2);
  const endX = centerX + Math.cos(angleRad) * (comprimentoProjetado / 2);
  const endY = centerY + Math.sin(angleRad) * (comprimentoProjetado / 2);

  const colStart = Math.floor(startX / cellWidth);
  const rowStart = Math.floor(startY / cellHeight);
  const colEnd = Math.floor(endX / cellWidth);
  const rowEnd = Math.floor(endY / cellHeight);

  return {
    inicio: { x: colStart, y: rowStart },
    fim: { x: colEnd, y: rowEnd }
  };
}


// -------------------------------------------
// Log das coordenadas a cada 2s
// -------------------------------------------
setInterval(() => {
  if (vetorSelecionado) {
    const extremos = calcularCoordenadasVetor(vetorSelecionado);
    console.log(`Início: (${extremos.inicio.x + 1}, ${extremos.inicio.y + 1})`, `Fim:  (${extremos.fim.x + 1}, ${extremos.fim.y + 1})`);
  }
}, 2000);




function resolution () {

  if (vetorSelecionado) {
    const extremos = calcularCoordenadasVetor(vetorSelecionado);
    const wrapper = vetorSelecionado.closest(".draggable")
    wrapper.setAttribute("data-colStart", extremos.inicio.x + 1)
    wrapper.setAttribute("data-rowStart", extremos.inicio.y + 1 )
    wrapper.setAttribute("data-colEnd", extremos.fim.x + 1)
    wrapper.setAttribute("data-rowEnd", extremos.fim.y + 1)
  }
  
  
  const result = [] 
  dataVectorCoordenadas = document.querySelectorAll(".draggable")
  for(let i = 0; i < dataVectorCoordenadas.length; i++){
    result[i] = {}
    result[i].name = dataVectorCoordenadas[i].getAttribute("data-name")
    result[i].modulo = parseFloat(dataVectorCoordenadas[i].getAttribute("data-colspan")) 
    result[i].colStart = parseInt(dataVectorCoordenadas[i].getAttribute("data-colStart"))
    result[i].rowStart = parseInt(dataVectorCoordenadas[i].getAttribute("data-rowStart"))
    result[i].colEnd = parseInt( dataVectorCoordenadas[i].getAttribute("data-colEnd"))
    result[i].rowEnd = parseInt( dataVectorCoordenadas[i].getAttribute("data-rowEnd"))
      
  }
  console.log(result)
  return result
}



function getDataBase(nunber){
  let dataBase = [
    [
      {name:'Vetor', modulo: 6, colStart: 8, rowStart: 9, colEnd: 12, rowEnd: 5},
      {name:'Vetor', modulo: 5, colStart: 8, rowStart: 9, colEnd: 13, rowEnd: 9}

    ],
    [
      {name:'Vetor', modulo: 4, colStart: 12, rowStart: 6, colEnd: 8, rowEnd: 6},
      {name:'Vetor', modulo: 8, colStart: 12, rowStart: 1, colEnd: 4, rowEnd: 1}
    ],
    [
      {name:'Vetor', modulo: 7, colStart: 13, rowStart: 15, colEnd: 13, rowEnd: 8},
      {name:'Vetor', modulo: 2, colStart: 4, rowStart: 12, colEnd: 6, rowEnd: 12}
    ],
    [
      {name:'Vetor', modulo: 4, colStart: 18, rowStart: 7, colEnd: 18, rowEnd: 11}
    ],
    [
      {name:'Vetor', modulo: 6, colStart: 14, rowStart: 3, colEnd: 14, rowEnd: 9}
    ],
    [
      {name:'Vetor', modulo: 5, colStart: 11, rowStart: 7, colEnd: 16, rowEnd: 7}
    ],
    [
      {name:'Vetor', modulo: 3, colStart: 4, rowStart: 6, colEnd: 4, rowEnd: 9},
      {name:'Vetor', modulo: 4, colStart: 6, rowStart: 4, colEnd: 10, rowEnd: 4}
    ],
    [
      {name:'Vetor', modulo: 3, colStart: 10, rowStart: 2, colEnd: 10, rowEnd: 5}
    ]
  ]

  let dataBaseTwo = {
    quests:[
      {
        name:"img/quests-fase-two/q8.png",
        vectors:[
          {name: 'Vetor', modulo: 3, colStart: 3, rowStart: 7, colEnd: 3, rowEnd: 4}, 
	        {name: 'Vetor', modulo: 4, colStart: 6, rowStart: 5, colEnd: 10, rowEnd: 5} 
        ]
      },
      {
        name:"img/quests-fase-two/q8.png",
        vectors:[
          {name: 'Vetor', modulo: 3, colStart: 3, rowStart: 7, colEnd: 3, rowEnd: 4}, 
	        {name: 'Vetor', modulo: 4, colStart: 6, rowStart: 5, colEnd: 10, rowEnd: 5}
        ]
      },
      {
        name:"img/quests-fase-two/q8.png",
        vectors:[
          {name: 'Vetor', modulo: 3, colStart: 3, rowStart: 7, colEnd: 3, rowEnd: 4}, 
	        {name: 'Vetor', modulo: 4, colStart: 6, rowStart: 5, colEnd: 10, rowEnd: 5}
        ]
      }
     
    ],
    resolve:[

    ]
  }

  if(nunber == 1){
    return dataBase
  } else if( nunber == 2){
    return dataBaseTwo
  } else{
    console.log("Valor inválido para os dataBases.")
  }
  
  // localStorage.setItem("dataBase",JSON.stringify(dataBase))

  // return JSON.parse(localStorage.getItem("dataBase")) 
}





function valid(){
  let resposta = resolution()
 
  let quest = getDataBase(1) 
  
  
  function objetosIguais(obj1, obj2) {
    const chaves1 = Object.keys(obj1);
    const chaves2 = Object.keys(obj2);

    if (chaves1.length !== chaves2.length) return false;

    return chaves1.every(key => obj1[key] === obj2[key]);
  }

  function arraysDeObjetosIguais(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    const usados = new Array(arr2.length).fill(false);

    for (let obj1 of arr1) {
      let encontrado = false;
      for (let i = 0; i < arr2.length; i++) {
        if (!usados[i] && objetosIguais(obj1, arr2[i])) {
          usados[i] = true;
          encontrado = true;
          break;
        }
      }
      if (!encontrado) return false;
    }

    return true;
  }


  let resolve = quest.find(ques => arraysDeObjetosIguais(ques, resposta));
  if(resolve){
    alert("CORRETO!")
    resert()
    let resolveModified = modifiersToDataBase([resolve])
    let newDataTable = createTables(modifiersToDataBase(getDataBase(1))) 
    for ( i of newDataTable){
      if(arraysDeObjetosIguais(i, resolveModified[0])){
        i[0].ID = "conclued"
        createTables(newDataTable)
      }
    }

    
    
      
  }else{
    alert("Erradoooooooo! humn... 😑")
  }

  

}


  
function modifiersToDataBase(database){
    let abc = "ABCDEFGHIJKLMNOPQRSTU"
    let arrAbc = abc.split('')
    let dataBase = database

    for (i of dataBase){
    // Substituir números por letras
    let resultToColStart = arrAbc.find(index =>  arrAbc.indexOf(index) == i[0].colStart - 1 )
    i[0].colStart = resultToColStart

    let resultToColEnd = arrAbc.find(index =>  arrAbc.indexOf(index) == i[0].colEnd - 1 )
    i[0].colEnd = resultToColEnd
    if (i[1]){
        let resultToColStart = arrAbc.find(index =>  arrAbc.indexOf(index) == i[1].colStart - 1 )
        i[1].colStart = resultToColStart

        let resultToColEnd = arrAbc.find(index =>  arrAbc.indexOf(index) == i[1].colEnd - 1 )
        i[1].colEnd = resultToColEnd   
      }
    
      //  Adicionar a key "direção" ao dataTable
      if(i[0].colStart == i[0].colEnd){
          i[0].direction = "Vertical"
      }else if(i[0].rowStart == i[0].rowEnd){
          i[0].direction = "Horizontal"
      }else{
        i[0].direction = "Diagonal"
      }
      

      if(i[1]){
        if(i[1].colStart == i[1].colEnd){
          i[1].direction = "Vertical"
        }else if(i[1].rowStart == i[1].rowEnd){
          i[1].direction = "Horizontal"
        }else{
          i[1].direction = "Diagonal"
        }
      }
      
      // add key ID
      i[0].ID = null
      if (i[1]) {i[1].ID = null}
    }

    

    return dataBase
}

function createTables(dataBase){

  
  
  for (i of dataBase){
    if (i[1]){
          conteinerTables.innerHTML += `
          <div class="cards conteiner-cards-table" data-ID="${i[0].ID}" >
              <div class="header-card">
                <img class="title-card" src="img/vecktor.png" >
                <spam class="nunber-card">${dataBase.indexOf(i) + 1}</spam>
              </div>
              <div class="cards-table">
                    <div>Vetores</div>
                    <div>Módulo</div>
                    <div>Direção</div>
                    <div>Origem</div>
                    <div>Extremidade</div>
                    <div>${i[0].name + 1}</div>
                    <div>${i[0].modulo}uni.</div>
                    <div>${i[0].direction}</div>
                    <div>${i[0].rowStart}${i[0].colStart}</div>
                    <div>${i[0].rowEnd}${i[0].colEnd}</div>
                    <div>${i[1].name + 2}</div>
                    <div>${i[1].modulo}uni.</div>
                    <div>${i[1].direction}</div>
                    <div>${i[1].rowStart}${i[1].colStart}</div>
                    <div>${i[1].rowEnd}${i[1].colEnd}</div>
              </div>
          </div>
          ` 
    }else{
        conteinerTables.innerHTML += `
        <div class="cards conteiner-cards-table" data-ID="${i[0].ID}" >
           <div class="header-card">
                <img class="title-card" src="img/vecktor.png" >
                <spam class="nunber-card">${dataBase.indexOf(i) + 1}</spam>
            </div>
            <div class="cards-table">
                  <div>Vetores</div>
                  <div>Módulo</div>
                  <div>Direção</div>
                  <div>Origem</div>
                  <div>Extremidade</div>
                  <div>${i[0].name + 1}</div>
                  <div>${i[0].modulo}uni.</div>
                  <div>${i[0].direction}</div>
                  <div>${i[0].rowStart}${i[0].colStart}</div>
                  <div>${i[0].rowEnd}${i[0].colEnd}</div>
            </div>
        </div>
        `
    }

  }
    return dataBase
}
createTables(modifiersToDataBase(getDataBase(1)))

function creatCardsOperetion(){
  let dataBaseTwo = getDataBase(2)
  for (i of dataBaseTwo.quests) {
    conteinerCardsOperations.innerHTML += `
      <div class="cards cards-operetions" >
          <div class="header-card">
            <img class="title-card" src="img/vecktor.png" >
            <spam class="nunber-card">${dataBaseTwo.quests.indexOf(i) + 1}</spam>
          </div>
          <div class="cards-operetion">
                <img width="100%" src=${i.name}>
          </div>
      </div>
    `

  }
  let cardsOperations = conteinerCardsOperations.querySelectorAll(".cards-operetions")
  cardsOperations.forEach((card)=>{
    card.addEventListener("click", ()=>{
      cardsOperations.forEach((card)=>{card.id = ""})
      card.id = "card-is-selected" 

      
      console.log(dataBaseTwo.quests[0].vectors[0].colStart)
      
      creatVectorByCoords({
        colStart: dataBaseTwo.quests[0].vectors[1].colStart,
        rowStart: dataBaseTwo.quests[0].vectors[1].rowStart,
        colEnd: dataBaseTwo.quests[0].vectors[1].colEnd,
        rowEnd: dataBaseTwo.quests[0].vectors[1].rowEnd
      });
      creatVectorByCoords({
        colStart: dataBaseTwo.quests[0].vectors[0].colStart,
        rowStart: dataBaseTwo.quests[0].vectors[0].rowStart,
        colEnd: dataBaseTwo.quests[0].vectors[0].colEnd,
        rowEnd: dataBaseTwo.quests[0].vectors[0].rowEnd
      })
    })
  })
  

}
creatCardsOperetion()


function getInputModuloVector(){
  let inputModulo = document.querySelector("#input-modulo").value
  return inputModulo
}

function clearInputModuloVector (){
  document.querySelector("#input-modulo").value = ""
}

function creatVectorByCoords({ colStart, rowStart, colEnd, rowEnd }) {
  const grid = document.getElementById("gride");
  const gridRect = grid.getBoundingClientRect();

  const cellWidth = gridRect.width / 21;
  const cellHeight = gridRect.height / 15;

  const deltaX = colEnd - colStart;
  const deltaY = rowEnd - rowStart;

  const angleRad = Math.atan2(deltaY, deltaX);
  const angleDeg = angleRad * (180 / Math.PI);

  const comprimento = Math.sqrt(deltaX ** 2 + deltaY ** 2) * cellWidth;
  const altura = 24;

  const tamCabeca = cellWidth * 0.6;
  const corpoComprimento = comprimento - tamCabeca;

  // Recalcular pontos SVG
  const base = `0,10 2,10 2,14 0,14`;
  const corpo = `2,10 ${corpoComprimento},10 ${corpoComprimento},14 2,14`;
  const cabeca = `2,0 ${corpoComprimento},24 ${comprimento},12`;

  // Criar wrapper
  const wrapper = document.createElement("div");
  wrapper.classList.add("draggable");
  wrapper.style.position = "absolute";
  wrapper.setAttribute("data-x", colStart * cellWidth);
  wrapper.setAttribute("data-y", rowStart * cellHeight);
  wrapper.setAttribute("data-colspan", Math.round(comprimento / cellWidth));
  wrapper.setAttribute("data-name", "Vetor");

  // Criar SVG com estrutura visual idêntica ao seu
  wrapper.innerHTML = `
    <svg class="vetor" data-angle="${angleDeg}" 
         width="${comprimento}" height="${altura}" 
         viewBox="0 0 ${comprimento} ${altura}">
      <polygon id="base" fill="white" points="${base}" />
      <polygon id="corpo" fill="white" points="${corpo}" data-comprimento="${corpoComprimento}" />
      
    </svg>
  `;

  const svg = wrapper.querySelector("svg");

  svg.addEventListener("click", () => {
    vetorSelecionado = svg;
    document.querySelectorAll(".vetor").forEach(v => {
      v.classList.remove("is-selected");
      v.style.outline = "none";
    });
    svg.classList.add("is-selected");
    svg.style.outline = "3px dotted yellow";
  });

  // Posicionar e aplicar rotação
  const x = colStart * cellWidth;
  const y = rowStart * cellHeight;
  wrapper.style.left = `${x}px`;
  wrapper.style.top = `${y}px`;
  wrapper.style.transform = `rotate(${angleDeg}deg)`;

  grid.appendChild(wrapper);

  // Auto selecionar vetor
  svg.dispatchEvent(new Event("click"));

  // Atualizar coordenadas do vetor
  if (typeof atualizarVetoresComGrid === "function") atualizarVetoresComGrid();
  if (typeof resolution === "function") resolution();
}









  




