<template>
  <div class="sources-container">
    <Card>
      <template #title>
        <div class="p-d-flex p-ai-center p-jc-between">
          <span>
            <i class="pi pi-globe p-mr-2"></i>
            Lista de Fontes de Notícias
          </span>
          <div class="p-d-flex p-ai-center">
            <span class="p-input-icon-left p-mr-3">
              <InputText
                v-model="searchTerm"
                placeholder="Buscar fontes..."
                class="p-inputtext-sm"
              />
            </span>
          </div>
        </div>
      </template>
      <template #content>
        <!-- Loading State -->
        <div v-if="loading" class="p-d-flex p-jc-center p-ai-center p-p-4">
          <ProgressSpinner style="width: 50px; height: 50px" />
          <span class="p-ml-2">Carregando fontes...</span>
        </div>

        <!-- Conteúdo quando não estiver carregando -->
        <div v-else>
          <div class="p-mb-3 p-d-flex p-ai-center p-jc-between">
            <span class="p-text-secondary">
              Mostrando {{ filteredSources.length }} fonte(s)
              <span v-if="!searchTerm">
                (Página {{ currentPage }} de {{ totalPages }})
              </span>
            </span>
            <div class="p-d-flex p-ai-center p-gap-2">
              <span class="p-text-secondary">
                Total: {{ totalItems }} fonte(s)
              </span>
              <div v-if="searchTerm" class="p-d-flex p-ai-center">
                <span class="p-text-secondary p-mr-2">Filtro ativo:</span>
                <Chip
                  :label="searchTerm"
                  icon="pi pi-filter"
                  removable
                  @remove="clearSearch"
                />
              </div>
            </div>
          </div>

          <DataTable
            :value="filteredSources"
            tableStyle="min-width: 50rem"
            :paginator="true"
            :rows="pageSize"
            :first="firstRecordIndex"
            :totalRecords="totalItems"
            responsiveLayout="scroll"
            stripedRows
            :rowsPerPageOptions="[5, 10, 20, 50]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} fontes"
            @page="onPageChange"
          >
            <Column field="id" header="ID" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.id" />
              </template>
            </Column>

            <Column field="name" header="Nome da Fonte" :sortable="true">
              <template #body="slotProps">
                <div class="p-d-flex p-ai-center">
                  <i class="pi pi-newspaper p-mr-2" style="color: #6366f1"></i>
                  <span>{{ slotProps.data.name }}</span>
                </div>
              </template>
            </Column>

            <Column field="href" header="URL" :sortable="true">
              <template #body="slotProps">
                <a
                  :href="slotProps.data.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-text-link"
                >
                  {{ slotProps.data.href }}
                </a>
              </template>
            </Column>

            <Column field="status" header="Status">
              <template #body="slotProps">
                <Tag value="Ativa" severity="success" icon="pi pi-check" />
              </template>
            </Column>

            <Column header="Ações">
              <template #body="slotProps">
                <div class="p-d-flex p-gap-1">
                  <Button
                    icon="pi pi-external-link"
                    class="p-button-rounded p-button-help p-button-text"
                    @click="openWebsite(slotProps.data.href)"
                  />
                </div>
              </template>
            </Column>

            <template #empty>
              <div class="p-d-flex p-jc-center p-ai-center p-p-4">
                <i class="pi pi-search p-mr-2" style="font-size: 2rem"></i>
                <div>
                  <h4>Nenhuma fonte encontrada</h4>
                  <p class="p-text-secondary" v-if="searchTerm">
                    Tente ajustar os termos da busca: "{{ searchTerm }}"
                  </p>
                  <p class="p-text-secondary" v-else>
                    Nenhuma fonte cadastrada no sistema
                  </p>
                </div>
              </div>
            </template>
          </DataTable>

          <!-- Controles de paginação customizados -->
          <div
            v-if="!searchTerm && totalPages > 1"
            class="p-mt-3 p-d-flex p-ai-center p-jc-between"
          >
            <div class="p-text-secondary">
              Página {{ currentPage }} de {{ totalPages }}
            </div>
            <div class="p-d-flex p-gap-2">
              <Button
                icon="pi pi-chevron-left"
                class="p-button-outlined"
                :disabled="currentPage <= 1"
                @click="goToPage(currentPage - 1)"
              />
              <Button
                icon="pi pi-chevron-right"
                class="p-button-outlined"
                :disabled="currentPage >= totalPages"
                @click="goToPage(currentPage + 1)"
              />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Card from "primevue/card";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Chip from "primevue/chip";
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import axios from "axios";

const toast = useToast();
const sources = ref([]);
const searchTerm = ref("");
const loading = ref(false);

// Variáveis de paginação
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);
const firstRecordIndex = ref(0);

// Computed para filtrar fontes (apenas para busca local)
const filteredSources = computed(() => {
  if (!searchTerm.value) {
    return sources.value;
  }

  const term = searchTerm.value.toLowerCase();
  return sources.value.filter(
    (source) =>
      source.name.toLowerCase().includes(term) ||
      source.href.toLowerCase().includes(term)
  );
});

const loadSources = async (page = 1, limit = 10) => {
  loading.value = true;
  try {
    const response = await axios.get(
      "http://10.25.115.57:8000/ingest/sources",
      {
        params: {
          page: page,
          limit: limit,
        },
      }
    );

    // Atualiza os dados com a resposta da API
    sources.value = response.data.result;
    totalItems.value = response.data.total_items;
    totalPages.value = response.data.total_pages;
    currentPage.value = response.data.page;
    pageSize.value = response.data.limit;

    // Calcula o índice do primeiro registro para a paginação
    firstRecordIndex.value = (currentPage.value - 1) * pageSize.value;

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: `Página ${currentPage.value} carregada (${sources.value.length} fontes)`,
      life: 3000,
    });
  } catch (error) {
    console.error("Erro ao carregar fontes:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar as fontes",
      life: 5000,
    });
    sources.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

// Manipula mudança de página no DataTable
const onPageChange = (event) => {
  const newPage = Math.floor(event.first / pageSize.value) + 1;
  if (newPage !== currentPage.value) {
    goToPage(newPage);
  }
};

// Navega para uma página específica
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadSources(page, pageSize.value);
  }
};

const clearSearch = () => {
  searchTerm.value = "";
};

const openWebsite = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

onMounted(() => {
  loadSources(1, 10);
});
</script>

<style scoped>
.sources-container {
  padding: 1rem;
}

:deep(.p-inputtext) {
  width: 300px;
}

:deep(.p-text-link) {
  color: #2196f3;
  text-decoration: none;
  transition: color 0.2s;
}

:deep(.p-text-link:hover) {
  color: #0d47a1;
  text-decoration: underline;
}
</style>
