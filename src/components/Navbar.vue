<template>
  <div class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo e Nome -->
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
          >
            <i class="pi pi-shield text-blue-600 text-xl"></i>
          </div>
          <div>
            <h1 class="text-xl font-semibold text-gray-900">News Monitor</h1>
            <p class="text-sm text-gray-500 hidden sm:block">
              Sistema de Monitoramento
            </p>
          </div>
        </div>

        <!-- Menu de Navegação -->
        <nav class="hidden md:flex items-center space-x-1">
          <button
            v-for="item in items"
            :key="item.label"
            @click="item.command()"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200',
              isActive(item.route)
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <!-- Área do Usuário -->
        <div class="flex items-center gap-3">
          <!-- Informações do Usuário -->
          <div class="hidden sm:flex items-center gap-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <span class="text-white text-sm font-medium">
                {{ userInitials }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">
                {{ userData.name }}
              </p>
              <p class="text-xs text-gray-500">{{ userData.role }}</p>
            </div>
          </div>

          <!-- Botão Logout -->
          <button
            @click="handleLogout"
            class="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-red-200"
            title="Sair do sistema"
          >
            <i class="pi pi-sign-out"></i>
            <span class="hidden sm:block">Sair</span>
          </button>

          <!-- Menu Mobile -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="md:hidden flex items-center justify-center w-10 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <i class="pi pi-bars text-lg"></i>
          </button>
        </div>
      </div>

      <!-- Menu Mobile Expandido -->
      <div
        v-if="showMobileMenu"
        class="md:hidden border-t border-gray-200 py-4"
      >
        <nav class="flex flex-col space-y-2">
          <button
            v-for="item in items"
            :key="item.label"
            @click="handleMobileNav(item)"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors duration-200 text-left',
              isActive(item.route)
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
            ]"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </button>

          <!-- Usuário no Mobile -->
          <div
            class="flex items-center gap-3 px-4 py-3 border-t border-gray-200 mt-2 pt-4"
          >
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
            >
              <span class="text-white text-sm font-medium">
                {{ userInitials }}
              </span>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">
                {{ userData.name }}
              </p>
              <p class="text-xs text-gray-500">{{ userData.role }}</p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
// import { useToast } from "primevue/usetoast";

const router = useRouter();
const route = useRoute();
// const toast = useToast();
const showMobileMenu = ref(false);

// Dados mockados do usuário
const userData = ref({
  name: "Carlos Silva",
  email: "carlos.silva@empresa.com",
  role: "Administrador",
  avatar: null, // Poderia ser uma URL de imagem
});

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    route: "/",
    command: () => {
      router.push("/");
    },
  },
  {
    label: "Fontes",
    icon: "pi pi-globe",
    route: "/fontes",
    command: () => {
      router.push("/fontes");
    },
  },
  {
    label: "Notícias",
    icon: "pi pi-search",
    route: "/noticias",
    command: () => {
      router.push("/noticias");
    },
  },
  {
    label: "Palavras-Chave",
    icon: "pi pi-hashtag",
    route: "/keywords",
    command: () => {
      router.push("/keywords");
    },
  },
]);

// Computed para as iniciais do usuário
const userInitials = computed(() => {
  return userData.value.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
});

const isActive = (routePath) => {
  return route.path === routePath;
};

const handleMobileNav = (item) => {
  item.command();
  showMobileMenu.value = false;
};

const handleLogout = () => {
  // Simulação de logout
  // toast.add({
  //   severity: "info",
  //   summary: "Logout",
  //   detail: "Saindo do sistema...",
  //   life: 3000,
  // });

  // Aqui você implementaria a lógica real de logout
  setTimeout(() => {
    console.log("Usuário deslogado");
    // router.push('/login'); // Redirecionar para login
  }, 1000);
};
</script>

<style scoped>
/* Estilos para garantir boa aparência em todos os dispositivos */
@media (max-width: 768px) {
  .flex.justify-between.items-center {
    flex-wrap: wrap;
  }

  nav {
    width: 100%;
  }
}
</style>
