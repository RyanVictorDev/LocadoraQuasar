<template>
  <q-page padding>
    <div class="chart-container">
      <div class="title">Relações de livros</div>
      <canvas id="relacoesLivrosChart"></canvas>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

defineOptions({
  name: 'chartBarComponent'
});

onMounted(() => {
  const ctx = document.getElementById('relacoesLivrosChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Alugados', 'Atrasados', 'Devolvidos no prazo', 'Devolvidos fora do prazo'],
      datasets: [{
        label: 'Relação de livros',
        data: [400, 500, 184, 395],
        backgroundColor: ['#509358', '#B22222', '#46769A', '#C65F15'],
        borderWidth: 0,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
</script>

<style scoped>
.chart-container {
  border-radius: 5px;
  padding: 15px;
  background-color: rgb(231, 231, 231);
  width: 100%;
  max-width: 450px;
  height: 300px;
  /* margin: 0 auto; */
  text-align: center;
}

.title {
  margin-bottom: 10px;
  font-weight: bold;
}

canvas {
  width: 100%;
  height: 50%;
}
</style>
