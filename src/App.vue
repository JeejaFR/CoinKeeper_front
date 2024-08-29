<template>
  <v-app>
    <v-main :class="theme.global.current.value.dark ? 'darkMain': 'lightMain'">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
  import { useTheme } from 'vuetify'

  const theme = useTheme()
</script>

<style>
.darkMain{
  background-color: rgb(25,25,25);
}
.lightMain{
  background-color: rgb(245,245,245);
}
</style>