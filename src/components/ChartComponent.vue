<script setup>
import { onMounted, onUnmounted, ref, computed } from "vue";
import Chart from "chart.js/auto";

const data = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
  { year: 2017, count: 35 },
  { year: 2018, count: 40 },
  { year: 2019, count: 32 },
  { year: 2020, count: 45 },
];

const chartRef = ref(null);
let chartInstance = null;

// Filtros
const yearRange = ref([2010, 2020]);

// Dados filtrados
const filteredData = computed(() => {
  return data.filter(
    (item) => item.year >= yearRange.value[0] && item.year <= yearRange.value[1]
  );
});

// Anos disponíveis
const availableYears = computed(() => {
  const years = data.map((item) => item.year);
  return {
    min: Math.min(...years),
    max: Math.max(...years),
  };
});

// Atualizar gráfico
const updateChart = () => {
  if (chartInstance) {
    chartInstance.data.labels = filteredData.value.map((row) => row.year);
    chartInstance.data.datasets[0].data = filteredData.value.map(
      (row) => row.count
    );
    chartInstance.update();
  }
};

// Inicializar gráfico
onMounted(() => {
  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: "bar",
      data: {
        labels: filteredData.value.map((row) => row.year),
        datasets: [
          {
            label: "Acquisitions by year",
            data: filteredData.value.map((row) => row.count),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});
</script>

<template>
  <div class="chart-container">
    <div class="filters">
      <div class="range-filter">
        <label>Filtrar por ano: {{ yearRange[0] }} - {{ yearRange[1] }}</label>
        <div class="range-slider">
          <input
            type="range"
            :min="availableYears.min"
            :max="availableYears.max"
            v-model="yearRange[0]"
            @input="updateChart"
            class="slider"
          />
          <input
            type="range"
            :min="availableYears.min"
            :max="availableYears.max"
            v-model="yearRange[1]"
            @input="updateChart"
            class="slider"
          />
        </div>
        <div class="range-labels">
          <span>{{ availableYears.min }}</span>
          <span>{{ availableYears.max }}</span>
        </div>
      </div>
    </div>

    <div class="chart-wrapper">
      <canvas ref="chartRef"></canvas>
    </div>

    <div class="info">
      <p>
        Mostrando {{ filteredData.length }} anos ({{ yearRange[0] }} -
        {{ yearRange[1] }})
      </p>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.range-filter label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.range-slider {
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
}

.slider {
  flex: 1;
  height: 5px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
}

.range-labels {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 12px;
}

.chart-wrapper {
  position: relative;
  height: 400px;
  width: 100%;
  margin-bottom: 20px;
}

.info {
  text-align: center;
  color: #666;
  font-style: italic;
}
</style>
