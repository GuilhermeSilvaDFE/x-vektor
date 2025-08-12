


let gride = document.querySelector("#gride");
let vetorSelecionado = null;
let cardModal = document.querySelector(".card-modal")
let warrModal = document.querySelector(".warring")
let conteinerTables = document.querySelector("#conteiner-tables")
let conteinerCardsOperations = document.querySelector("#conteiner-cards-operetions")
let currentDataBase = modifiersToDataBase(getDataBase(1));
let currentDataBaseTwo = getDataBase(2)


// Criando objetos de som
const somAcerto = new Audio('sounds/success.mp3');
const somErro = new Audio('sounds/fail.mp3');
somAcerto.volume = 0.7
somErro.volume = 1


// Funções para tocar o som
function tocarSomAcerto() {
  somAcerto.currentTime = 0; // volta para o início
  
  somAcerto.play();
}

function tocarSomErro() {
  somErro.currentTime = 0;
  somErro.play();
}

function warr(message){
  let messageContent  = warrModal.querySelector("p")
  let btnClose = warrModal.querySelector("button")
  messageContent.textContent = message

  warrModal.style.display = "flex"

  
  warrModal.showModal()
  setTimeout(()=>{
    warrModal.close()
    warrModal.style.display = "none"
  }, 5000)
  btnClose.addEventListener("click",()=>{
    warrModal.close()
    warrModal.style.display = "none"
  })

}


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
      <polygon id="base" fill="black" />
      <polygon id="corpo" fill="black" />
      <polygon id="cabeca" fill="black" />
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
  angle = (angle + 15) % 360;

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
      //{
      //   name:"img/quests-fase-two/q1.png",
      //   id: null,
      //   operationResult: 222,
      //   vectors: `
      //     <div class="draggable" data-x="49.28001403808594" data-y="204.15998077392578" data-colspan="7" style="position: absolute; transform: translate(49.28px, 204.16px) rotate(315deg);" data-name="Vetor" data-colstart="3" data-rowstart="10" data-colend="8" data-rowend="5">
      //       <svg class="vetor is-selected" data-angle="315" width="216.14333089192706" viewBox="0 0 216.14333089192706 24" style="outline: none;">
      //         <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //         <polygon id="corpo" fill="black" points="2,10 
      //         209.96780715215772,10 
      //         216.14333089192706,12 
      //         209.96780715215772,14 
      //         2,14" data-comprimento="209.96780715215772"></polygon>
      //         <polygon id="cabeca" fill="black"></polygon>
      //       </svg>
      //     </div><div class="draggable" data-x="236.79999542236328" data-y="284.1599349975586" data-colspan="4" style="position: absolute; transform: translate(236.8px, 284.16px) rotate(0deg);" data-name="Vetor" data-colstart="8" data-rowstart="10" data-colend="12" data-rowend="10">
      //       <svg class="vetor is-selected" data-angle="0" width="123.5104747953869" viewBox="0 0 123.5104747953869 24" style="outline: none;">
      //         <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //         <polygon id="corpo" fill="black" points="2,10 
      //         117.33495105561755,10 
      //         123.5104747953869,12 
      //         117.33495105561755,14 
      //         2,14" data-comprimento="117.33495105561755"></polygon>
      //         <polygon id="cabeca" fill="black"></polygon>
      //       </svg>
      //     </div><div class="draggable" data-x="371.19998931884766" data-y="275.2000045776367" data-colspan="5" style="position: absolute; transform: translate(371.2px, 275.2px) rotate(90deg);" data-name="Vetor" data-colstart="15" data-rowstart="7" data-colend="15" data-rowend="12">
      //       <svg class="vetor is-selected" data-angle="90" width="154.38809349423363" viewBox="0 0 154.38809349423363 24" style="outline: yellow dotted 3px;">
      //         <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //         <polygon id="corpo" fill="black" points="2,10 
      //         148.21256975446428,10 
      //         154.38809349423363,12 
      //         148.21256975446428,14 
      //         2,14" data-comprimento="148.21256975446428"></polygon>
      //         <polygon id="cabeca" fill="black"></polygon>
      //       </svg>
      //     </div>
      //   `,
      //   vectorsResult:`
      //   <div class="draggable" data-x="49.28001403808594" data-y="204.15998077392578" data-colspan="7" style="position: absolute; transform: translate(49.28px, 204.16px) rotate(315deg);" data-name="Vetor" data-colstart="3" data-rowstart="10" data-colend="8" data-rowend="5">
      //             <svg class="vetor is-selected" data-angle="315" width="216.14333089192706" viewBox="0 0 216.14333089192706 24" style="outline: none;">
      //               <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //               <polygon id="corpo" fill="black" points="2,10 
      //       209.96780715215772,10 
      //       216.14333089192706,12 
      //       209.96780715215772,14 
      //       2,14" data-comprimento="209.96780715215772"></polygon>
      //               <polygon id="cabeca" fill="black"></polygon>
      //             </svg>
      //           </div><div class="draggable" data-x="229.1199722290039" data-y="131.1999282836914" data-colspan="4" style="position: absolute; transform: translate(229.12px, 131.2px) rotate(0deg);" data-name="Vetor" data-colstart="8" data-rowstart="10" data-colend="12" data-rowend="10">
      //             <svg class="vetor is-selected" data-angle="0" width="123.5104747953869" viewBox="0 0 123.5104747953869 24" style="outline: none;">
      //               <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //               <polygon id="corpo" fill="black" points="2,10 
      //       117.33495105561755,10 
      //       123.5104747953869,12 
      //       117.33495105561755,14 
      //       2,14" data-comprimento="117.33495105561755"></polygon>
      //               <polygon id="cabeca" fill="black"></polygon>
      //             </svg>
      //           </div><div class="draggable" data-x="273.91992950439453" data-y="205.43999481201172" data-colspan="5" style="position: absolute; transform: translate(273.92px, 205.44px) rotate(90deg);" data-name="Vetor" data-colstart="15" data-rowstart="7" data-colend="15" data-rowend="12">
      //             <svg class="vetor is-selected" data-angle="90" width="154.38809349423363" viewBox="0 0 154.38809349423363 24" style="outline: none;">
      //               <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //               <polygon id="corpo" fill="black" points="2,10 
      //       148.21256975446428,10 
      //       154.38809349423363,12 
      //       148.21256975446428,14 
      //       2,14" data-comprimento="148.21256975446428"></polygon>
      //               <polygon id="cabeca" fill="black"></polygon>
      //             </svg>
      //           </div><div class="draggable" data-x="78.71998596191406" data-y="280.95999908447266" data-colspan="9" data-name="Vetor" data-colstart="3" data-rowstart="10" data-colend="12" data-rowend="10" style="position: absolute; transform: translate(78.72px, 280.96px) rotate(0deg);">
      //     <svg class="vetor is-selected" data-angle="0" width="277.8985682896205" viewBox="0 0 277.8985682896205 24" style="outline: yellow dotted 3px;">
      //       <polygon id="base" fill="red" points="0,10 2,10 2,14 0,14"></polygon>
      //       <polygon id="corpo" fill="red" points="2,10 
      //       271.7230445498512,10 
      //       277.8985682896205,12 
      //       271.7230445498512,14 
      //       2,14" data-comprimento="271.7230445498512"></polygon>
      //       <polygon id="cabeca" fill="black"></polygon>
      //     </svg>
      //   </div>
      //   `
      // },
      {
        name:"img/quests-fase-two/q2.png",
        id: null,
        operationResult: 13,
        vectors:`
         <div class="draggable" data-x="1.279998779296875" data-y="170.8800277709961" data-colspan="5" style="position: absolute; transform: translate(1.28px, 170.88px) rotate(270deg);" data-name="Vetor" data-colstart="3" data-rowstart="9" data-colend="3" data-rowend="4">
          <svg class="vetor is-selected" data-angle="270" width="154.38809349423363" viewBox="0 0 154.38809349423363 24" style="outline: yellow dotted 3px;">
            <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
            <polygon id="corpo" fill="black" points="2,10 
            148.21256975446428,10 
            154.38809349423363,12 
            148.21256975446428,14 
            2,14" data-comprimento="148.21256975446428"></polygon>
            <polygon id="cabeca" fill="black"></polygon>
          </svg>
        </div><div class="draggable" data-x="262.39996337890625" data-y="190.08001708984375" data-colspan="12" style="position: absolute; transform: translate(262.4px, 190.08px) rotate(0deg);" data-name="Vetor" data-colstart="9" data-rowstart="7" data-colend="21" data-rowend="7">
          <svg class="vetor is-selected" data-angle="0" width="370.53142438616067" viewBox="0 0 370.53142438616067 24" style="outline: none;">
            <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
            <polygon id="corpo" fill="black" points="2,10 
            364.3559006463913,10 
            370.53142438616067,12 
            364.3559006463913,14 
            2,14" data-comprimento="364.3559006463913"></polygon>
            <polygon id="cabeca" fill="black"></polygon>
          </svg>
        </div>
        `,
        vectorsResult:`
           <div class="draggable" data-x="32.64000701904297" data-y="233.6000213623047" data-colspan="3" style="position: absolute; transform: translate(32.64px, 233.6px) rotate(270deg);" data-name="Vetor" data-colstart="3" data-rowstart="10" data-colend="3" data-rowend="7">
            <svg class="vetor is-selected" data-angle="270" width="92.63285609654017" viewBox="0 0 92.63285609654017 24" style="outline: none;">
              <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
              <polygon id="corpo" fill="black" points="2,10 
              86.45733235677082,10 
              92.63285609654017,12 
              86.45733235677082,14 
              2,14" data-comprimento="86.45733235677082"></polygon>
                      <polygon id="cabeca" fill="black"></polygon>
                    </svg>
                  </div><div class="draggable" data-x="72.96000671386719" data-y="283.51995849609375" data-colspan="6" style="position: absolute; transform: translate(72.96px, 283.52px) rotate(0deg);" data-name="Vetor" data-colstart="10" data-rowstart="8" data-colend="16" data-rowend="8">
                    <svg class="vetor is-selected" data-angle="0" width="185.26571219308033" viewBox="0 0 185.26571219308033 24" style="outline: none;">
                      <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
                      <polygon id="corpo" fill="black" points="2,10 
              179.090188453311,10 
              185.26571219308033,12 
              179.090188453311,14 
              2,14" data-comprimento="179.090188453311"></polygon>
                      <polygon id="cabeca" fill="black"></polygon>
                    </svg>
                  </div><div class="draggable" data-x="60.80000305175781" data-y="228.48001098632812" data-colspan="7" style="position: absolute; transform: translate(60.8px, 228.48px) rotate(330deg);" data-name="Vetor" data-colstart="3" data-rowstart="10" data-colend="9" data-rowend="7">
            <svg class="vetor is-selected" data-angle="330" width="216.14333089192706" viewBox="0 0 216.14333089192706 24" style="outline: yellow dotted 3px;">
              <polygon id="base" fill="red" points="0,10 2,10 2,14 0,14"></polygon>
              <polygon id="corpo" fill="red" points="2,10 
              209.96780715215772,10 
              216.14333089192706,12 
              209.96780715215772,14 
              2,14" data-comprimento="209.96780715215772"></polygon>
              <polygon id="cabeca" fill="black"></polygon>
            </svg>
          </div>
        `
      },
      // {
      //   name:"img/quests-fase-two/q3.png",
      //   id: null,
      //   operationResult: 3,
      //   vectors:`
      //     <div class="draggable" data-x="218.24002075195312" data-y="235.52001953125" data-colspan="10" style="position: absolute; transform: translate(218.24px, 235.52px) rotate(315deg);" data-name="Vetor" data-colstart="9" data-rowstart="12" data-colend="16" data-rowend="5">
      //       <svg class="vetor is-selected" data-angle="315" width="308.77618698846726" viewBox="0 0 308.77618698846726 24" style="outline: none;">
      //         <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //         <polygon id="corpo" fill="black" points="2,10 
      //         302.6006632486979,10 
      //         308.77618698846726,12 
      //         302.6006632486979,14 
      //         2,14" data-comprimento="302.6006632486979"></polygon>
      //         <polygon id="cabeca" fill="black"></polygon>
      //       </svg>
      //     </div><div class="draggable" data-x="13.44000244140625" data-y="143.35997009277344" data-colspan="6" style="position: absolute; transform: translate(13.44px, 143.36px) rotate(90deg);" data-name="Vetor" data-colstart="4" data-rowstart="3" data-colend="4" data-rowend="9">
      //       <svg class="vetor is-selected" data-angle="90" width="185.26571219308033" viewBox="0 0 185.26571219308033 24" style="outline: yellow dotted 3px;">
      //         <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //         <polygon id="corpo" fill="black" points="2,10 
      //         179.090188453311,10 
      //         185.26571219308033,12 
      //         179.090188453311,14 
      //         2,14" data-comprimento="179.090188453311"></polygon>
      //         <polygon id="cabeca" fill="black"></polygon>
      //       </svg>
      //   </div>
      //   `,
      //     vectorsResult:`
      //     <div class="draggable" data-x="218.24002075195312" data-y="235.52001953125" data-colspan="10" style="position: absolute; transform: translate(218.24px, 235.52px) rotate(315deg);" data-name="Vetor" data-colstart="9" data-rowstart="12" data-colend="16" data-rowend="5">
      //       <svg class="vetor is-selected" data-angle="315" width="308.77618698846726" viewBox="0 0 308.77618698846726 24" style="outline: none;">
      //         <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //         <polygon id="corpo" fill="black" points="2,10 
      //         302.6006632486979,10 
      //         308.77618698846726,12 
      //         302.6006632486979,14 
      //         2,14" data-comprimento="302.6006632486979"></polygon>
      //                 <polygon id="cabeca" fill="black"></polygon>
      //               </svg>
      //             </div><div class="draggable" data-x="369.9199981689453" data-y="234.23997497558594" data-colspan="7" style="position: absolute; transform: translate(369.92px, 234.24px) rotate(90deg);" data-name="Vetor" data-colstart="16" data-rowstart="5" data-colend="16" data-rowend="12">
      //       <svg class="vetor is-selected" data-angle="90" width="216.14333089192706" viewBox="0 0 216.14333089192706 24" style="outline: none;">
      //         <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
      //         <polygon id="corpo" fill="black" points="2,10 
      //         209.96780715215772,10 
      //         216.14333089192706,12 
      //         209.96780715215772,14 
      //         2,14" data-comprimento="209.96780715215772"></polygon>
      //         <polygon id="cabeca" fill="black"></polygon>
      //       </svg>
      //     </div><div class="draggable" data-x="260.48004150390625" data-y="345.59999084472656" data-colspan="7" style="position: absolute; transform: translate(260.48px, 345.6px) rotate(0deg);" data-name="Vetor" data-colstart="9" data-rowstart="12" data-colend="16" data-rowend="12">
      //       <svg class="vetor is-selected" data-angle="0" width="216.14333089192706" viewBox="0 0 216.14333089192706 24" style="outline: yellow dotted 3px;">
      //         <polygon id="base" fill="red" points="0,10 2,10 2,14 0,14"></polygon>
      //         <polygon id="corpo" fill="red" points="2,10 
      //         209.96780715215772,10 
      //         216.14333089192706,12 
      //         209.96780715215772,14 
      //         2,14" data-comprimento="209.96780715215772"></polygon>
      //         <polygon id="cabeca" fill="black"></polygon>
      //       </svg>
      //     </div>
          
      //     `

      // },
      {
        name:"img/quests-fase-two/q4.png",
        id: null,
        operationResult: 10,
        vectors:`
          <div class="draggable" data-x="55.040008544921875" data-y="63.99999237060547" data-colspan="16" style="position: absolute; transform: translate(55.04px, 64px) rotate(0deg);" data-name="Vetor" data-colstart="2" data-rowstart="3" data-colend="18" data-rowend="3">
            <svg class="vetor is-selected" data-angle="0" width="494.0418991815476" viewBox="0 0 494.0418991815476 24" style="outline: none;">
              <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
              <polygon id="corpo" fill="black" points="2,10 
              487.86637544177825,10 
              494.0418991815476,12 
              487.86637544177825,14 
              2,14" data-comprimento="487.86637544177825"></polygon>
              <polygon id="cabeca" fill="black"></polygon>
            </svg>
          </div><div class="draggable" data-x="203.5199737548828" data-y="344.3199920654297" data-colspan="6" style="position: absolute; transform: translate(203.52px, 344.32px) rotate(0deg);" data-name="Vetor" data-colstart="7" data-rowstart="12" data-colend="13" data-rowend="12">
            <svg class="vetor is-selected" data-angle="0" width="185.26571219308033" viewBox="0 0 185.26571219308033 24" style="outline: yellow dotted 3px;">
              <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
              <polygon id="corpo" fill="black" points="2,10 
              179.090188453311,10 
              185.26571219308033,12 
              179.090188453311,14 
              2,14" data-comprimento="179.090188453311"></polygon>
              <polygon id="cabeca" fill="black"></polygon>
            </svg>
          </div>
        `,
        vectorsResult:`
         <div class="draggable" data-x="45.44000244140625" data-y="65.2800064086914" data-colspan="16" style="position: absolute; transform: translate(45.44px, 65.28px) rotate(0deg);" data-name="Vetor" data-colstart="2" data-rowstart="3" data-colend="18" data-rowend="3">
            <svg class="vetor is-selected" data-angle="0" width="494.0418991815476" viewBox="0 0 494.0418991815476 24" style="outline: none;">
              <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
              <polygon id="corpo" fill="black" points="2,10 
              487.86637544177825,10 
              494.0418991815476,12 
              487.86637544177825,14 
              2,14" data-comprimento="487.86637544177825"></polygon>
                      <polygon id="cabeca" fill="black"></polygon>
                    </svg>
                  </div><div class="draggable" data-x="199.0399932861328" data-y="339.1999816894531" data-colspan="6" style="position: absolute; transform: translate(199.04px, 339.2px) rotate(180deg);" data-name="Vetor" data-colstart="13" data-rowstart="12" data-colend="7" data-rowend="12">
            <svg class="vetor is-selected" data-angle="180" width="185.26571219308033" viewBox="0 0 185.26571219308033 24" style="outline: none;">
              <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
              <polygon id="corpo" fill="black" points="2,10 
              179.090188453311,10 
              185.26571219308033,12 
              179.090188453311,14 
              2,14" data-comprimento="179.090188453311"></polygon>
              <polygon id="cabeca" fill="black"></polygon>
            </svg>
          </div><div class="draggable" data-x="44.79998779296875" data-y="405.11998748779297" data-colspan="10" style="position: absolute; transform: translate(44.8px, 405.12px) rotate(0deg);" data-name="Vetor" data-colstart="2" data-rowstart="14" data-colend="12" data-rowend="14">
            <svg class="vetor is-selected" data-angle="0" width="308.77618698846726" viewBox="0 0 308.77618698846726 24" style="outline: yellow dotted 3px;">
              <polygon id="base" fill="red" points="0,10 2,10 2,14 0,14"></polygon>
              <polygon id="corpo" fill="red" points="2,10 
              302.6006632486979,10 
              308.77618698846726,12 
              302.6006632486979,14 
              2,14" data-comprimento="302.6006632486979"></polygon>
              <polygon id="cabeca" fill="black"></polygon>
            </svg>
          </div>
 
       `
      },
      {
        name:"img/quests-fase-two/q5.png",
        id: null,
        operationResult: 14,
        vectors:`
          <div class="draggable" data-x="14.720001220703125" data-y="158.08000946044922" data-colspan="4" style="position: absolute; transform: translate(14.72px, 158.08px) rotate(0deg);" data-name="Vetor" data-colstart="1" data-rowstart="6" data-colend="5" data-rowend="6">
              <svg class="vetor is-selected" data-angle="0" width="123.5104747953869" viewBox="0 0 123.5104747953869 24" style="outline: none;">
                <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
                <polygon id="corpo" fill="black" points="2,10 
                117.33495105561755,10 
                123.5104747953869,12 
                117.33495105561755,14 
                2,14" data-comprimento="117.33495105561755"></polygon>
                <polygon id="cabeca" fill="black"></polygon>
              </svg>
            </div><div class="draggable" data-x="263.03997802734375" data-y="189.44001007080078" data-colspan="2" style="position: absolute; transform: translate(263.04px, 189.44px) rotate(0deg);" data-name="Vetor" data-colstart="9" data-rowstart="7" data-colend="11" data-rowend="7">
              <svg class="vetor is-selected" data-angle="0" width="61.75523739769345" viewBox="0 0 61.75523739769345 24" style="outline: yellow dotted 3px;">
                <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
                <polygon id="corpo" fill="black" points="2,10 
                55.5797136579241,10 
                61.75523739769345,12 
                55.5797136579241,14 
                2,14" data-comprimento="55.5797136579241"></polygon>
                <polygon id="cabeca" fill="black"></polygon>
              </svg>
          </div>

        `,
        vectorsResult:`
        <div class="draggable" data-x="46.720001220703125" data-y="157.43999481201172" data-colspan="8" style="position: absolute; transform: translate(46.72px, 157.44px) rotate(0deg);" data-name="Vetor" data-colstart="2" data-rowstart="6" data-colend="10" data-rowend="6">
          <svg class="vetor is-selected" data-angle="0" width="247.0209495907738" viewBox="0 0 247.0209495907738 24" style="outline: none;">
            <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
            <polygon id="corpo" fill="black" points="2,10 
            240.84542585100445,10 
            247.0209495907738,12 
            240.84542585100445,14 
            2,14" data-comprimento="240.84542585100445"></polygon>
            <polygon id="cabeca" fill="black"></polygon>
          </svg>
        </div><div class="draggable" data-x="289.2799835205078" data-y="219.51998138427734" data-colspan="6" style="position: absolute; transform: translate(289.28px, 219.52px) rotate(0deg);" data-name="Vetor" data-colstart="10" data-rowstart="8" data-colend="16" data-rowend="8">
          <svg class="vetor is-selected" data-angle="0" width="185.26571219308033" viewBox="0 0 185.26571219308033 24" style="outline: none;">
            <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
            <polygon id="corpo" fill="black" points="2,10 
            179.090188453311,10 
            185.26571219308033,12 
            179.090188453311,14 
            2,14" data-comprimento="179.090188453311"></polygon>
            <polygon id="cabeca" fill="black"></polygon>
          </svg>
        </div><div class="draggable" data-x="43.52001953125" data-y="282.8800048828125" data-colspan="14" style="position: absolute; transform: translate(43.52px, 282.88px) rotate(0deg);" data-name="Vetor" data-colstart="2" data-rowstart="10" data-colend="16" data-rowend="10">
          <svg class="vetor is-selected" data-angle="0" width="432.28666178385413" viewBox="0 0 432.28666178385413 24" style="outline: yellow dotted 3px;">
            <polygon id="base" fill="red" points="0,10 2,10 2,14 0,14"></polygon>
            <polygon id="corpo" fill="red" points="2,10 
            426.1111380440848,10 
            432.28666178385413,12 
            426.1111380440848,14 
            2,14" data-comprimento="426.1111380440848"></polygon>
            <polygon id="cabeca" fill="black"></polygon>
          </svg>
        </div>

        `

      },
      {
        name:"img/quests-fase-two/q6.png",
        id: null,
        operationResult: 16,
        vectors:`
          <div class="draggable" data-x="-17.920005798339844" data-y="61.43999481201172" data-colspan="4" style="position: absolute; transform: translate(-17.92px, 61.44px) rotate(90deg);" data-name="Vetor" data-colstart="2" data-rowstart="1" data-colend="2" data-rowend="5">
              <svg class="vetor is-selected" data-angle="90" width="123.5104747953869" viewBox="0 0 123.5104747953869 24" style="outline: none;">
                <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
                <polygon id="corpo" fill="black" points="2,10 
                117.33495105561755,10 
                123.5104747953869,12 
                117.33495105561755,14 
                2,14" data-comprimento="117.33495105561755"></polygon>
                <polygon id="cabeca" fill="black"></polygon>
              </svg>
            </div><div class="draggable" data-x="105.59999084472656" data-y="122.23998260498047" data-colspan="8" style="position: absolute; transform: translate(105.6px, 122.24px) rotate(90deg);" data-name="Vetor" data-colstart="8" data-rowstart="1" data-colend="8" data-rowend="9">
              <svg class="vetor is-selected" data-angle="90" width="247.0209495907738" viewBox="0 0 247.0209495907738 24" style="outline: yellow dotted 3px;">
                <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
                <polygon id="corpo" fill="black" points="2,10 
                240.84542585100445,10 
                247.0209495907738,12 
                240.84542585100445,14 
                2,14" data-comprimento="240.84542585100445"></polygon>
                <polygon id="cabeca" fill="black"></polygon>
              </svg>
          </div>
        `,
        vectorsResult:`
        <div class="draggable" data-x="167.68000030517578" data-y="311.0399703979492" data-colspan="4" style="position: absolute; transform: translate(167.68px, 311.04px) rotate(90deg);" data-name="Vetor" data-colstart="2" data-rowstart="1" data-colend="2" data-rowend="5">
              <svg class="vetor is-selected" data-angle="90" width="123.5104747953869" viewBox="0 0 123.5104747953869 24" style="outline: none;">
                <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
                <polygon id="corpo" fill="black" points="2,10 
                117.33495105561755,10 
                123.5104747953869,12 
                117.33495105561755,14 
                2,14" data-comprimento="117.33495105561755"></polygon>
                          <polygon id="cabeca" fill="black"></polygon>
                        </svg>
                      </div><div class="draggable" data-x="105.59999084472656" data-y="122.23998260498047" data-colspan="8" style="position: absolute; transform: translate(105.6px, 122.24px) rotate(90deg);" data-name="Vetor" data-colstart="8" data-rowstart="1" data-colend="8" data-rowend="9">
                        <svg class="vetor is-selected" data-angle="90" width="247.0209495907738" viewBox="0 0 247.0209495907738 24" style="outline: none;">
                          <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
                          <polygon id="corpo" fill="black" points="2,10 
                240.84542585100445,10 
                247.0209495907738,12 
                240.84542585100445,14 
                2,14" data-comprimento="240.84542585100445"></polygon>
                          <polygon id="cabeca" fill="black"></polygon>
                        </svg>
                    </div><div class="draggable" data-x="104.96000671386719" data-y="186.2399673461914" data-colspan="12" style="position: absolute; transform: translate(104.96px, 186.24px) rotate(90deg);" data-name="Vetor" data-colstart="10" data-rowstart="1" data-colend="10" data-rowend="13">
              <svg class="vetor is-selected" data-angle="90" width="370.53142438616067" viewBox="0 0 370.53142438616067 24" style="outline: yellow dotted 3px;">
                <polygon id="base" fill="red" points="0,10 2,10 2,14 0,14"></polygon>
                <polygon id="corpo" fill="red" points="2,10 
                364.3559006463913,10 
                370.53142438616067,12 
                364.3559006463913,14 
                2,14" data-comprimento="364.3559006463913"></polygon>
                <polygon id="cabeca" fill="black"></polygon>
              </svg>
            </div>
        `
      },
      {
        name:"img/quests-fase-two/q7.png",
        id: null,
        operationResult: 4,
        vectors:`
          <div class="draggable" data-x="43.519989013671875" data-y="220.79998779296875" data-colspan="10" style="position: absolute; transform: translate(43.52px, 220.8px) rotate(0deg);" data-name="Vetor" data-colstart="2" data-rowstart="8" data-colend="12" data-rowend="8">
            <svg class="vetor is-selected" data-angle="0" width="308.77618698846726" viewBox="0 0 308.77618698846726 24" style="outline: none;">
              <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
              <polygon id="corpo" fill="black" points="2,10 
              302.6006632486979,10 
              308.77618698846726,12 
              302.6006632486979,14 
              2,14" data-comprimento="302.6006632486979"></polygon>
              <polygon id="cabeca" fill="black"></polygon>
            </svg>
          </div><div class="draggable" data-x="289.9199981689453" data-y="278.39998626708984" data-colspan="6" style="position: absolute; transform: translate(289.92px, 278.4px) rotate(180deg);" data-name="Vetor" data-colstart="16" data-rowstart="10" data-colend="10" data-rowend="10">
            <svg class="vetor is-selected" data-angle="180" width="185.26571219308033" viewBox="0 0 185.26571219308033 24" style="outline: yellow dotted 3px;">
              <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
              <polygon id="corpo" fill="black" points="2,10 
              179.090188453311,10 
              185.26571219308033,12 
              179.090188453311,14 
              2,14" data-comprimento="179.090188453311"></polygon>
              <polygon id="cabeca" fill="black"></polygon>
            </svg>
          </div>
        `,
        vectorsResult:`
          <div class="draggable" data-x="43.519989013671875" data-y="220.79998779296875" data-colspan="10" style="position: absolute; transform: translate(43.52px, 220.8px) rotate(0deg);" data-name="Vetor" data-colstart="2" data-rowstart="8" data-colend="12" data-rowend="8">
                  <svg class="vetor is-selected" data-angle="0" width="308.77618698846726" viewBox="0 0 308.77618698846726 24" style="outline: none;">
                    <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
                    <polygon id="corpo" fill="black" points="2,10 
            302.6006632486979,10 
            308.77618698846726,12 
            302.6006632486979,14 
            2,14" data-comprimento="302.6006632486979"></polygon>
                    <polygon id="cabeca" fill="black"></polygon>
                  </svg>
                </div><div class="draggable" data-x="170.24000549316406" data-y="276.4800033569336" data-colspan="6" style="position: absolute; transform: translate(170.24px, 276.48px) rotate(180deg);" data-name="Vetor" data-colstart="16" data-rowstart="10" data-colend="10" data-rowend="10">
                  <svg class="vetor is-selected" data-angle="180" width="185.26571219308033" viewBox="0 0 185.26571219308033 24" style="outline: none;">
                    <polygon id="base" fill="black" points="0,10 2,10 2,14 0,14"></polygon>
                    <polygon id="corpo" fill="black" points="2,10 
            179.090188453311,10 
            185.26571219308033,12 
            179.090188453311,14 
            2,14" data-comprimento="179.090188453311"></polygon>
                    <polygon id="cabeca" fill="black"></polygon>
                  </svg>
                </div><div class="draggable" data-x="43.52000427246094" data-y="158.72000122070312" data-colspan="4" style="position: absolute; transform: translate(43.52px, 158.72px) rotate(0deg);" data-name="Vetor" data-colstart="2" data-rowstart="6" data-colend="6" data-rowend="6">
          <svg class="vetor is-selected" data-angle="0" width="123.5104747953869" viewBox="0 0 123.5104747953869 24" style="outline: yellow dotted 3px;">
            <polygon id="base" fill="red" points="0,10 2,10 2,14 0,14"></polygon>
            <polygon id="corpo" fill="red" points="2,10 
            117.33495105561755,10 
            123.5104747953869,12 
            117.33495105561755,14 
            2,14" data-comprimento="117.33495105561755"></polygon>
            <polygon id="cabeca" fill="black"></polygon>
          </svg>
        </div>
        `
      }
     
    ],
    
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

