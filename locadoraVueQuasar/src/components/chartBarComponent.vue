<template>
  <q-page>
    <div class="chart-container">
      <div class="title">Relações de livros</div>
      <canvas id="relacoesLivrosChart"></canvas>
    </div>
  </q-page>
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
const inTime = ref(0);
const delivered = ref(0);
const delayed = ref(0);

const getRents = async () => {
  try {
    await authenticate();
    const response = await api.get('/rent');
    console.log('Resposta da API:', response.data.totalElements);
    rentsQtd.value = response.data.totalElements;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

const getRentsInTime = async () => {
  try {
    await authenticate();
    const response = await api.get('/rent', {
      params: {
        status: 'IN_TIME'
      }
    });
    console.log('Resposta da API:', response.data.totalElements);
    inTime.value = response.data.totalElements;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

const getRentsDelivered = async () => {
  try {
    await authenticate();
    const response = await api.get('/rent', {
      params: {
        status: 'DELIVERED'
      }
    });
    console.log('Resposta da API:', response.data.totalElements);
    delivered.value = response.data.totalElements;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

const getRentsDelayed = async () => {
  try {
    await authenticate();
    const response = await api.get('/rent', {
      params: {
        status: 'DELAYED'
      }
    });
    console.log('Resposta da API:', response.data.totalElements);
    delayed.value = response.data.totalElements;
  } catch (error) {
    showNotification('negative', "Erro ao obter dados!");
    console.error("Erro ao obter dados:", error);
  }
};

onMounted(async () => {
  await getRents();
  await getRentsInTime();
  await getRentsDelivered();
  await getRentsDelayed();

  const ctx = document.getElementById('relacoesLivrosChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Alugados', 'Atrasados', 'Devolvidos no prazo', 'Devolvidos fora do prazo'],
      datasets: [{
        label: 'Relação de livros',
        data: [rentsQtd.value, inTime.value, delivered.value, delayed.value],
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
  box-shadow: 1px 2px 6px 2px rgba(87, 87, 87, 0.51);
  background-color: rgb(255, 255, 255);
  width: 100%;
  min-width: 450px;
  height: 300px;
  text-align: center;
}

.title {
  font-weight: bold;
}

canvas {
  width: 100%;
  height: 50%;
}
</style>
