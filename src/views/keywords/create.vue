<template>
  <div class="keywords-create-container">
    <!-- Card Principal -->
    <div class="card">
      <!-- Header do Card -->
      <div class="card-header">
        <div class="header-content">
          <div class="title-section">
            <i class="icon pi-plus"></i>
            <h2>Criar Nova Palavra-Chave</h2>
          </div>
          <button class="back-button" @click="$emit('back-to-list')">
            <i class="icon pi-arrow-left"></i>
            Voltar para Lista
          </button>
        </div>
      </div>

      <!-- Conteúdo do Card -->
      <div class="card-content">
        <form @submit.prevent="submitForm" class="form">
          <!-- Campo Palavra-Chave -->
          <div class="form-group">
            <label for="keyword" class="form-label">
              Palavra-Chave <span class="required">*</span>
            </label>
            <input
              id="keyword"
              v-model="form.keyword"
              type="text"
              placeholder="Digite a palavra-chave..."
              class="form-input"
              :class="{ 'input-error': errors.keyword }"
              @input="clearError('keyword')"
            />
            <div v-if="errors.keyword" class="error-message">
              <i class="icon pi-exclamation-circle"></i>
              {{ errors.keyword }}
            </div>
          </div>

          <!-- Campo Tipo -->
          <div class="form-group">
            <label class="form-label">
              Tipo <span class="required">*</span>
            </label>
            <div class="type-selector">
              <label
                class="type-option"
                :class="{ 'type-selected': !form.is_hashtag }"
              >
                <input
                  type="radio"
                  v-model="form.is_hashtag"
                  :value="false"
                  class="radio-input"
                  @change="clearError('is_hashtag')"
                />
                <div class="type-content">
                  <i class="icon pi-tag type-icon keyword-icon"></i>
                  <span class="type-label">Keyword</span>
                </div>
              </label>

              <label
                class="type-option"
                :class="{ 'type-selected': form.is_hashtag }"
              >
                <input
                  type="radio"
                  v-model="form.is_hashtag"
                  :value="true"
                  class="radio-input"
                  @change="clearError('is_hashtag')"
                />
                <div class="type-content">
                  <i class="icon pi-hashtag type-icon hashtag-icon"></i>
                  <span class="type-label">Hashtag</span>
                </div>
              </label>
            </div>
            <div v-if="errors.is_hashtag" class="error-message">
              <i class="icon pi-exclamation-circle"></i>
              {{ errors.is_hashtag }}
            </div>
          </div>

          <!-- Campo Status -->
          <div class="form-group">
            <label class="checkbox-container">
              <input
                type="checkbox"
                v-model="form.active"
                class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-label">Palavra-chave ativa</span>
            </label>
            <div class="helper-text">
              Se desmarcado, a palavra-chave não será utilizada nas buscas
            </div>
          </div>
        </form>

        <!-- Preview -->
        <div v-if="form.keyword" class="preview-section">
          <h4 class="preview-title">
            <i class="icon pi-eye"></i>
            Pré-visualização:
          </h4>
          <div class="preview-content">
            <div class="preview-main">
              <i
                class="preview-icon"
                :class="form.is_hashtag ? 'pi-hashtag' : 'pi-tag'"
              ></i>
              <span class="preview-text">{{ form.keyword }}</span>
            </div>
            <div class="preview-tags">
              <span
                class="tag type-tag"
                :class="form.is_hashtag ? 'hashtag-tag' : 'keyword-tag'"
              >
                {{ form.is_hashtag ? "Hashtag" : "Keyword" }}
              </span>
              <span
                class="tag status-tag"
                :class="form.active ? 'status-active' : 'status-inactive'"
              >
                {{ form.active ? "Ativa" : "Inativa" }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer do Card -->
      <div class="card-footer">
        <div class="form-actions">
          <button
            type="button"
            class="button button-secondary"
            @click="$emit('back-to-list')"
          >
            <i class="icon pi-times"></i>
            Cancelar
          </button>
          <button
            type="submit"
            class="button button-primary"
            :disabled="loading"
            @click="submitForm"
          >
            <i class="icon pi-check"></i>
            <span v-if="loading">Criando...</span>
            <span v-else>Criar Palavra-Chave</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useToast } from "primevue/usetoast";
import axios from "axios";

const toast = useToast();
const loading = ref(false);

// Emit events
const emit = defineEmits(["back-to-list", "keyword-created"]);

// Form data
const form = reactive({
  keyword: "",
  is_hashtag: false,
  active: true,
});

