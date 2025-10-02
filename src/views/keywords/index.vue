<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Header Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-hashtag text-blue-600 text-xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              Gerenciar Palavras-Chave
            </h1>
            <p class="text-gray-600">
              Crie e gerencie suas palavras-chave e hashtags
            </p>
          </div>
        </div>
        <button
          @click="showCreateForm = true"
          class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
        >
          <i class="pi pi-plus"></i>
          Nova Palavra-Chave
        </button>
      </div>
    </div>

    <!-- Create Form Section -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="showCreateForm"
        class="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6"
      >
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <i class="pi pi-plus-circle text-green-600 text-xl"></i>
          <h2 class="text-xl font-semibold text-gray-900">
            Criar Nova Palavra-Chave
          </h2>
        </div>

        <!-- Form -->
        <div class="space-y-6">
          <!-- Keyword Input -->
          <div>
            <label
              for="keyword"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Palavra-Chave <span class="text-red-500">*</span>
            </label>
            <input
              id="keyword"
              v-model="newKeyword.keyword"
              type="text"
              placeholder="Digite a palavra-chave..."
              :class="[
                'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors duration-200 text-gray-900 placeholder-gray-500',
                errors.keyword
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500',
              ]"
            />
            <div
              v-if="errors.keyword"
              class="flex items-center gap-2 mt-2 text-red-600 text-sm"
            >
              <i class="pi pi-exclamation-circle"></i>
              <span>{{ errors.keyword }}</span>
            </div>
          </div>

          <!-- Type Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Tipo <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                @click="newKeyword.is_hashtag = false"
                :class="[
                  'cursor-pointer p-4 border-2 rounded-lg transition-all duration-200',
                  !newKeyword.is_hashtag
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
                ]"
              >
                <div class="flex flex-col items-center gap-2">
                  <div
                    class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="pi pi-tag text-green-600 text-xl"></i>
                  </div>
                  <span class="font-medium text-gray-900">Keyword</span>
                </div>
              </div>
              <div
                @click="newKeyword.is_hashtag = true"
                :class="[
                  'cursor-pointer p-4 border-2 rounded-lg transition-all duration-200',
                  newKeyword.is_hashtag
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100',
                ]"
              >
                <div class="flex flex-col items-center gap-2">
                  <div
                    class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <i class="pi pi-hashtag text-indigo-600 text-xl"></i>
                  </div>
                  <span class="font-medium text-gray-900">Hashtag</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="flex flex-col sm:flex-row gap-3 justify-end mt-6 pt-6 border-t border-gray-200"
        >
          <button
            @click="cancelCreate"
            class="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
          >
            <i class="pi pi-times"></i>
            Cancelar
          </button>
          <button
            @click="createKeyword"
            :disabled="creating"
            class="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <i class="pi pi-check"></i>
            <span v-if="creating">Criando...</span>
            <span v-else>Criar Palavra-Chave</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-list text-blue-600 text-xl"></i>
            <h2 class="text-xl font-semibold text-gray-900">
              Lista de Palavras-Chave
            </h2>
          </div>
          <div class="relative">
            <i
              class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar palavras-chave..."
              class="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 w-full lg:w-80 transition-colors duration-200 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- Loading State -->
        <div
          v-if="loading"
          class="flex flex-col items-center justify-center py-12"
        >
          <div
            class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"
          ></div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            Carregando palavras-chave...
          </h3>
          <p class="text-gray-600">
            Aguarde enquanto buscamos suas palavras-chave
          </p>
        </div>

        <!-- Content -->
        <div v-else>
          <!-- Stats Bar -->
          <div
            class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 pb-6 border-b border-gray-200"
          >
            <div class="flex items-center gap-4 text-sm text-gray-600">
              <div class="flex items-center gap-2">
                <i class="pi pi-filter"></i>
                <span>
                  Mostrando
                  <strong class="text-gray-900">{{ currentItemsCount }}</strong>
                  de <strong class="text-gray-900">{{ totalItems }}</strong>
                  palavra(s)-chave
                </span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i class="pi pi-database"></i>
                <span
                  >Total:
                  <strong class="text-gray-900">{{ totalItems }}</strong>
                  palavra(s)-chave</span
                >
              </div>
              <div
                v-if="searchTerm"
                class="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <i class="pi pi-filter"></i>
                <span>{{ searchTerm }}</span>
                <button @click="clearSearch" class="hover:text-blue-900">
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-hidden rounded-lg border border-gray-200 mb-6">
            <!-- Table Header -->
            <div
              class="bg-gray-50 grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200"
            >
              <div class="col-span-5 font-medium text-gray-900 text-sm">
                <div class="flex items-center gap-2">
                  <i class="pi pi-hashtag text-gray-500"></i>
                  Palavra-Chave
                </div>
              </div>
              <div class="col-span-3 font-medium text-gray-900 text-sm">
                <div class="flex items-center gap-2">
                  <i class="pi pi-tag text-gray-500"></i>
                  Tipo
                </div>
              </div>
              <div class="col-span-2 font-medium text-gray-900 text-sm">
                <div class="flex items-center gap-2">
                  <i class="pi pi-circle-fill text-gray-500 text-xs"></i>
                  Status
                </div>
              </div>
              <div
                class="col-span-2 font-medium text-gray-900 text-sm text-center"
              >
                Ações
              </div>
            </div>

            <!-- Table Body -->
            <div v-if="displayedKeywords.length > 0">
              <div
                v-for="(keyword, index) in displayedKeywords"
                :key="keyword.id"
                :class="[
                  'grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 transition-colors duration-200',
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                  'hover:bg-blue-50',
                ]"
              >
                <!-- Keyword -->
                <div class="col-span-5">
                  <div class="flex items-center gap-3">
                    <i
                      :class="[
                        'text-lg flex-shrink-0',
                        keyword.is_hashtag
                          ? 'pi-hashtag text-indigo-500'
                          : 'pi-tag text-green-500',
                      ]"
                    ></i>
                    <div class="min-w-0 flex-1">
                      <span class="font-medium text-gray-900 block truncate">
                        {{ keyword.keyword }}
                      </span>
                      <span class="text-xs text-gray-500 mt-1 block">
                        ID: {{ keyword.id }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Type -->
                <div class="col-span-3">
                  <div class="flex items-center gap-2">
                    <span
                      :class="[
                        'px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5',
                        keyword.is_hashtag
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-green-50 text-green-700 border border-green-200',
                      ]"
                    >
                      <i
                        :class="keyword.is_hashtag ? 'pi-hashtag' : 'pi-tag'"
                        class="text-xs"
                      ></i>
                      {{ keyword.is_hashtag ? "Hashtag" : "Keyword" }}
                    </span>
                  </div>
                </div>

                <!-- Status -->
                <div class="col-span-2">
                  <span
                    :class="[
                      'px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5',
                      keyword.active
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200',
                    ]"
                  >
                    <i
                      :class="keyword.active ? 'pi pi-check' : 'pi pi-times'"
                      class="text-xs"
                    ></i>
                    {{ keyword.active ? "Ativa" : "Inativa" }}
                  </span>
                </div>

                <!-- Actions -->
                <div class="col-span-2">
                  <div class="flex justify-center">
                    <button
                      @click="editKeyword(keyword)"
                      class="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-300 hover:border-blue-300"
                      title="Editar palavra-chave"
                    >
                      <i class="pi pi-pencil text-sm"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
              <div class="flex flex-col items-center gap-4">
                <i class="pi pi-search text-gray-300 text-6xl"></i>
                <div>
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma palavra-chave encontrada
                  </h3>
                  <p v-if="searchTerm" class="text-gray-600">
                    Tente ajustar os termos da busca: "{{ searchTerm }}"
                  </p>
                  <p v-else class="text-gray-600">
                    Nenhuma palavra-chave cadastrada no sistema
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- PAGINAÇÃO SEMPRE VISÍVEL QUANDO HÁ DADOS -->
          <div
            v-if="displayedKeywords.length > 0"
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-gray-200"
          >
            <div class="flex flex-col sm:flex-row sm:items-center gap-4">
              <!-- Informações da página -->
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i class="pi pi-file"></i>
                <span>
                  Página {{ currentPage }} de {{ totalPages }} - Mostrando
                  {{ currentItemsCount }} de {{ totalItems }} registros
                </span>
              </div>

              <!-- Seletor de Itens por Página -->
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">Itens por página:</span>
                <select
                  v-model="pageSize"
                  @change="onPageSizeChange"
                  class="text-black border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-colors duration-200"
                >
                  <option
                    v-for="size in pageSizeOptions"
                    :key="size"
                    :value="size"
                  >
                    {{ size }}
                  </option>
                </select>
              </div>
            </div>

            <!-- CONTROLES DE PAGINAÇÃO -->
            <div class="flex items-center gap-2">
              <!-- Botão Anterior -->
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage <= 1"
                :class="[
                  'flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 font-medium',
                  currentPage <= 1
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                ]"
              >
                <i class="pi pi-chevron-left"></i>
                <span class="hidden sm:block">Anterior</span>
              </button>

              <!-- Números das Páginas -->
              <div class="flex gap-1">
                <button
                  v-for="page in totalPagesArray"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'w-10 h-10 flex items-center justify-center border rounded-lg transition-colors duration-200 font-medium',
                    page === currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                  ]"
                >
                  {{ page }}
                </button>
              </div>

              <!-- Botão Próximo -->
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage >= totalPages"
                :class="[
                  'flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors duration-200 font-medium',
                  currentPage >= totalPages
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                ]"
              >
                <span class="hidden sm:block">Próxima</span>
                <i class="pi pi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const toast = useToast();
