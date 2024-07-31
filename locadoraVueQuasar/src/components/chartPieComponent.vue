<template>
  <q-page>
    <div class="chart-container">
      <div class="title">Livros mais alugados</div>
      <canvas id="LivrosChart"></canvas>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { api, authenticate } from 'src/boot/axios';

Chart.register(...registerables);

defineOptions({
  name: 'chartPieComponent'
});

const mostRented = ref('');

const getRents = async () => {
  try {
    await authenticate();
    const response = await api.get('/rent/most-rented');
    mostRented.value = response.data;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

onMounted( async () => {
  await getRents();

  const ctx2 = document.getElementById('LivrosChart').getContext('2d');
  new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: [mostRented.value.bookName, 'The Boys', 'Receitas da Vovó'],
      datasets: [{
        label: 'Livros mais alugados',
        data: [mostRented.value.rentedNumber, 1, 2],
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
  box-shadow: 1px 2px 6px 2px rgba(87, 87, 87, 0.51);
  background-color: rgb(255, 255, 255);
  width: 100%;
  min-width: 200px;
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
