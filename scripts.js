// Configuração do Mapa (Leaflet.js)
const mapa = L.map('mapa').setView([-23.5505, -46.6333], 10); // Coordenadas de São Paulo

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(mapa);

// Adicionar um marcador
L.marker([-23.5505, -46.6333]).addTo(mapa)
  .bindPopup('Exemplo de marcador no mapa.')
  .openPopup();

// Configuração do Gráfico (Chart.js)
const ctx = document.getElementById('graficoIndicadores').getContext('2d');
const graficoIndicadores = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Ambiental', 'Socioeconômico', 'Técnico'],
    datasets: [{
      label: 'Pontuação dos Indicadores',
      data: [80, 60, 90],
      backgroundColor: ['#007bff', '#28a745', '#dc3545']
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});