<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ isNewCategorie ? "Ajout d'une categorie" : "Modification d'une categorie" }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="12" sm="6">
            <v-text-field v-model="editedItem.name" label="Nom" :rules="[rules.required, rules.notTooBig, rules.notTooSmall]"></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="6">
            <v-text-field v-model="displayAmount" :label="`Limite mensuelle (${selectedCurrency})`" type="number"
              :rules="[rules.required, rules.positive]"></v-text-field>
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
import { ref, computed, defineEmits, defineProps, watch } from 'vue';
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
});

const currencyStore = useCurrencyStore();
const selectedCurrency = computed(() => currencyStore.selectedCurrency);

const isNewCategorie = computed(() => props.editedIndex < 0);

const displayAmount = ref(0);


const rules = {
  required: (value) => !!value || 'Ce champ est requis.',
  positive: (value) => value >= 0 || 'Le montant doit être supérieur ou égal à 0.',
  notTooBig: (value) => value.length <= 12 || 'Le nom ne doit pas dépasser 12 caractères.',
  notTooSmall: (value) => value.length >=3 || 'Le nom doit faire au minimum 3 caractères.',
};

// Fonction pour convertir le montant en euros dans la devise sélectionnée
async function convertAmountToSelectedCurrency() {
  const rate = await currencyService.getExchangeRate('€', selectedCurrency.value);
  displayAmount.value = (props.editedItem.month_limit * rate).toFixed(2);
}

// Appeler la conversion uniquement lors de l'ouverture du formulaire
watch(() => props.editedItem, convertAmountToSelectedCurrency, { immediate: true });


async function Sauvegarder() {
  if (
    !props.editedItem.name ||
    props.editedItem.name.length > 12 ||
    props.editedItem.name.length < 3 ||
    !displayAmount ||
    displayAmount < 0
  ) {
    alert('Veuillez remplir tous les champs correctement.');
    return;
  }

  // Convertir le montant en euros avant de sauvegarder
  const rate = await currencyService.getExchangeRate('€',selectedCurrency.value);
  props.editedItem.month_limit = (displayAmount.value / rate).toFixed(2);

  if (isNewCategorie.value) {
    try {
      const newCategorie = await categorieService.createCategorie({ ...props.editedItem, month_limit: props.editedItem.month_limit });
      console.log("newCategorie: "+JSON.stringify(newCategorie,null,2));
      emit('create', newCategorie);
      triggerNotification();
    } catch (error) {
      console.error('Erreur lors de la création de la categorie:', error);
    }
  } else {
    try {
      const updatedCategorie = await categorieService.updateCategorie(props.editedItem.id, { ...props.editedItem, month_limit: props.editedItem.month_limit });
      emit('update', props.editedItem);
      triggerNotification();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la categorie:', error);
    }
  }
}
</script>
