<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" md="6" sm="6">
            <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-text-field v-model="editedItem.amount" label="Amount"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-text-field v-model="editedItem.category" label="Category"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" sm="6">
            <v-text-field v-model="editedItem.date" label="Date" type="date"></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="this.$emit('close');">
        Annuler
      </v-btn>
      <v-btn color="blue-darken-1" variant="text" @click="Sauvegarder">
        Sauvegarder
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { ref, computed, watch, defineEmits, defineProps } from 'vue';

  const emit = defineEmits(['close']);

  const props = defineProps({
    editedItem: {
      type: Object,
      required: true,
    },
  });

  function Sauvegarder(){
    // TODO
    emit('close');
  }
</script>