<template>
  <q-page padding>
    <div class="chart-container">
      <div class="title">Livros mais alugados</div>
      <canvas id="LivrosChart"></canvas>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

defineOptions({
  name: 'chartPieComponent'
});

onMounted(() => {
  const ctx2 = document.getElementById('LivrosChart').getContext('2d');
  new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: ['Harry Potter', 'The Boys', 'Receitas da Vovó'],
      datasets: [{
        label: 'Livros mais alugados',
        data: [999, 400, 297],
        backgroundColor: ['#509358', '#B22222', '#46769A'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
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
  margin-bottom: 1px;
  font-weight: bold;
}

canvas {
  width: 100%;
  height: 50%;
}
</style>
