<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ isNewTransaction ? "Ajout d'une transaction" : "Modification d'une transaction" }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="12" sm="6">
            <v-text-field v-model="editedItem.description" label="Description" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="6">
            <v-text-field v-model="displayAmount" :label="`Montant (${selectedCurrency})`" type="number"
              :rules="[rules.required, rules.positive]"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-combobox v-model="editedItem.category" label="Catégorie" :items="categories"
              :rules="[rules.required]"></v-combobox>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-text-field v-model="editedItem.date" label="Date" type="date" :rules="[rules.required]"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey-darken-1" variant="text" @click="emit('close')">
        Annuler
      </v-btn>
      <v-btn color="blue-darken-1" variant="text" @click="Sauvegarder">
        Sauvegarder
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed, defineEmits, onMounted, defineProps, watch } from 'vue';
import transactionService from '@/services/transactionService';
import categorieService from '@/services/categorieService';
import currencyService from '@/services/currencyService';
import { useCurrencyStore } from '@/stores/currencyStore';
import { emitBus } from '@/plugins/eventBus';

function triggerNotification() {
  emitBus('notificationEvent');
}

const emit = defineEmits(['close', 'create', 'update']);

const props = defineProps({
  editedItem: {
    type: Object,
    required: true,
  },
  editedIndex: {
    type: Number,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
});

const currencyStore = useCurrencyStore();
const selectedCurrency = computed(() => currencyStore.selectedCurrency);
const isNewTransaction = computed(() => props.editedIndex < 0);
const categories = ref([]);
const displayAmount = ref(0);

const rules = {
  required: (value) => !!value || 'Ce champ est requis.',
  positive: (value) => value > 0 || 'Le montant doit être supérieur à 0.',
};

// Fonction pour convertir le montant en euros dans la devise sélectionnée
async function convertAmountToSelectedCurrency() {
  const rate = await currencyService.getExchangeRate('€', selectedCurrency.value);
  displayAmount.value = (props.editedItem.amount * rate).toFixed(2);
}

// Appeler la conversion uniquement lors de l'ouverture du formulaire
watch(() => props.editedItem, convertAmountToSelectedCurrency, { immediate: true });

async function getCategories() {
  try {
    const response = await categorieService.getCategories();
    categories.value = response.map(categorie => categorie.name);;
  } catch (error) {
    console.error('Erreur lors de la récupération des categories:', error);
  }
}

// Mettre à jour `displayAmount` lors de l'enregistrement sans modifier pendant l'édition
async function Sauvegarder() {
  if (
    !props.editedItem.description ||
    !displayAmount ||
    displayAmount <= 0 ||
    !props.editedItem.category ||
    !props.editedItem.date
  ) {
    alert('Veuillez remplir tous les champs correctement.');
    return;
  }

  // Convertir le montant en euros avant de sauvegarder
  const rate = await currencyService.getExchangeRate('€',selectedCurrency.value);
  props.editedItem.amount = (displayAmount.value / rate).toFixed(2);

  if (isNewTransaction.value) {
    try {
      const newTransaction = await transactionService.createTransaction({ ...props.editedItem, amount: props.editedItem.amount });
      emit('create', newTransaction);
      triggerNotification();
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
    }
  } else {
    try {
      const updatedTransaction = await transactionService.updateTransaction(props.editedItem.id, { ...props.editedItem, amount: props.editedItem.amount });
      emit('update', props.editedItem);
      triggerNotification();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error);
    }
  }
}

onMounted(() => {
  getCategories();
});
</script>
