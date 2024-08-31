<template>
  <div class="appbarContainer">
    <!-- Notifications Button -->
    <v-menu width="250px" rounded class="notificationMenu">
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props" variant="text" @click="getNotifications">
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
                  <v-list-item-icon class="iconContainer">
                    <v-icon :class="notification.iconClass">{{ notification.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="truncate-text">{{ notification.content }}</v-list-item-title>
                    <v-list-item-subtitle>{{ notification.date }}</v-list-item-subtitle>
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
          <v-avatar color="blue" size="large">
            <span class="text-h5">{{ emailInitials }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="blue">
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
import { useCurrencyStore } from '@/stores/currencyStore';
import authService from '@/services/authService';
import notificationService from '@/services/notificationService';


const router = useRouter();
const theme = useTheme();
const currencyStore = useCurrencyStore();

const token = localStorage.getItem("authToken");
const decodedToken = token ? authService.decodeToken(token) : null;
const email = decodedToken?.email ?? '';

const emailInitials = computed(() => {
  return email.slice(0, 2).toUpperCase();
});

const selectedCurrency = computed({
  get: () => currencyStore.selectedCurrency,
  set: (value) => currencyStore.setCurrency(value)
});

const darkTheme = computed(() => {
  return theme.global.current.value.dark;
});

const notificationsList = ref([]);

const currencies = ['€', '$', '£', '¥'];

async function getNotifications(){
  const notifications = await notificationService.getNotifications();

  notificationsList.value = notifications.map(notification => {
    const { icon, iconClass } = getNotificationIcon(notification.type);
    return {
      ...notification,
      icon,
      iconClass
    };
  });
}

function getNotificationIcon(type) {
  switch (type) {
    case 0:
      return { icon: 'mdi-check-circle', iconClass: 'text-green' };
    case 1:
      return { icon: 'mdi-information-outline', iconClass: 'text-blue' };
    case 2:
      return { icon: 'mdi-alert', iconClass: 'text-red' };
    default:
      return { icon: 'mdi-information', iconClass: 'text-blue' };
  }
}

function toggleDarkMode() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

async function removeNotification(id) {
  notificationsList.value = notificationsList.value.filter(notification => notification.id !== id);
  await notificationService.deleteNotification(id);
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
.v-list-item{
  padding: 0!important;
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
  gap: 5px;
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
.truncate-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
}
.ml-2 {
  margin-left: 0.5rem;
}
</style>
