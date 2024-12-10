import { defineStore } from "pinia";
import axios from "axios";

interface Item {
  id: number | null;
  firstName: string;
  lastName: string;
}

const API_URL = "https://62468c8fe3450d61b0001464.mockapi.io/vue-crud";

export const useItemStore = defineStore("itemStore", {
  state: () => ({
    items: [] as Item[]
  }),

  actions: {
    async fetchItems() {
      try {
        const response = await axios.get(API_URL);
        this.items = response.data;
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    },

    async createItem(item: Item) {
      try {
        const response = await axios.post(API_URL, item);
        this.items.push(response.data);
      } catch (error) {
        console.error("Error creating item:", error);
      }
    },

    async updateItem(item: Item) {
      try {
        const response = await axios.put(`${API_URL}/${item.id}`, item);
        const index = this.items.findIndex((i) => i.id === item.id);
        if (index !== -1) {
          this.items[index] = response.data;
        }
      } catch (error) {
        console.error("Error updating item:", error);
      }
    },

    async deleteItem(id: number) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        this.items = this.items.filter((item) => item.id !== id);
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    },
  },
});
