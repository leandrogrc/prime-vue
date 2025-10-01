<template>
  <div class="sources-container">
    <Card>
      <template #title>
        <div class="p-d-flex p-ai-center p-jc-between">
          <span>
            <i class="pi pi-globe p-mr-2"></i>
            Lista de Notícias
          </span>
          <div class="p-d-flex p-ai-center">
            <span class="p-input-icon-left p-mr-3">
              <InputText
                v-model="searchTerm"
                placeholder="Buscar notícias..."
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
          <span class="p-ml-2">Carregando notícias...</span>
        </div>

        <!-- Conteúdo quando não estiver carregando -->
        <div v-else>
          <div class="p-mb-3 p-d-flex p-ai-center p-jc-between">
            <span class="p-text-secondary">
              {{ filteredSources.length }} notícia(s) encontrada(s) de
              {{ sources.length }}
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

          <DataTable
            :value="filteredSources"
            tableStyle="min-width: 50rem"
            :paginator="true"
            :rows="10"
            responsiveLayout="scroll"
            stripedRows
            :rowsPerPageOptions="[5, 10, 20, 50]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} notícias"
          >
            <Column field="id" header="ID" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.id" />
              </template>
            </Column>

            <Column field="title" header="Título da notícia" :sortable="true">
              <template #body="slotProps">
                <div class="p-d-flex p-ai-center">
                  <i class="pi pi-newspaper p-mr-2" style="color: #6366f1"></i>
                  <span>{{ slotProps.data.title }}</span>
                </div>
              </template>
            </Column>

            <Column field="source" header="URL" :sortable="true">
              <template #body="slotProps">
                <a
                  :source="slotProps.data.source"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="p-text-link"
                >
                  {{ slotProps.data.source }}
                </a>
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
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast"; // Agora deve funcionar
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

// Agora o useToast() deve funcionar corretamente
const toast = useToast();
const sources = ref([]);
const searchTerm = ref("");
const loading = ref(false);

// Computed para filtrar notícias
const filteredSources = computed(() => {
  if (!searchTerm.value) {
    return sources.value;
  }

  const term = searchTerm.value.toLowerCase();
  return sources.value.filter(
    (source) =>
      source.title.toLowerCase().includes(term) ||
      source.href.toLowerCase().includes(term)
  );
});

const loadSources = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://10.25.115.57:8000/ingest/news");

    // Acessa response.data.result conforme a estrutura da sua API
    sources.value = response.data.result;

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: `${sources.value.length} notícias carregadas`,
      life: 3000,
    });
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar as notícias",
      life: 5000,
    });
    sources.value = [];
  } finally {
    loading.value = false;
  }
};

const clearSearch = () => {
  searchTerm.value = "";
};

const viewSource = (source) => {
  toast.add({
    severity: "info",
    summary: "Detalhes da Fonte",
    detail: `Visualizando: ${source.name}`,
    life: 3000,
  });
};

const openWebsite = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

onMounted(() => {
  loadSources();
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