// localStorage.setItem("vectorsRegisted", JSON.stringify([]))
// function registrar(){
//     let conjuntoOfVectors = document.querySelectorAll(".draggable")
//     let vectorsRegisted =  JSON.parse(localStorage.getItem("vectorsRegisted"))
    
//     txt = document.createElement("div")
 
//     for(i=0; i< conjuntoOfVectors.length; i++){
//       txt.appendChild(conjuntoOfVectors[i])
//     }
//     console.log(txt.innerHTML)
    
    
//     vectorsRegisted[vectorsRegisted.length] = txt.innerHTML

//     localStorage.setItem("vectorsRegisted", JSON.stringify(vectorsRegisted))

    
   
    

// }



function valid(resultOfOpration, cardName){
  

  if(resultOfOpration){
    
     let result = currentDataBaseTwo.quests.find((el)=> el.operationResult == resultOfOpration)
     let resultIndex = currentDataBaseTwo.quests.findIndex((el)=> el.name == cardName)
  
      if(result && (currentDataBaseTwo.quests.indexOf(result) == resultIndex)){
        tocarSomAcerto()
        warr("CORRETO!")
        currentDataBaseTwo.quests[currentDataBaseTwo.quests.indexOf(result)].id = "conclued"
        resert()
        document.querySelector('#gride').innerHTML += currentDataBaseTwo.quests[currentDataBaseTwo.quests.indexOf(result)].vectorsResult
        currentDataBaseTwo.quests.forEach((el)=>{
             console.log(el.id)
        })
       
        creatCardsOperetion(currentDataBaseTwo)
      }else{
        tocarSomErro()
        warr("Erradoooooooo! humn... 😑")
        
      }
    return
  }


  
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
    tocarSomAcerto()
    warr("CORRETO!")
    resert()
    let resolveModified = modifiersToDataBase([resolve])
    
    for ( i of currentDataBase){
      if(arraysDeObjetosIguais(i, resolveModified[0])){
        i[0].id = "conclued"
      
      }
    }

    createTables(currentDataBase);
    
      
  }else{
    tocarSomErro()
    warr("Erradoooooooo! humn... 😑")
   
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
      if (typeof i[0].id === "undefined") i[0].id = null;
      if (i[1] && typeof i[1].id === "undefined") i[1].id = null;

    }

    

    return dataBase
}

