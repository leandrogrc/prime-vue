<template>
  <div class="card">
    <Menubar :model="items" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Menubar from "primevue/menubar";

const router = useRouter();

const items = ref([
  {
    label: "Home",
    icon: "pi pi-home",
    command: () => {
      router.push("/");
    },
  },
  {
    label: "Fontes",
    icon: "pi pi-file-o",
    command: () => {
      router.push("/fontes");
    },
  },
  {
    label: "Notícias",
    icon: "pi pi-search",
    command: () => {
      router.push("/noticias");
    },
  },
  {
    label: "Keywords",
    icon: "pi pi-hashtag",
    command: () => {
      router.push("/keywords");
    },
  },
]);
</script>
