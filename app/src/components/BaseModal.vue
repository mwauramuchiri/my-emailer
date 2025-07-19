<template>
  <div>
    <div
      v-bind:class="[
        'modal',
        {
          'modal--open': openModal
        }
      ]"
    >
      <header class="modal__header">
        <BaseIconClose
          v-bind:use-svg.camel="true"
          class="modal__action-close"
          v-on:close-event="openModal = false"
        />
      </header>
      <div class="modal__body">
        <slot name="modal-body" />
      </div>
    </div>

    <button
      v-bind:class="['modal-open-button', {
        'modal-open-button--hidden' : !showModalOpenButton        
      }]"
      v-on:click="openModal = true"
    >
      &#128237;
    </button>
  </div>
</template>

<script>
import BaseIconClose from "./BaseIconClose.vue";
import _delay from "lodash/delay";

export default {
  name: "BaseModal",
  components: {
    BaseIconClose
  },
  data: function() {
    return {
      openModal: false,
      showModalOpenButton: false
    };
  },
  mounted: function() {
    this.$nextTick(() => {
      _delay(() => {
        this.showModalOpenButton = true;
      }, 650);
    });
  }
}
</script>

<style lang="scss">
.modal {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  height: 100vh;
  overflow-y: auto;
  opacity: 1;
  z-index: 77777;
  background-color: var(--white);
  transform: translateX(-100vw);
  transition: cubic-bezier(0.455, 0.03, 0.515, 0.955);
  transition-duration: .24s;
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
    0 6px 30px 5px rgba(0, 0, 0, 0.12);
}

.modal--open {
  transition-duration: .48s;
  opacity: 1;
  transform: translateX(0);
}

.modal__header {
  display: block;
  position: relative;
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  padding: 16px 24px;
}

.modal__action-close {
  display: block;
  margin-left: auto;
  width: 24px;
  height: 24px;
  fill: var(--black);
  cursor: pointer;
}

.modal__body {
  padding: 12px inherit;
  position: relative;
  display: block;
}

.modal-open-button {
  border: none;
  z-index: 66666;
  position: absolute;
  left: 0;
  bottom: calc(40% - 24px);
  height: 48px;
  border-top-right-radius: 24px;
  border-bottom-right-radius: 24px;
  width: 100px;
  background-color: var(--white);
  padding-right: 24px;
  font-size: 32px;
  line-height: 48px;
  text-align: center;
  cursor: pointer;
  transition: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-duration: .24s;
  transform: translateX(0%);
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
    0 6px 30px 5px rgba(0, 0, 0, 0.12);

  &:hover {
    background-color: var(--grey);
  }
}

.modal-open-button--hidden {
  transform: translateX(-115%);
  transition-duration: 0s;
}
</style>
