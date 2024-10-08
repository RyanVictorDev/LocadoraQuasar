<template>
  <div>
    <div class="chart-container">
      <div class="title">Relações de livros</div>
      <canvas id="relacoesLivrosChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { api, authenticate } from 'src/boot/axios';

Chart.register(...registerables);

defineOptions({
  name: 'chartBarComponent'
});

const rentsQtd = ref(0);
const late = ref(0);
const delivered = ref(0);
const delayed = ref(0);

const getRents = async () => {
  try {
    const response = await api.get('/dashboard/rentsQuantity');
    rentsQtd.value = response.data;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

const getRentsLate = async () => {
  try {
    const response = await api.get('/dashboard/rentsLateQuantity');
    late.value = response.data;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

const getRentsDelivered = async () => {
  try {
    const response = await api.get('/dashboard/deliveredInTimeQuantity');
    delivered.value = response.data;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

const getRentsDelayed = async () => {
  try {
    const response = await api.get('/dashboard/deliveredWithDelayQuantity');
    delayed.value = response.data;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

onMounted(async () => {
  await getRents();
  await getRentsLate();
  await getRentsDelivered();
  await getRentsDelayed();

  const ctx = document.getElementById('relacoesLivrosChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Alugados', 'Atrasados', 'Devolvidos no prazo', 'Devolvidos fora do prazo'],
      datasets: [{
        label: 'Relação de livros',
        data: [rentsQtd.value, late.value, delivered.value, delayed.value],
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
  #relacoesLivrosChart{
    margin-bottom: 1rem;
  }

.chart-container {
  border-radius: 5px;
  padding: 15px;
  box-shadow: 1px 2px 6px 2px rgba(87, 87, 87, 0.51);
  background-color: rgb(255, 255, 255);
  width: 100%;
  min-width: 450px;
  max-width: fit-content;
  height: 220px;
  text-align: center;
}

.title {
  font-weight: bold;
}

canvas {
  width: 100%;
  height: 50%;
}

@media (max-width: 900px) {
  .chart-container {
    min-width: 80%;
  }
}
</style>
