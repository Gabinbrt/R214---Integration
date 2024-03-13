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

    // affichage des objets contenus dans "album"
    //console.log(names);

    // Utilise innerHTML pour afficher les tableaux dans les éléments div
    //document.getElementById("noms").innerHTML = names.join("<br>");
    //document.getElementById("images").innerHTML = images.join("<br>");
    //document.getElementById("artistes").innerHTML = artists.join("<br>");
    //document.getElementById("popularity").innerHTML = popularity.join("<br>");

    // Utilise un tableau pour stocker les noms et les artistes, puis joins-les à la fin
    var song_name = [];
    var artist_name = "";

    for (i = 0; i < names.length; i++) {
      console.log(names[i], artists[i]);

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
    console.log(data);
    jsonData = data;
    createChart(data, "bar");
    setTrackList(data);
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
        label: 'Popularité par son',
        data: data.map(item => item.album.popularity),
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function setTrackList(data){
  // récupération du template
  let template = document.getElementById('trackCard');

  // parcourir les chansons
  for (let i = 0; i < data.length-40; i++) {
      // faire un clone tu template
      const clone = template.content.cloneNode(true);

      let artists= data[i].artists[0].name;

      console.log(data[i]);
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

/*function setCarousel(data){
  let template = document.getElementById('Carousel')
  for (let i = 0; i < data.length-40; i++) {
    // faire un clone tu template
    const clone = template.content.cloneNode(true);

    let artists= data[i].artists[0].name;

    console.log(data[i]);
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

}


