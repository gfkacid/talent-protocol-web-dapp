import create from "zustand";
import { get } from "src/utils/requests";

const messagesStore = create(set => ({
  messageCount: 0,
  increaseMessageCount: () => set(state => ({ messageCount: state.messageCount + 1 })),
  clearMessageCount: () => set({ messageCount: 0 })
}));

const railsContextStore = create(set => ({
  railsContext: {},
  setRailsContext: newRailsContext => set({ railsContext: newRailsContext })
}));

const urlStore = create(set => ({
  url: "",
  changeURL: newURL => set({ url: newURL })
}));

const loggedInUserStore = create(set => ({
  currentUser: undefined,
  loading: false,
  fetchCurrentUser: async () => {
    const response = await get("/api/v1/sessions/logged_in_user").catch(error => console.error(error));
    set({ currentUser: response.user, loading: false });
  }
}));

export { messagesStore, railsContextStore, urlStore, loggedInUserStore };
