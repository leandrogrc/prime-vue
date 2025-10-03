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
            <i class="pi pi-globe text-blue-600 text-xl"></i>
          </div>
          <div>
            <h1 class="text-2xl font-semibold text-gray-900">
              Lista de Notícias
            </h1>
            <p class="text-gray-600">
              Gerencie e visualize todas as notícias coletadas
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div
          class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <i class="pi pi-newspaper text-blue-600 text-xl"></i>
            <h2 class="text-xl font-semibold text-gray-900">
              Todas as Notícias
            </h2>
          </div>
          <div class="relative">
            <i
              class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar notícias..."
              class="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 w-full lg:w-80 transition-colors duration-200 text-gray-900 placeholder-gray-500"
              @input="onSearchInput"
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
            Carregando notícias...
          </h3>
          <p class="text-gray-600">Aguarde enquanto buscamos suas notícias</p>
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
                  notícia(s)
                  <span v-if="searchTerm" class="text-gray-500">
                    (filtro: "{{ searchTerm }}")
                  </span>
                </span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <i class="pi pi-database"></i>
                <span
                  >Total:
                  <strong class="text-gray-900">{{ totalItems }}</strong>
                  notícia(s)</span
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
                  <i class="pi pi-align-left text-gray-500"></i>
                  Título da Notícia
                </div>
              </div>
              <div class="col-span-2 font-medium text-gray-900 text-sm">
                <div class="flex items-center gap-2">
                  <i class="pi pi-building text-gray-500"></i>
                  Fonte
                </div>
              </div>
              <div class="col-span-3 font-medium text-gray-900 text-sm">
                <div class="flex items-center gap-2">
                  <i class="pi pi-link text-gray-500"></i>
                  URL
                </div>
              </div>
              <div
                class="col-span-2 font-medium text-gray-900 text-sm text-center"
              >
                Ações
              </div>
            </div>

            <!-- Table Body -->
            <div v-if="displayedSources.length > 0">
              <div
                v-for="(source, index) in displayedSources"
                :key="source.id"
                :class="[
                  'grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-200 transition-colors duration-200',
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
                  'hover:bg-blue-50',
                ]"
              >
                <!-- Título da Notícia -->
                <div class="col-span-5">
                  <div class="flex items-start gap-3">
                    <div
                      :class="[
                        'w-3 h-3 rounded-full mt-2 flex-shrink-0',
                        getSourceColor(source.source),
                      ]"
                    ></div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <i class="pi pi-newspaper text-indigo-500 text-sm"></i>
                        <span class="font-semibold text-gray-900 line-clamp-2">
                          {{ source.title }}
                        </span>
                      </div>
                      <div
                        class="flex items-center gap-2 text-xs text-gray-500"
                      >
                        <span>ID: {{ source.id }}</span>
                        <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span>{{ formatDate(source.created_at) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Fonte -->
                <div class="col-span-2">
                  <span
                    :class="[
                      'px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 w-fit',
                      getSourceBadgeClass(source.source),
                    ]"
                  >
                    <i
                      :class="getSourceIcon(source.source)"
                      class="text-xs"
                    ></i>
                    {{ source.source }}
                  </span>
                </div>

                <!-- URL -->
                <div class="col-span-3">
                  <div class="flex items-center gap-2">
                    <a
                      :href="source.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200 text-sm truncate flex items-center gap-1"
                      :title="source.href"
                    >
                      <i class="pi pi-external-link text-xs"></i>
                      {{ formatUrl(source.href) }}
                    </a>
                    <span
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        getUrlTypeClass(source.href),
                      ]"
                    >
                      {{ getUrlType(source.href) }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="col-span-2">
                  <div class="flex justify-center gap-1">
                    <button
                      @click="openWebsite(source.href)"
                      class="w-9 h-9 flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
                      title="Abrir notícia"
                    >
                      <i class="pi pi-eye text-sm"></i>
                    </button>
                    <!-- <button
                      @click="shareNews(source)"
                      class="w-9 h-9 flex items-center justify-center text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200 border border-green-200 hover:border-green-300"
                      title="Compartilhar"
                    >
                      <i class="pi pi-share-alt text-sm"></i>
                    </button> -->
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
                    Nenhuma notícia encontrada
                  </h3>
                  <p v-if="searchTerm" class="text-gray-600">
                    Tente ajustar os termos da busca: "{{ searchTerm }}"
                  </p>
                  <p v-else class="text-gray-600">
                    Nenhuma notícia carregada no sistema
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- PAGINAÇÃO SEMPRE VISÍVEL QUANDO HÁ DADOS -->
          <div
            v-if="totalItems > 0"
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
            <div v-if="totalPages > 1" class="flex items-center gap-2">
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
                  v-for="page in visiblePages"
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
                <span
                  v-if="showEllipsis"
                  class="w-10 h-10 flex items-center justify-center text-gray-500"
                >
                  ...
                </span>
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
import { ref, onMounted, computed } from "vue";
// import { useToast } from "primevue/usetoast";
import axios from "axios";

// const toast = useToast();
const sources = ref([]);
const searchTerm = ref("");
const loading = ref(false);

const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(1);

// Opções para o seletor de itens por página
const pageSizeOptions = [5, 10, 15, 20, 25];

// Computed para páginas visíveis (com ellipsis para muitas páginas)
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  // Ajustar start se end estiver no limite
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Computed para mostrar reticências
const showEllipsis = computed(() => {
  return totalPages.value > 5 && currentPage.value < totalPages.value - 2;
});

// Computed para sources que devem ser exibidas
const displayedSources = computed(() => {
  if (searchTerm.value) {
    // Quando há busca, faz filtro local nos dados já carregados
    const term = searchTerm.value.toLowerCase();
    return sources.value.filter(
      (source) =>
        source.title?.toLowerCase().includes(term) ||
        source.text?.toLowerCase().includes(term) ||
        source.source?.toLowerCase().includes(term) ||
        source.href?.toLowerCase().includes(term)
    );
  } else {
    // Sem busca, usa os dados da API já paginados
    return sources.value;
  }
});

// Computed para contar itens atuais
const currentItemsCount = computed(() => {
  if (searchTerm.value) {
    return displayedSources.value.length;
  } else {
    return sources.value.length;
  }
});

// Funções para cores e estilos
const getSourceColor = (source) => {
  const colors = {
    G1: "bg-red-500",
    metrópoles: "bg-purple-500",
    Folha: "bg-orange-500",
    CNN: "bg-red-600",
    Estadão: "bg-blue-500",
    "Seles Nafes": "bg-green-500",
  };
  return colors[source] || "bg-gray-400";
};

const getSourceBadgeClass = (source) => {
  const classes = {
    G1: "bg-red-50 text-red-700 border border-red-200",
    metrópoles: "bg-purple-50 text-purple-700 border border-purple-200",
    Folha: "bg-orange-50 text-orange-700 border border-orange-200",
    CNN: "bg-red-100 text-red-800 border border-red-300",
    Estadão: "bg-blue-50 text-blue-700 border border-blue-200",
    "Seles Nafes": "bg-green-50 text-green-700 border border-green-200",
  };
  return classes[source] || "bg-gray-50 text-gray-700 border border-gray-200";
};

const getSourceIcon = (source) => {
  const icons = {
    G1: "pi pi-globe",
    metrópoles: "pi pi-building",
    Folha: "pi pi-file",
    CNN: "pi pi-video",
    Estadão: "pi pi-flag",
    "Seles Nafes": "pi pi-star",
  };
  return icons[source] || "pi pi-question-circle";
};

const getUrlType = (url) => {
  if (!url) return "Link";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "Vídeo";
  if (url.includes("instagram.com")) return "Instagram";
  if (url.includes("twitter.com") || url.includes("x.com")) return "Twitter";
  if (url.includes("facebook.com")) return "Facebook";
  return "Artigo";
};

const getUrlTypeClass = (url) => {
  const type = getUrlType(url);
  const classes = {
    Vídeo: "bg-red-100 text-red-800",
    Instagram: "bg-pink-100 text-pink-800",
    Twitter: "bg-blue-100 text-blue-800",
    Facebook: "bg-indigo-100 text-indigo-800",
    Artigo: "bg-green-100 text-green-800",
    Link: "bg-gray-100 text-gray-800",
  };
  return classes[type] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateString) => {
  if (!dateString) return "Data não disponível";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  } catch {
    return "Data inválida";
  }
};

