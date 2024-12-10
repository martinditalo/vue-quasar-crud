<template>
  <div class="q-pa-md" id="container">
    <h3>Vue Quasar CRUD</h3>

    <q-btn label="Add Person" color="primary" @click="openCreateDialog" />

    <q-table :rows="items" :columns="columns" row-key="id">
      <template v-slot:body-cell-action="props">
        <td class="flex justify-center">
          <q-btn
            round
            dense
            flat
            icon="edit"
            color="primary"
            @click="editItem(props.row)"
          />
          <q-btn
            round
            dense
            flat
            icon="delete"
            color="negative"
            @click="deleteItem(props.row.id)"
          />
        </td>
      </template>
    </q-table>

    <q-dialog v-model="dialogOpen">
      <q-card class="q-pa-md">
        <q-card-section>
          <div class="text-h6">{{ dialogTitle }}</div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="form.firstName"
            label="First Name"
            :rules="[
              (val) => (val && val.length > 0) || 'First Name is required',
            ]"
          />
          <q-input
            v-model="form.lastName"
            label="Last Name"
            :rules="[
              (val) => (val && val.length > 0) || 'Last Name is required',
            ]"
          />
        </q-card-section>

        <q-card-actions class="flex justify-center items-center">
          <q-btn label="Cancel" color="secondary" @click="dialogOpen = false" />
          <q-btn label="Save" color="primary" @click="saveItem" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useItemStore } from "./stores/itemStore";
import {
  QTable,
  QBtn,
  QDialog,
  QCard,
  QCardSection,
  QInput,
  QCardActions,
} from "quasar";

interface TableColumn {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: "center" | "left" | "right";
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  style?: string;
  headerClasses?: string;
}

interface FormData {
  id: number | null;
  firstName: string;
  lastName: string;
}

const store = useItemStore();
const dialogTitle = ref("");

const items = ref(store.items);
const columns = ref<TableColumn[]>([
  {
    name: "firstName",
    label: "First Name",
    align: "center",
    field: "firstName",
    sortable: true,
  },
  {
    name: "lastName",
    label: "Last Name",
    align: "center",
    field: "lastName",
    sortable: true,
  },
  {
    name: "createdAt",
    label: "Date created",
    align: "center",
    field: (row) => {
      const date = new Date(row.createdAt);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    sortable: true,
  },
  {
    name: "action",
    label: "Action",
    align: "center",
    field: "action",
    style: "width: 150px",
  },
]);

const dialogOpen = ref(false);
const form = ref<FormData>({ id: null, firstName: "", lastName: "" });

onMounted(() => {
  store.fetchItems();
});

const openCreateDialog = () => {
  form.value = { id: null, firstName: "", lastName: "" };
  dialogOpen.value = true;
  dialogTitle.value = "Add Person";
};

const editItem = (item: {
  id: number;
  firstName: string;
  lastName: string;
}) => {
  form.value = { ...item };
  dialogOpen.value = true;
  dialogTitle.value = "Edit Person";
};

const saveItem = () => {
  if (form.value.id) {
    store.updateItem(form.value);
  } else {
    form.value.id = Date.now();
    store.createItem(form.value);
  }
  dialogOpen.value = false;
};

const deleteItem = (id: number) => {
  store.deleteItem(id);
};

store.$subscribe(() => {
  items.value = store.items;
});
</script>

<style scoped>
#container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
}
.q-card__section {
  padding-top: 0;
  padding-bottom: 0;
}
.q-btn {
  margin-left: 4px;
  margin-right: 4px;
}
.q-table__container {
  width: 80%;
}
</style>
