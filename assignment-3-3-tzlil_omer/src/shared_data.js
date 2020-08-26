export const shared_data = {
    server_domain: "http://localhost:3000",
    searchResults: [],
    newRecipe:[],
    user: JSON.parse(localStorage.getItem("user")),
    login(user) {
        localStorage.setItem("user", JSON.stringify(user));
        this.user = JSON.parse(localStorage.getItem("user"));
    },
    logout() {
        localStorage.removeItem("user");
        this.user = null;
    }
};