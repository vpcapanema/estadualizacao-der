// Calculadora IQI - Índice de Qualidade da Infraestrutura

// Pesos dos critérios para cálculo do IQI
const pesosCriterios = {
    larguraPista: 0.20,      // 20%
    tipoPavimento: 0.25,     // 25%
    estadoPavimento: 0.25,   // 25%
    vdm: 0.15,              // 15%
    drenagem: 0.10,         // 10%
    sinalizacao: 0.05       // 5%
};

// Pontuações para diferentes valores dos critérios
const pontuacoes = {
    tipoPavimento: {
        'asfalto': 10,
        'concreto': 9,
        'paralelepipedo': 6,
        'terra': 3
    },
    estadoPavimento: {
        'otimo': 10,
        'bom': 8,
        'regular': 6,
        'ruim': 4,
        'pessimo': 2
    },
    drenagem: {
        'adequado': 10,
        'parcial': 7,
        'inadequado': 4,
        'inexistente': 1
    },
    sinalizacao: {
        'completa': 10,
        'parcial': 7,
        'deficiente': 4,
        'inexistente': 1
    }
};

function calcularIQI() {
    const form = document.getElementById('iqi-form');
    const formData = new FormData(form);
    
    // Obter valores do formulário
    const larguraPista = parseFloat(formData.get('largura-pista')) || 0;
    const tipoPavimento = formData.get('tipo-pavimento');
    const estadoPavimento = formData.get('estado-pavimento');
    const vdm = parseFloat(formData.get('vdm')) || 0;
    const drenagem = formData.get('drenagem');
    const sinalizacao = formData.get('sinalizacao');
    
    // Calcular pontuações individuais
    let pontuacaoLargura = Math.min(10, (larguraPista / 7) * 10); // Normalizar para pista ideal de 7m
    let pontuacaoTipo = pontuacoes.tipoPavimento[tipoPavimento] || 0;
    let pontuacaoEstado = pontuacoes.estadoPavimento[estadoPavimento] || 0;
    let pontuacaoVDM = Math.min(10, (vdm / 5000) * 10); // Normalizar para VDM de 5000 veículos/dia
    let pontuacaoDrenagem = pontuacoes.drenagem[drenagem] || 0;
    let pontuacaoSinalizacao = pontuacoes.sinalizacao[sinalizacao] || 0;
    
    // Calcular IQI ponderado
    const iqi = (
        pontuacaoLargura * pesosCriterios.larguraPista +
        pontuacaoTipo * pesosCriterios.tipoPavimento +
        pontuacaoEstado * pesosCriterios.estadoPavimento +
        pontuacaoVDM * pesosCriterios.vdm +
        pontuacaoDrenagem * pesosCriterios.drenagem +
        pontuacaoSinalizacao * pesosCriterios.sinalizacao
    );
    
    // Determinar classificação
    let classificacao, corClassificacao;
    if (iqi >= 8.5) {
        classificacao = 'Excelente';
        corClassificacao = 'text-success';
    } else if (iqi >= 7.0) {
        classificacao = 'Bom';
        corClassificacao = 'text-primary';
    } else if (iqi >= 5.5) {
        classificacao = 'Regular';
        corClassificacao = 'text-warning';
    } else if (iqi >= 4.0) {
        classificacao = 'Ruim';
        corClassificacao = 'text-danger';
    } else {
        classificacao = 'Péssimo';
        corClassificacao = 'text-dark';
    }
    
    // Exibir resultado
    document.getElementById('iqi-valor').textContent = iqi.toFixed(2);
    document.getElementById('iqi-classificacao').textContent = classificacao;
    document.getElementById('iqi-classificacao').className = `fw-bold ${corClassificacao}`;
    
    // Exibir detalhamento
    const detalhamento = document.getElementById('criterios-detalhamento');
    detalhamento.innerHTML = `
        <div class="row g-2">
            <div class="col-md-6">
                <small><strong>Largura da Pista:</strong> ${pontuacaoLargura.toFixed(1)}/10</small>
            </div>
            <div class="col-md-6">
                <small><strong>Tipo de Pavimento:</strong> ${pontuacaoTipo}/10</small>
            </div>
            <div class="col-md-6">
                <small><strong>Estado do Pavimento:</strong> ${pontuacaoEstado}/10</small>
            </div>
            <div class="col-md-6">
                <small><strong>Volume de Tráfego:</strong> ${pontuacaoVDM.toFixed(1)}/10</small>
            </div>
            <div class="col-md-6">
                <small><strong>Sistema de Drenagem:</strong> ${pontuacaoDrenagem}/10</small>
            </div>
            <div class="col-md-6">
                <small><strong>Sinalização:</strong> ${pontuacaoSinalizacao}/10</small>
            </div>
        </div>
    `;
    
    // Mostrar resultado e habilitar botão de exportar
    document.getElementById('resultado').style.display = 'block';
    document.getElementById('export-pdf').disabled = false;
}

function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const nomeRodovia = document.getElementById('rodovia-nome').value;
    const extensao = document.getElementById('extensao').value;
    const iqi = document.getElementById('iqi-valor').textContent;
    const classificacao = document.getElementById('iqi-classificacao').textContent;
    
    doc.setFontSize(16);
    doc.text('Relatório de Cálculo IQI', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Rodovia: ${nomeRodovia}`, 20, 40);
    doc.text(`Extensão: ${extensao} km`, 20, 50);
    doc.text(`IQI Calculado: ${iqi}`, 20, 60);
    doc.text(`Classificação: ${classificacao}`, 20, 70);
    
    doc.text('Data do Relatório: ' + new Date().toLocaleDateString('pt-BR'), 20, 90);
    
    doc.save(`relatorio_iqi_${nomeRodovia.replace(/\s+/g, '_')}.pdf`);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('iqi-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calcularIQI();
    });
    
    document.getElementById('export-pdf').addEventListener('click', exportarPDF);
});