function createTables(dataBase){
  conteinerTables.innerHTML = ""
  
  for (i of dataBase){
    if (i[1]){
          conteinerTables.innerHTML += `
          <div class="cards conteiner-cards-table" id="${i[0].id}" >
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
        <div class="cards conteiner-cards-table" id="${i[0].id}" >
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

function creatCardsOperetion(dataBaseTwo){
  conteinerCardsOperations.innerHTML = ''
  for (i of dataBaseTwo.quests) {
    conteinerCardsOperations.innerHTML += `
      <div class="cards cards-operetions"  id="${i.id}">
          <div class="header-card">
            <img class="title-card" src="img/vecktor.png" >
            <spam class="nunber-card">${dataBaseTwo.quests.indexOf(i) + 8}</spam>
          </div>
          <div class="cards-operetion">
                <img data-selected="" class="img-vectors" width="100%" src=${i.name}>
                
               <div class="conteiner-btn-cards-operetion">
                  <label class="conteiner-input" for="input-operetion-${dataBaseTwo.quests.indexOf(i)}">
                    <span>Sua resposta:</span>
                    <input id="input-operetion-${dataBaseTwo.quests.indexOf(i)}" class="input"  placeholder="___" type="number">
                  </label> 
                  <button class="btn-comfirm" >Cofirmar resposta!</button>
               </div>
          </div>
      </div>
    `

  }
  let btnCardOperationConfirm = document.querySelectorAll(".btn-comfirm")

  btnCardOperationConfirm = Array.from(btnCardOperationConfirm)

  btnCardOperationConfirm.forEach((el)=>{
    el.addEventListener("click",()=>{
      let  cardName = el.closest(".cards-operetion").querySelector("img").getAttribute("src")
      let resultOfOpration = getInputValueVector(`#input-operetion-${btnCardOperationConfirm.indexOf(el)}`)
      if (resultOfOpration) {
        valid(resultOfOpration, cardName)
        clearInputValueVector(`#input-operetion-${btnCardOperationConfirm.indexOf(el)}`)
        
      }else{
        warr("Por favor, digte um valor.")
        tocarSomErro()
      }
      
    })
  })

  let imgVectors = Array.from(conteinerCardsOperations.querySelectorAll(".img-vectors"));
 
  imgVectors.forEach((img)=>{
    img.addEventListener("click", ()=>{
      resert()
      
      document.querySelectorAll(".img-vectors").forEach((img)=>{img.setAttribute("data-selected", "")})
      img.setAttribute("data-selected", "card-is-selected")

      document.querySelector("#gride").innerHTML += getDataBase(2).quests[imgVectors.indexOf(img)].vectors;

      
   
    })

  })

  

}
creatCardsOperetion(getDataBase(2))


