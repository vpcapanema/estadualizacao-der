// Função para buscar e processar os dados do arquivo Excel hospedado no GitHub
async function fetchExcelData() {
  // URL do arquivo Excel (versão raw)
  const url = 'https://raw.githubusercontent.com/vinicapanema/estadualizacao-der/51befd1f0a126ce45d35c3319590586351e6121f/estadualizacao_numeros.xlsx';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    // Utiliza a primeira planilha do arquivo Excel
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // Converter a planilha para um array de arrays (header: 1)
    // A primeira linha contém os nomes das colunas e a segunda os valores numéricos.
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
    return jsonData;
  } catch (error) {
    console.error('Erro ao buscar ou processar os dados do Excel:', error);
    return [];
  }
}

// Função para renderizar o gráfico utilizando os dados do Excel
async function renderChartFromExcel() {
  const rows = await fetchExcelData();
  if (rows.length < 2) {
    console.error('Nenhum dado encontrado ou estrutura inválida no arquivo Excel.');
    return;
  }
  
  // A primeira linha contém os nomes das colunas; a segunda, os valores
  const headers = rows[0];  
  const values = rows[1].map(val => Number(val));
  
  const ctx = document.getElementById('graficoProcessos').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: headers, // Ex: "Solicitados/protocolados", "Em análise", "Deferidos", "Indeferidos", "Total"
      datasets: [{
        label: 'Número de Processos',
        data: values,
        backgroundColor: ['#005CA9', '#00A859', '#FFC107', '#ED1C24', '#6c757d'],
        borderColor: ['#004080', '#00703C', '#E0A800', '#B31217', '#5a6268'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Quantidade de Processos'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Status do Processo'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
}

// Renderiza o gráfico assim que o DOM for carregado
document.addEventListener('DOMContentLoaded', renderChartFromExcel);
