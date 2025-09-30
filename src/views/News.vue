<template>
  <div class="news-container">
    <Card>
      <template #title>
        <div class="p-d-flex p-ai-center p-jc-between">
          <span>
            <i class="pi pi-newspaper p-mr-2"></i>
            Últimas Notícias
            <span class="p-text-secondary p-ml-2">
              (Total: {{ totalItems }})
            </span>
          </span>
          <Button
            icon="pi pi-refresh"
            label="Atualizar"
            class="p-button-outlined"
            @click="loadNews"
            :loading="loading"
          />
        </div>
      </template>
      <template #content>
        <!-- Loading State -->
        <div v-if="loading" class="p-d-flex p-jc-center p-ai-center p-p-4">
          <ProgressSpinner style="width: 50px; height: 50px" />
          <span class="p-ml-2">Carregando notícias...</span>
        </div>

        <!-- Tabela -->
        <DataTable
          :value="news"
          tableStyle="min-width: 50rem"
          :lazy="true"
          :paginator="true"
          :rows="limit"
          :totalRecords="totalItems"
          :rowsPerPageOptions="[5, 10, 20, 50]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} notícias"
          @page="onPageChange"
          @sort="onSortChange"
          responsiveLayout="scroll"
          stripedRows
        >
          <Column field="id" header="ID" :sortable="true" style="width: '80px'">
            <template #body="slotProps">
              <Tag :value="slotProps.data.id" />
            </template>
          </Column>

          <Column field="title" header="Título" :sortable="true">
            <template #body="slotProps">
              <div class="news-title">
                {{ slotProps.data.title }}
              </div>
            </template>
          </Column>

          <Column
            field="source"
            header="Fonte"
            :sortable="true"
            style="width: '120px'"
          >
            <template #body="slotProps">
              <Tag
                :value="slotProps.data.source"
                :severity="getSourceSeverity(slotProps.data.source)"
              />
            </template>
          </Column>

          <Column header="Ações" style="width: '100px'">
            <template #body="slotProps">
              <Button
                icon="pi pi-external-link"
                class="p-button-rounded p-button-help p-button-text"
                v-tooltip="'Abrir notícia'"
                @click="openNews(slotProps.data.href)"
              />
            </template>
          </Column>

          <template #empty>
            <div class="p-d-flex p-jc-center p-ai-center p-p-4">
              <i class="pi pi-inbox p-mr-2" style="font-size: 2rem"></i>
              <span>Nenhuma notícia encontrada</span>
            </div>
          </template>
        </DataTable>

        <!-- Informações de paginação -->
        <div
          class="p-mt-3 p-d-flex p-ai-center p-jc-between p-text-sm p-text-secondary"
        >
          <span>Página {{ currentPage }} de {{ totalPages }}</span>
          <span>Mostrando {{ news.length }} notícias por página</span>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Card from "primevue/card";
import Button from "primevue/button";
import Tag from "primevue/tag";
import ProgressSpinner from "primevue/progressspinner";
import axios from "axios";

const news = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const limit = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

// Computed properties
const paginationInfo = computed(() => {
  return {
    page: currentPage.value,
    limit: limit.value,
    totalItems: totalItems.value,
    totalPages: totalPages.value,
  };
});

const loadNews = async (page = 1, itemsPerPage = limit.value) => {
  loading.value = true;
  try {
    const response = await axios.get("http://10.25.115.57:8000/ingest/news", {
      params: {
        page: page,
        limit: itemsPerPage,
      },
    });

    const data = response.data;
    news.value = data.result;
    totalItems.value = data.total_items;
    totalPages.value = data.total_pages;
    currentPage.value = data.page;
    limit.value = data.limit;

    console.log("Dados da paginação:", {
      página: data.page,
      limite: data.limit,
      total: data.total_items,
      páginas: data.total_pages,
    });
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
    news.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

const onPageChange = (event) => {
  const newPage = event.page + 1; // PrimeVue usa base 0, sua API usa base 1
  const itemsPerPage = event.rows;

  console.log("Mudando para página:", newPage, "Limite:", itemsPerPage);
  loadNews(newPage, itemsPerPage);
};

const onSortChange = (event) => {
  // Se sua API suportar ordenação, você pode implementar aqui
  console.log("Ordenação alterada:", event);
  // loadNews(currentPage.value, limit.value, event.sortField, event.sortOrder);
};

const getSourceSeverity = (source) => {
  const severities = {
    G1: "info",
    metrópoles: "help",
    CNN: "warning",
    Folha: "success",
  };
  return severities[source] || "secondary";
};

const openNews = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

onMounted(() => {
  loadNews();
});
</script>

<style scoped>
.news-container {
  padding: 1rem;
}

.news-title {
  font-weight: 600;
  line-height: 1.4;
}

:deep(.p-paginator) {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
}

:deep(.p-paginator .p-paginator-pages .p-paginator-page.p-highlight) {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}
</style>
