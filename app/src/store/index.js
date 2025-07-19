import Vue from "vue";
import Vuex from "vuex";
import dragDropStates from "./modules/dragDropStateManager";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    namespaced: false,
    dragDropStates
  }
});

export default store;