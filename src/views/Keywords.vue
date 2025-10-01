<template>
  <div class="keywords-container">
    <Card>
      <template #title>
        <div class="p-d-flex p-ai-center p-jc-between">
          <span>
            <i class="pi pi-hashtag p-mr-2"></i>
            Lista de Palavras-Chave
          </span>
          <div class="p-d-flex p-ai-center">
            <span class="p-input-icon-left p-mr-3">
              <i class="pi pi-search" />
              <InputText
                v-model="searchTerm"
                placeholder="Buscar keywords..."
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
          <span class="p-ml-2">Carregando palavras-chave...</span>
        </div>

        <!-- Conteúdo quando não estiver carregando -->
        <div v-else>
          <div class="p-mb-3 p-d-flex p-ai-center p-jc-between">
            <span class="p-text-secondary">
              Mostrando {{ filteredKeywords.length }} palavra(s)-chave
              <span v-if="!searchTerm">
                (Página {{ currentPage }} de {{ totalPages }})
              </span>
            </span>
            <div class="p-d-flex p-ai-center p-gap-2">
              <span class="p-text-secondary">
                Total: {{ totalItems }} palavra(s)-chave
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
            :value="filteredKeywords"
            tableStyle="min-width: 50rem"
            :paginator="true"
            :rows="pageSize"
            :first="firstRecordIndex"
            :totalRecords="searchTerm ? filteredKeywords.length : totalItems"
            responsiveLayout="scroll"
            stripedRows
            :rowsPerPageOptions="[5, 10, 20, 50]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} palavras-chave"
            @page="onPageChange"
          >
            <Column field="id" header="ID" :sortable="true">
              <template #body="slotProps">
                <Tag :value="slotProps.data.id" />
              </template>
            </Column>

            <Column field="keyword" header="Palavra-Chave" :sortable="true">
              <template #body="slotProps">
                <div class="p-d-flex p-ai-center">
                  <i
                    class="pi p-mr-2"
                    :class="slotProps.data.is_hashtag ? 'pi-hashtag' : 'pi-tag'"
                    :style="
                      slotProps.data.is_hashtag
                        ? 'color: #6366f1'
                        : 'color: #10b981'
                    "
                  ></i>
                  <span>{{ slotProps.data.keyword }}</span>
                </div>
              </template>
            </Column>

            <Column field="is_hashtag" header="Tipo" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.is_hashtag ? 'Hashtag' : 'Keyword'"
                  :severity="slotProps.data.is_hashtag ? 'info' : 'help'"
                  :icon="
                    slotProps.data.is_hashtag ? 'pi pi-hashtag' : 'pi pi-tag'
                  "
                />
              </template>
            </Column>

            <Column field="active" header="Status" :sortable="true">
              <template #body="slotProps">
                <Tag
                  :value="slotProps.data.active ? 'Ativa' : 'Inativa'"
                  :severity="slotProps.data.active ? 'success' : 'danger'"
                  :icon="slotProps.data.active ? 'pi pi-check' : 'pi pi-times'"
                />
              </template>
            </Column>

            <Column header="Ações">
              <template #body="slotProps">
                <div class="p-d-flex p-gap-1">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-warning p-button-text"
                    @click="editKeyword(slotProps.data)"
                  />
                </div>
              </template>
            </Column>

            <template #empty>
              <div class="p-d-flex p-jc-center p-ai-center p-p-4">
                <i class="pi pi-search p-mr-2" style="font-size: 2rem"></i>
                <div>
                  <h4>Nenhuma palavra-chave encontrada</h4>
                  <p class="p-text-secondary" v-if="searchTerm">
                    Tente ajustar os termos da busca: "{{ searchTerm }}"
                  </p>
                  <p class="p-text-secondary" v-else>
                    Nenhuma palavra-chave cadastrada no sistema
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
                v-tooltip.top="'Página anterior'"
              />
              <Button
                icon="pi pi-chevron-right"
                class="p-button-outlined"
                :disabled="currentPage >= totalPages"
                @click="goToPage(currentPage + 1)"
                v-tooltip.top="'Próxima página'"
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
import Tooltip from "primevue/tooltip";
import axios from "axios";

const toast = useToast();
const keywords = ref([]);
const searchTerm = ref("");
const loading = ref(false);

// Variáveis de paginação
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);
const firstRecordIndex = ref(0);

// Computed para filtrar keywords (apenas para busca local)
const filteredKeywords = computed(() => {
  if (!searchTerm.value) {
    return keywords.value;
  }

  const term = searchTerm.value.toLowerCase();
  return keywords.value.filter((keyword) =>
    keyword.keyword.toLowerCase().includes(term)
  );
});

const loadKeywords = async (page = 1, limit = 10) => {
  loading.value = true;
  try {
    const response = await axios.get(
      "http://10.25.115.57:8000/ingest/keywords",
      {
        params: {
          page: page,
          limit: limit,
        },
      }
    );

    // Atualiza os dados com a resposta da API
    keywords.value = response.data.result;
    totalItems.value = response.data.total_items;
    totalPages.value = response.data.total_pages;
    currentPage.value = response.data.page;
    pageSize.value = response.data.limit;

    // Calcula o índice do primeiro registro para a paginação
    firstRecordIndex.value = (currentPage.value - 1) * pageSize.value;

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: `Página ${currentPage.value} carregada (${keywords.value.length} palavras-chave)`,
      life: 3000,
    });
  } catch (error) {
    console.error("Erro ao carregar palavras-chave:", error);
    toast.add({
      severity: "error",
      summary: "Erro",
      detail: "Não foi possível carregar as palavras-chave",
      life: 5000,
    });
    keywords.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

// Manipula mudança de página no DataTable
const onPageChange = (event) => {
  if (!searchTerm.value) {
    const newPage = Math.floor(event.first / pageSize.value) + 1;
    if (newPage !== currentPage.value) {
      goToPage(newPage);
    }
  }
};

// Navega para uma página específica
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && !searchTerm.value) {
    loadKeywords(page, pageSize.value);
  }
};

const clearSearch = () => {
  searchTerm.value = "";
};

const viewKeyword = (keyword) => {
  toast.add({
    severity: "info",
    summary: "Detalhes da Palavra-Chave",
    detail: `Keyword: ${keyword.keyword} | Tipo: ${
      keyword.is_hashtag ? "Hashtag" : "Keyword"
    } | Status: ${keyword.active ? "Ativa" : "Inativa"}`,
    life: 4000,
  });
};

const editKeyword = (keyword) => {
  toast.add({
    severity: "warn",
    summary: "Editar Palavra-Chave",
    detail: `Editando: ${keyword.keyword}`,
    life: 3000,
  });
  // Aqui você pode implementar a lógica de edição
};

onMounted(() => {
  loadKeywords(1, 10);
});
</script>

<style scoped>
.keywords-container {
  padding: 1rem;
}

:deep(.p-inputtext) {
  width: 300px;
}

:deep(.p-datatable) {
  font-size: 0.9rem;
}

:deep(.p-column-header-content) {
  font-weight: 600;
}
</style>
