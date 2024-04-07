// URL du fichier json externe
const url = "data.json";

// Utilisation du fetch pour récupérer le fichier JSON
fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur de réseau");
    }
    return response.json();
  })
  .then(data => {
    // extraction des objets
    const names = data.map(item => item.name);
    const images = data.map(item => item.album.images[0].url);
    const artists = data.map(item => item.album.artists[0].name);
    const popularity = data.map(item => item.album.popularity);

    // Utilise innerHTML pour afficher les tableaux dans les éléments div
    //document.getElementById("noms").innerHTML = names.join("<br>");
    //document.getElementById("images").innerHTML = images.join("<br>");
    //document.getElementById("artistes").innerHTML = artists.join("<br>");
    //document.getElementById("popularity").innerHTML = popularity.join("<br>");

    // Utilise un tableau pour stocker les noms et les artistes, puis joins-les à la fin
    var song_name = [];
    var artist_name = "";

    for (i = 0; i < names.length; i++) {
      //console.log(names[i], artists[i]);

      var list_noms = names[i];
      var list_artists = artists[i];

      song_name.push(list_noms);
      artist_name += "<br>" + list_artists;
    }

    //document.getElementById("ensemble").innerHTML = song_name.join("<br>") + artist_name;
  });

const ctx = document.getElementById('myChart');
let myChart;
let jsonData;

fetch("data.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur de réseau");
    }
    return response.json();
  })
  .then(data => {
    //console.log(data);
    jsonData = data;
    createChart(data, "bar");
    setTrackList(data);
    setotherTrackList(data);
  })
  .catch(error => {
    console.error('Erreur de chargement des données JSON', error);
  });

function setChartType(chartType) {
  // Vérifie si le graphique existe avant de le détruire
  if (myChart) {
    myChart.destroy();
  }
  createChart(jsonData, chartType);
}

function createChart(data, type) {
  myChart = new Chart(ctx, {
    type: type,
    data: {
      labels: data.map(item => item.name),
      datasets: [{
        label: 'Popularité',
        data: data.map(item => item.album.popularity),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio : true,
      scales: {
        y: {
          beginAtZero : false,
        }
      },
      layout: {
        padding: {
          bottom: -480  // Réglez cette valeur en fonction de votre besoin pour réduire l'espace vide
        }
      }
    }
  });
}

function setTrackList(data){
  // récupération du template
  let template = document.getElementById('trackCard');

  // parcourir les chansons
  for (let i = 0; i < data.length-39; i++) {
      // faire un clone tu template
      const clone = template.content.cloneNode(true);

      let artists= data[i].artists[0].name;

      //console.log(data[i]);
      //console.log(data[i].album.external_urls.spotify);

      // remplir le clone
      clone.querySelector('.card-title').textContent = data[i].name;
      clone.querySelector('.card-text').textContent = artists;
      clone.querySelector('.card-img-top').src = data[i].album.images[0].url;
      clone.querySelector('.card-img-top').alt = data[i].name;
      clone.querySelector('.btn-primary').href = data[i].album.external_urls.spotify;


      // ajouter le clone au DOM dans le conteneur
      document.getElementById('trackList').appendChild(clone);
  }
}

function setotherTrackList(data){
  // récupération du template
  let template = document.getElementById('trackCard2');

  // parcourir les chansons
  for (let i = data.length - 6; i < data.length; i++) { // Utiliser data.length - 8 comme condition
      // faire un clone tu template
      const clone = template.content.cloneNode(true);

      let artists= data[i].artists[0].name;

      // remplir le clone
      clone.querySelector('.card-title').textContent = data[i].name;
      clone.querySelector('.card-text').textContent = artists;
      clone.querySelector('.card-img-top').src = data[i].album.images[0].url;
      clone.querySelector('.card-img-top').alt = data[i].name;
      clone.querySelector('.btn-primary').href = data[i].album.external_urls.spotify;

      // ajouter le clone au DOM dans le conteneur
      document.getElementById('otherTrackList').appendChild(clone);
  }
}

let currentIndex = 0;
let audioPlayer = document.getElementById('audioPlayer');
let audioSource = document.getElementById('audioSource');
let playPauseBtn = document.getElementById('playPauseBtn');
let prevBtn = document.getElementById('prevBtn');
let nextBtn = document.getElementById('nextBtn');
let trackTitle = document.getElementById('trackTitle');
let trackArtist = document.getElementById('trackArtist');

        // Charger les données JSON
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Commencer la lecture de la première musique
                loadTrack(data, currentIndex);

                // Bouton Play/Pause
                playPauseBtn.addEventListener('click', () => {
                    if (audioPlayer.paused) {
                        audioPlayer.play();
                        playPauseBtn.textContent = 'Pause';
                    } else {
                        audioPlayer.pause();
                        playPauseBtn.textContent = 'Play';
                    }
                });

                // Bouton Précédent
                prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + data.length) % data.length;
                    loadTrack(data, currentIndex);
                });

                // Bouton Suivant
                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % data.length;
                    loadTrack(data, currentIndex);
                });
            })
            .catch(error => console.error('Error fetching data:', error));

        // Charger la musique actuelle
function loadTrack(data, index) {
  if (data[index].preview_url) {
      audioSource.src = data[index].preview_url;
      audioPlayer.load();
      playPauseBtn.textContent = 'Play';
      trackTitle.textContent = data[index].name;
      trackArtist.textContent = data[index].album.artists[0].name;

  } else {
      // Si l'URL de prévisualisation est null, passer à la piste suivante
      currentIndex = (currentIndex + 1) % data.length;
      loadTrack(data, currentIndex);
  }
}

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const carouselIndicators = document.querySelector('.carousel-indicators');
    const carouselInner = document.querySelector('.carousel-inner');
      data.forEach((track, index) => {
        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#carouselExampleCaptions';
        indicator.dataset.bsSlideTo = index;
        indicator.setAttribute('aria-label', `Slide ${index + 1}`);
        if (index === 0) {
          indicator.classList.add('active');
        }
        carouselIndicators.appendChild(indicator);
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (index === 0) {
          carouselItem.classList.add('active');
        }
        const img = document.createElement('img');
        img.src = track.album.images[0].url;
        img.classList.add('d-block', 'w-100');
        const carouselCaption = document.createElement('div');
        carouselCaption.classList.add('carousel-caption', 'd-md-block');
        const title = document.createElement('h5');
        title.textContent = track.name;
        const artist = document.createElement('p');
        artist.textContent = track.album.artists[0].name;
        carouselCaption.appendChild(title);
        carouselCaption.appendChild(artist);
        carouselItem.appendChild(img);
        carouselItem.appendChild(carouselCaption);
        carouselInner.appendChild(carouselItem);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
