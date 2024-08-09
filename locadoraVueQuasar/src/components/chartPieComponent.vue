<template>
  <div>
    <div class="chart-container">
      <div class="title">Livros mais alugados</div>
      <canvas id="LivrosChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { api, authenticate } from 'src/boot/axios';

const $q = useQuasar();

const showNotification = (type, msg) => {
  $q.notify({
    type: type,
    message: msg,
    position: 'bottom-right',
    timeout: 3000
  });
};

Chart.register(...registerables);

defineOptions({
  name: 'chartPieComponent'
});

const mostRented1 = ref('');
const mostRented2 = ref('');
const mostRented3 = ref('');


const getRents1 = async () => {
  try {
    await authenticate();
    const response = await api.get('/rent/most-rented/1');
    mostRented1.value = response.data;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

const getRents2 = async () => {
  try {
    await authenticate();
    const response = await api.get('/rent/most-rented/2');
    mostRented2.value = response.data;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

const getRents3 = async () => {
  try {
    await authenticate();
    const response = await api.get('/rent/most-rented/3');
    mostRented3.value = response.data;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

onMounted( async () => {
  await getRents1();
  await getRents2();
  await getRents3();


  const ctx2 = document.getElementById('LivrosChart').getContext('2d');
  new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: [mostRented1.value.bookName, mostRented2.value.bookName, mostRented3.value.bookName],
      datasets: [{
        label: 'Livros mais alugados',
        data: [mostRented1.value.rentedNumber, mostRented2.value.rentedNumber, mostRented3.value.rentedNumber],
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

#LivrosChart{
  margin-bottom: 1rem;
}

.chart-container {
  border-radius: 5px;
  padding: 15px;
  box-shadow: 1px 2px 6px 2px rgba(87, 87, 87, 0.51);
  background-color: rgb(255, 255, 255);
  width: 100%;
  min-width: 500px;
  max-width: fit-content;
  height: 220px;
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

@media (max-width: 900px) {
  .chart-container {
    min-width: 80%;
  }
}
</style>
