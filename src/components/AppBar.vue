<template>
  <div class="appbarContainer">
    <!-- Notifications Button -->
    <v-menu min-width="250px" rounded class="notificationMenu">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" variant="text">
          <v-badge color="error" :content="notificationsList.length">
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-card class="notificationCard">
        <v-card-title>Notifications</v-card-title>
        <v-card-text>
          <v-list v-if="notificationsList.length > 0">
            <v-list-item v-for="notification in notificationsList" :key="notification.id"
              @click.stop="removeNotification(notification.id)">
              <div class="notificationContainer">
                <div class="infoContainer">
                  <v-list-item-icon>
                    <v-icon :class="notification.iconClass">{{ notification.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{ notification.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ notification.subtitle }}</v-list-item-subtitle>
                  </v-list-item-content>
                </div>
                <v-list-item-action>
                  <v-icon @click.stop="removeNotification(notification.id)">mdi-delete</v-icon>
                </v-list-item-action>
              </div>
            </v-list-item>
          </v-list>
          <v-card-text v-else>
            Aucune notification
          </v-card-text>
        </v-card-text>
      </v-card>
    </v-menu>

    <!-- Settings Button -->
    <v-menu min-width="250px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" variant="text">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Paramètres</v-card-title>
        <v-card-text>
          <v-switch v-model="darkTheme" label="Mode sombre" @click.stop="toggleDarkMode" />
          <v-select v-model="selectedCurrency" :items="currencies" label="Devise" @click.stop="" />
        </v-card-text>
      </v-card>
    </v-menu>

    <!-- User Avatar Button -->
    <v-menu min-width="200px" rounded>
      <template v-slot:activator="{ props }" class="avatarTemplate">
        <v-btn icon v-bind="props">
          <v-avatar color="brown" size="large">
            <span class="text-h5">{{ emailInitials }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="brown">
              <span class="text-h5">{{ emailInitials }}</span>
            </v-avatar>
            <p class="text mt-2">
              {{ email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" rounded @click="logout">
              Se déconnecter
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify'
import authService from '@/services/authService';

const router = useRouter();
const theme = useTheme()

const token = localStorage.getItem("authToken");
const decodedToken = token ? authService.decodeToken(token) : null;
const email = decodedToken?.email ?? '';

const emailInitials = computed(() => {
  return email.slice(0, 2).toUpperCase();
});

const darkTheme = computed(() => {
  return theme.global.current.value.dark;
});

// Notifications Menu Data
const notificationsList = ref([
  { id: 1, title: 'Danger Notification', subtitle: 'Something went wrong!', icon: 'mdi-alert', iconClass: 'text-red' },
  { id: 2, title: 'Warning Notification', subtitle: 'This is a warning!', icon: 'mdi-alert-outline', iconClass: 'text-yellow' },
  { id: 3, title: 'Success Notification', subtitle: 'Operation successful!', icon: 'mdi-check-circle', iconClass: 'text-green' },
]);

const selectedCurrency = ref('€');
const currencies = ['€', '$', '£', '¥'];

function toggleDarkMode() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

function removeNotification(id) {
  notificationsList.value = notificationsList.value.filter(notification => notification.id !== id);
}

function logout() {
  localStorage.removeItem('authToken');
  router.push({ name: 'Auth' });
}
</script>

<style scoped>
.v-avatar {
  cursor: pointer;
}

.notificationContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4% 0% 5% 0%;
}

.infoContainer{
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 1rem;
}

.notificationCard {
  min-width: 20rem;
}

.appbarContainer {
  display: flex;
  justify-content: end;
  align-items: center;
  padding: 1rem;
}

.ml-2 {
  margin-left: 0.5rem;
}
</style>
