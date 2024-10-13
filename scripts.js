document.addEventListener('DOMContentLoaded', () => {
    const chartArea = document.getElementById('chart-area');
    const tipoGraficoSelect = document.getElementById('tipoGrafico');
    const labelsInput = document.getElementById('labels');
    const dadosInput = document.getElementById('dados');
    const adicionarGraficoBtn = document.getElementById('adicionarGrafico');
    const salvarGraficoBtn = document.getElementById('salvarGrafico');
    
    let myChart;

    adicionarGraficoBtn.addEventListener('click', () => {
        const tipoGrafico = tipoGraficoSelect.value;
        const labels = labelsInput.value.split(',');
        const data = dadosInput.value.split(',').map(Number);

        if (myChart) {
            myChart.destroy();
        }

        const canvas = document.createElement('canvas');
        chartArea.innerHTML = ''; // Limpa a área do gráfico antes de adicionar o novo
        chartArea.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const backgroundColors = labels.map((_, i) => `rgba(98, 0, 234, ${0.8 - i * 0.1})`);
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Dados Personalizados',
                data: data,
                backgroundColor: backgroundColors,
                borderColor: '#6200ea',
                borderWidth: 2,
                hoverBackgroundColor: '#6200ea',
                hoverBorderColor: '#ffffff'
            }]
        };
        
        const options = {
            responsive: true,
            maintainAspectRatio: false, // Ensure the chart scales properly
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (tipoGrafico === 'pie') {
                                const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(2);
                                return `${context.label}: ${percentage}% (R$ ${context.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`;
                            }
                            return `R$ ${context.raw.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#6200ea',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#6200ea',
                        font: {
                            size: 14
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                }
            }
        };

        myChart = new Chart(ctx, {
            type: tipoGrafico,
            data: chartData,
            options: options
        });

        salvarGraficoBtn.style.display = 'block'; // Mostrar o botão de salvar após gerar o gráfico
    });

    salvarGraficoBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = document.querySelector('#chart-area canvas').toDataURL('image/jpeg');
        link.download = 'grafico.jpg';
        link.click();
    });
});