function getInputValueVector(input){
  let inputModulo = document.querySelector(input).value
  return inputModulo
}

function clearInputValueVector(input){
  document.querySelector(input).value = ""
}





// //------------------------------------
// // calculadora 
// //------------------------------------
// let toggleBtn = Array.from(document.querySelectorAll('.toggleCalc'));
// let calc = Array.from(document.querySelectorAll('.calc'));
// let display = Array.from(document.querySelectorAll('.display'));

// // Estados independentes para cada calculadora
// let expressions = Array(calc.length).fill('');

// // Alternar visibilidade de cada calculadora
// toggleBtn.forEach((el) => {
//   el.addEventListener('click', () => {
//     const i = toggleBtn.indexOf(el);
//     const visible = calc[i].getAttribute('data-display') === 'false';
//     calc[i].setAttribute('data-display', visible ? 'true' : 'false');
//   });
// });

// // Função de avaliação segura
// function safeEval(expr) {
//   // Substitui ^ por ** para potenciação
//   expr = expr.replace(/\^/g, '**');

//   // Apenas números, operadores e parênteses permitidos
//   if (!/^[0-9+\-*/().\s**]+$/.test(expr)) {
//     throw new Error('Expressão inválida');
//   }

//   // Usa eval apenas sobre expressões limpas
//   return eval(expr);
// }

// // Eventos para cada calculadora
// calc.forEach((el) => {
//   el.addEventListener('click', (e) => {
//     const btn = e.target.closest('button');
//     if (!btn) return;
//     const i = calc.indexOf(el);
//     const val = btn.textContent.trim();

//     if (val === 'C') {
//       expressions[i] = '';
//       display[i].value = '';
//       return;
//     }

//     if (val === '=') {
//       try {
//         const result = safeEval(expressions[i]);
//         valid(result)
//         display[i].value = String(result);
//         expressions[i] = String(result);
//       } catch {
//         display[i].value = 'Erro';
//         expressions[i] = '';
//       }
//       return;
//     }

//     expressions[i] += val;
//     display[i].value = expressions[i];
//   });
// });















  