const keywords = ref([]);
const searchTerm = ref("");
const loading = ref(false);
const creating = ref(false);
const showCreateForm = ref(false);

const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);

// Opções para o seletor de itens por página
const pageSizeOptions = [5, 10, 15, 20, 25];

const newKeyword = reactive({
  keyword: "",
  is_hashtag: false,
});

const errors = reactive({
  keyword: "",
});

// Computed para array de páginas (sempre mostra todas as páginas)
const totalPagesArray = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i);
  }
  return pages;
});

// Computed para keywords que devem ser exibidas
const displayedKeywords = computed(() => {
  if (searchTerm.value) {
    // Quando há busca, faz filtro local
    const term = searchTerm.value.toLowerCase();
    return keywords.value.filter((keyword) =>
      keyword.keyword.toLowerCase().includes(term)
    );
  } else {
    // Sem busca, usa os dados da API já paginados
    return keywords.value;
  }
});

// Computed para contar itens atuais
const currentItemsCount = computed(() => {
  return displayedKeywords.value.length;
});

// Handler para mudança no número de itens por página
const onPageSizeChange = () => {
  currentPage.value = 1;
  loadKeywords(currentPage.value, pageSize.value);
};

const createKeyword = async () => {
  if (!newKeyword.keyword.trim()) {
    errors.keyword = "A palavra-chave é obrigatória";
    return;
  }

  creating.value = true;
  try {
    const response = await axios.post(
      "http://10.25.115.57:8000/ingest/keywords",
      {
        keyword: newKeyword.keyword.trim(),
        is_hashtag: newKeyword.is_hashtag,
      }
    );

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Palavra-chave criada com sucesso!",
      life: 5000,
    });

    cancelCreate();
    loadKeywords(currentPage.value, pageSize.value);
  } catch (error) {
    console.error("Erro ao criar palavra-chave:", error);

    let errorMessage = "Não foi possível criar a palavra-chave";
    if (error.response?.data?.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response?.status === 409) {
      errorMessage = "Esta palavra-chave já existe no sistema";
    }

    toast.add({
      severity: "error",
      summary: "Erro",
      detail: errorMessage,
      life: 5000,
    });
  } finally {
    creating.value = false;
  }
};

const cancelCreate = () => {
  showCreateForm.value = false;
  newKeyword.keyword = "";
  newKeyword.is_hashtag = false;
  errors.keyword = "";
};

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

    keywords.value = response.data.result;
    totalItems.value = response.data.total_items;
    totalPages.value = response.data.total_pages;
    currentPage.value = response.data.page;
    pageSize.value = response.data.limit;

    console.log("📊 Dados da paginação:", {
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      totalItems: totalItems.value,
      pageSize: pageSize.value,
      itemsCount: keywords.value.length,
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

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    loadKeywords(page, pageSize.value);
  }
};

const clearSearch = () => {
  searchTerm.value = "";
  loadKeywords(1, pageSize.value);
};

const editKeyword = (keyword) => {
  toast.add({
    severity: "warn",
    summary: "Editar Palavra-Chave",
    detail: `Editando: ${keyword.keyword}`,
    life: 3000,
  });
};

onMounted(() => {
  loadKeywords(1, pageSize.value);
});
</script>
