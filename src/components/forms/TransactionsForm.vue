<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ isNewTransaction ? "Ajout d'une dépense" : "Modification d'une dépense" }}</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="12" sm="6">
            <v-text-field v-model="editedItem.description" label="Description" :rules="[rules.required]"></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="6">
            <v-text-field v-model="editedItem.amount" label="Montant" type="number" :rules="[rules.required, rules.positive]"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-combobox v-model="editedItem.category" label="Catégorie" :items="mergedCategories" :rules="[rules.required]"></v-combobox>
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
import { ref, computed, defineEmits, defineProps } from 'vue';
import transactionService from '@/services/transactionService';

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

const isNewTransaction = computed(() => props.editedIndex < 0);

// Catégories par défaut
const defaultCategories = [
  'Alimentation',
  'Logement',
  'Transports',
  'Loisirs',
  'Santé',
  'Éducation',
  'Vacances',
  'Autres'
];

// Fusionner les catégories par défaut avec celles fournies via props
const mergedCategories = computed(() => {
  const uniqueCategories = new Set([...defaultCategories, ...props.categories]);
  return Array.from(uniqueCategories);
});

const rules = {
  required: value => !!value || 'Ce champ est requis.',
  positive: value => value > 0 || 'Le montant doit être supérieur à 0.',
};

async function Sauvegarder() {
  if (
    !props.editedItem.description ||
    !props.editedItem.amount ||
    props.editedItem.amount <= 0 ||
    !props.editedItem.category ||
    !props.editedItem.date
  ) {
    alert("Veuillez remplir tous les champs correctement.");
    return;
  }

  if (isNewTransaction.value) {
    try {
      const newTransaction = await transactionService.createTransaction(props.editedItem);
      emit('create', newTransaction);
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
    }
  } else {
    try {
      const updatedTransaction = await transactionService.updateTransaction(props.editedItem.id, props.editedItem);
      emit('update', props.editedItem);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error);
    }
  }
}
</script>
