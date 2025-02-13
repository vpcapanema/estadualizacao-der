<script>
    function calcularIQI() {
        const pesos = {
            "faixa-dominio": 2, "pavimento": 2, "acostamento": 1.5,
            "sinalizacao-vertical": 1.1, "sinalizacao-horizontal": 1.1, "sistema-drenagem": 1.1,
            "ponte": 5, "viaduto": 5
        };

        let somaPonderada = 0, somaPesos = 0;

        for (let id in pesos) {
            const valor = parseFloat(document.getElementById(id).value) || 0;
            somaPonderada += valor * pesos[id];
            somaPesos += 10 * pesos[id];
        }

        const resultadoIQI = (somaPonderada / somaPesos).toFixed(2);
        document.getElementById("resultado").textContent = resultadoIQI;
    }
</script>