// Validation errors
const errors = reactive({
  keyword: "",
  is_hashtag: "",
});

// Clear error
const clearError = (field) => {
  errors[field] = "";
};

// Form validation
const validateForm = () => {
  let isValid = true;

  // Reset errors
  errors.keyword = "";
  errors.is_hashtag = "";

  // Validate keyword
  if (!form.keyword.trim()) {
    errors.keyword = "A palavra-chave é obrigatória";
    isValid = false;
  } else if (form.keyword.trim().length < 2) {
    errors.keyword = "A palavra-chave deve ter pelo menos 2 caracteres";
    isValid = false;
  }

  return isValid;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const response = await axios.post(
      "http://10.25.115.57:8000/ingest/keywords",
      {
        keyword: form.keyword.trim(),
        is_hashtag: form.is_hashtag,
      }
    );

    toast.add({
      severity: "success",
      summary: "Sucesso",
      detail: "Palavra-chave criada com sucesso!",
      life: 5000,
    });

    // Reset form
    form.keyword = "";
    form.is_hashtag = false;
    form.active = true;

    // Emit event to parent
    emit("keyword-created");
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
    loading.value = false;
  }
};
</script>

<style scoped>
/* Container Principal */
.keywords-create-container {
  padding: 1.5rem;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* Card */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
}

/* Header do Card */
.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.title-section h2 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
}

/* Ícones */
.icon {
  font-style: normal;
  font-family: "PrimeIcons" !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
}

.pi-plus:before {
  content: "\e95c";
}
.pi-arrow-left:before {
  content: "\e928";
}
.pi-times:before {
  content: "\e90b";
}
.pi-check:before {
  content: "\e90c";
}
.pi-exclamation-circle:before {
  content: "\e922";
}
.pi-tag:before {
  content: "\e938";
}
.pi-hashtag:before {
  content: "\e94c";
}
.pi-eye:before {
  content: "\e925";
}

/* Botão Voltar */
.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
}

/* Conteúdo do Card */
.card-content {
  padding: 1.5rem;
}

/* Formulário */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #374151;
  font-weight: 500;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
}

/* Input Text */
.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  color: #374151;
  background: #ffffff;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.input-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Type Selector */
.type-selector {
  display: flex;
  gap: 1rem;
}

.type-option {
  flex: 1;
  cursor: pointer;
}

.radio-input {
  display: none;
}

.type-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  transition: all 0.2s ease;
}

.type-option:hover .type-content {
  border-color: #3b82f6;
  background: #ffffff;
}

.type-selected .type-content {
  border-color: #3b82f6 !important;
  background: #eff6ff !important;
}

.type-icon {
  font-size: 1.5rem;
  padding: 0.75rem;
  border-radius: 8px;
}

.keyword-icon {
  color: #10b981;
  background: #ecfdf5;
}

.hashtag-icon {
  color: #6366f1;
  background: #eef2ff;
}

.type-label {
  color: #374151;
  font-weight: 500;
}

/* Checkbox */
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: #ffffff;
  position: relative;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-input:checked + .checkbox-custom:after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
}

.checkbox-label {
  color: #374151;
  font-weight: 500;
}

.helper-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Error Message */
.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Preview Section */
.preview-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.preview-title {
  color: #374151;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-main {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.preview-icon {
  font-size: 1.5rem;
}

.preview-icon.pi-tag {
  color: #10b981;
}

.preview-icon.pi-hashtag {
  color: #6366f1;
}

.preview-text {
  color: #1e293b;
  font-weight: 600;
  font-size: 1.125rem;
}

.preview-tags {
  display: flex;
  gap: 0.5rem;
}

/* Tags */
.tag {
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  border: none;
}

.type-tag.keyword-tag {
  background: #ecfdf5;
  color: #065f46;
}

.type-tag.hashtag-tag {
  background: #eef2ff;
  color: #3730a3;
}

.status-tag.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-tag.status-inactive {
  background: #fef2f2;
  color: #991b1b;
}

/* Footer do Card */
.card-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* Botões */
.button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-secondary {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.button-secondary:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
  color: #374151;
}

.button-primary {
  background: #10b981;
  color: #ffffff;
  border: 1px solid #10b981;
}

.button-primary:hover:not(:disabled) {
  background: #059669;
  border-color: #059669;
}

/* Responsive */
@media (max-width: 768px) {
  .keywords-create-container {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .preview-content {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .type-selector {
    flex-direction: column;
  }

  .form-actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
</style>
