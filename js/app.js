// ============Asosiy qisim===================
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#search-btn");
const audioSection = document.querySelector("#audio-section");
const meaningsSection = document.querySelector("#meanings");
const sourceLink = document.querySelector("#source-link");

function searchWord() {
  const query = searchInput.value.trim();

  if (query == "") {
    alert("So'z kiriting!");
    return;
  }

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
    .then(function (response) {
      if (!response.status == 200) {
        throw new Error("So'z topilmadi!");
      }
      return response.json();
    })
    .then(function (data) {
      displayWordData(data[0]);
    })
    .catch(function (error) {
      errorBlock(error.message);
    });
}



function createAudioSection(word, phonetic, audioUrl) {
  audioSection.innerHTML = `
    <div class="audio__section">
      <div>
        <h2 class="word">${word}</h2>
        <p class="fonetik">${phonetic}</p>
      </div>
      <div class="play-button" id="play-audio">
        <span class="uchburchak"></span>
      </div>
    </div>
  `;

  const playAudioBtn = document.querySelector("#play-audio");

  if (audioUrl) {
    playAudioBtn.addEventListener("click", () => {
      const audio = new Audio(audioUrl);
      audio.play();
    });
  } else {
    playAudioBtn.style.display = "none";
  }
}

function displayWordData(data) {
  const word = data.word;

let phonetic = "Fonetik ma'lumot yo'q";
if (data.phonetics.length > 0 && data.phonetics[0].text) {
  phonetic = data.phonetics[0].text;
}

let audioUrl = "";
for (const phoneticData of data.phonetics) {
  if (phoneticData.audio) {
    audioUrl = phoneticData.audio;
    break;
  }
}


  createAudioSection(word, phonetic, audioUrl);
  meaningsSection.innerHTML = "";

  for (let meaning of data.meanings) {
    let meaningHTML = `<h3>${meaning.partOfSpeech}</h3><ul>`;
    for (let def of meaning.definitions) {
      meaningHTML += `<li>${def.definition}</li>`;
    }
    meaningHTML += "</ul>";
    meaningsSection.innerHTML += meaningHTML;
  }
  
  const synonyms = [];
  for (let meaning of data.meanings) {
    if (meaning.synonyms) {
      synonyms.push(...meaning.synonyms);
    }
  }
  if (synonyms.length > 0) {
    meaningsSection.innerHTML += `
      <h3>Synonyms</h3>
      <p class="synonyms">${synonyms.join(", ")}</p>
    `;
  }  
  const link = data.sourceUrls[0] || "Manba mavjud emas";
  sourceLink.innerHTML = link;
  sourceLink.href = link;
}

function errorBlock(message) {
  audioSection.innerHTML = "";
  meaningsSection.innerHTML = "";
  alert(message);
}

searchBtn.addEventListener("click", searchWord);


//=================== Dark Lighgt mode uchun===============

const toggle = document.querySelector('#dark-mode__block');
const body = document.querySelector('body');
let isDark = false;

toggle.addEventListener('click', function() {
    if (isDark) {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(function(all) {
            all.style.color = "black";
            all.style.background = "white";
        });
        isDark = false;
    } else {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(function(all) {
            all.style.color = "white";
            all.style.background = "black";
        });
        isDark = true;
    }
});



//======= font family =================
const fontSelect = document.querySelector('#fontSelect');
fontSelect.addEventListener('change', function () {
  const selectedFont = fontSelect.value;
  document.body.style.fontFamily = selectedFont;
  
  const allElements = document.querySelectorAll('*');
  allElements.forEach(function(all) {
      all.style.fontFamily = fontSelect.value;
  });
});


// loader =================

let loader = document.getElementById("preloader");

window.addEventListener("load", function() {
  loader.style.display = "none";
})