// Handler para input de busca com debounce
let searchTimeout = null;
const onSearchInput = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    if (searchTerm.value) {
      // Com busca, usa filtro local - não precisa recarregar da API
      currentPage.value = 1;
    } else {
      // Sem busca, recarrega a página 1 da API
      currentPage.value = 1;
      loadSources();
    }
  }, 500);
};

// Handler para mudança no número de itens por página
const onPageSizeChange = () => {
  currentPage.value = 1; // Volta para a primeira página
  loadSources();
};

const loadSources = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://10.25.115.57:8000/ingest/news", {
      params: {
        page: currentPage.value,
        limit: pageSize.value,
      },
    });

    // Usa a estrutura correta da API: result, page, limit, total_items, total_pages
    sources.value = response.data.result || [];
    totalItems.value = response.data.total_items || 0;
    totalPages.value = response.data.total_pages || 1;
    currentPage.value = response.data.page || 1;
    pageSize.value = response.data.limit || 10;

    console.log("📊 Dados das notícias da API:", {
      currentPage: currentPage.value,
      totalPages: totalPages.value,
      totalItems: totalItems.value,
      pageSize: pageSize.value,
      itemsCount: sources.value.length,
    });
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);
    // toast.add({
    //   severity: "error",
    //   summary: "Erro",
    //   detail: "Não foi possível carregar as notícias",
    //   life: 5000,
    // });
    sources.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
    currentPage.value = 1;
  } finally {
    loading.value = false;
  }
};

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && !searchTerm.value) {
    currentPage.value = page;
    loadSources();
  }
};

const clearSearch = () => {
  searchTerm.value = "";
  currentPage.value = 1;
  loadSources();
};

const formatUrl = (url) => {
  if (!url) return "";
  try {
    const urlObj = new URL(url);
    return urlObj.hostname + (urlObj.pathname !== "/" ? urlObj.pathname : "");
  } catch {
    return url.length > 50 ? url.substring(0, 50) + "..." : url;
  }
};

const openWebsite = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const shareNews = (news) => {
  // Simulação de compartilhamento
  // toast.add({
  //   severity: "info",
  //   summary: "Compartilhar",
  //   detail: `Compartilhando: ${news.title}`,
  //   life: 3000,
  // });
};

onMounted(() => {
  loadSources();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
