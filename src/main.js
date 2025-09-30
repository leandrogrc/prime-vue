import { createApp } from "vue";
import "./style.css";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import App from "./App.vue";
import "primeicons/primeicons.css";
import router from "../router";
import ToastService from "primevue/toastservice";

import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Card from "primevue/card";
import Button from "primevue/button";
import Tag from "primevue/tag";
import InputText from "primevue/inputtext";
import Chip from "primevue/chip";
import Toast from "primevue/toast";
import ProgressSpinner from "primevue/progressspinner";

const app = createApp(App);

app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.use(ToastService);

app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Card", Card);
app.component("Button", Button);
app.component("Tag", Tag);
app.component("InputText", InputText);
app.component("Chip", Chip);
app.component("Toast", Toast);
app.component("ProgressSpinner", ProgressSpinner);

app.mount("#app");
