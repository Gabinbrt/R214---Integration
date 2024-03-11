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
    console.log(names);

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

    document.getElementById("ensemble").innerHTML = song_name.join("<br>") + artist_name;
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




