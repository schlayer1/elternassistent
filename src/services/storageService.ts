import { ChecklistGroup } from '../types/school';
import { DEFAULT_CHECKLISTS } from '../data/checklistsData';
import { ChatMessage } from '../types/assistant';

const CHECKLIST_STORAGE_KEY = 'hbs_elternassistent_checklists';
const CHAT_STORAGE_KEY = 'hbs_elternassistent_chat_history';

export const storageService = {
  getChecklists: (): ChecklistGroup[] => {
    try {
      const stored = localStorage.getItem(CHECKLIST_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Fehler beim Laden der Checklisten:', e);
    }
    return DEFAULT_CHECKLISTS;
  },

  saveChecklists: (checklists: ChecklistGroup[]): void => {
    try {
      localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(checklists));
    } catch (e) {
      console.warn('Fehler beim Speichern der Checklisten:', e);
    }
  },

  toggleChecklistItem: (groupId: string, itemId: string): ChecklistGroup[] => {
    const current = storageService.getChecklists();
    const updated = current.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          items: group.items.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          )
        };
      }
      return group;
    });
    storageService.saveChecklists(updated);
    return updated;
  },

  resetChecklistGroup: (groupId: string): ChecklistGroup[] => {
    const current = storageService.getChecklists();
    const updated = current.map((group) => {
      if (group.id === groupId) {
        return {
          ...group,
          items: group.items.map((item) => ({ ...item, completed: false }))
        };
      }
      return group;
    });
    storageService.saveChecklists(updated);
    return updated;
  },

  getChatHistory: (): ChatMessage[] => {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return [];
  },

  saveChatHistory: (messages: ChatMessage[]): void => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch (e) {}
  },

  clearChatHistory: (): void => {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch (e) {}
  }
};
