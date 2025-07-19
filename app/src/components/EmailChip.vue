<template>
  <li
    class="email-chip"
    v-bind:class="{ 
      'email-chip__text--is-editing': isEditingEmail,
      'email-chip--is-dragging': isDraggingChip
    }"
    v-bind:draggable="isValidEmail"
    v-on:dragstart="dragStart({ email, index }, $event)"
    v-on:drag="dragging($event)"
    v-on:dragend="dragEnd($event)"
  >
    <span
      v-if="isEditingEmail == false"
      class="email-chip__text"
      v-on:click="editEmail"
    >
      {{ email }}
    </span>
    <input
      v-else
      v-bind:ref="emailChipInputRef"
      v-bind:value="email"
      class="email-chip__input"
      type="email"
      v-on:blur="updateEmail"
      v-on:keydown.tab.prevent="updateEmail"
      v-on:keyup.space="updateEmail"
      v-on:keyup.enter="updateEmail"
    >
    <BaseIconClose
      v-bind:use-svg.camel="true"
      class="email-chip__action-close"
      v-on:close-event="$emit('remove-email')"
    />
  </li>
</template>

<script>
import BaseIconClose from "./BaseIconClose.vue";
import chipDragDropMixin from "@/mixins/chipDragDropMixin.js";
import { isValidEmail } from "@/modules/emailValidator.js";

export default {
  name: "EmailChip",
  components: {
    BaseIconClose
  },
  mixins: [chipDragDropMixin],
  props: {
    email: {
      type: String,
      required: true
    },
    emailChipInputRef: {
      type: String,
      required: false,
      default: "email-chip-input--"
    },
    index: {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      isEditingEmail: false,
    };
  },
  computed: {
    isValidEmail: function() {
      return isValidEmail(this.email)
    }
  },
  methods: {
    editEmail: async function() {
      this.isEditingEmail = true;
      await this.$nextTick();

      this.$refs[this.emailChipInputRef].focus();
    },
    updateEmail: async function() {
      await this.$emit("update-email", event);
      this.isEditingEmail = false;
    }
  }
};
</script>

<style lang="scss">
$chipFontSize: 15px;

.email-chip {
  display: inline-flex;
  height: 34px;
  box-sizing: border-box;
  padding: 7px 4px;
  border-radius: 17px;
  margin-right: 8px;
  margin-bottom: 4px;
  background-color: var(--grey);
  border: 1px solid var(--grey);
  will-change: background-color;
  overflow: hidden;
}

.email-chip--invalid {
  background-color: var(--red);
}

.email-chip--is-dragging {
  border-color: var(--light-blue);
  opacity: 0.2;
}

.email-chip--floating {
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12);
  border-color: var(--blue);
  pointer-events: none;
  cursor: grabbing;
  will-change: left, right;

  .email-chip__text {
    pointer-events: none;
    cursor: grabbing;
  }
}

.email-chip--floating,
.email-chip--is-dragging {
  cursor: grabbing !important;
  background-color: var(--light-blue);
  transition-duration: .24s;
  transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
  
  .email-chip__text {
    color: var(--blue);
    cursor: grabbing !important;
    transition-duration: .18s;
  }
}

.email-chip__text {
  font-size: $chipFontSize;
  font-family: $fontManjari;
  line-height: 20px;
  display: inline-block;
  vertical-align: middle;
  color: var(--black);
  cursor: text;
}

.email-chip__text--is-editing {
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14),
    0 1px 10px 0 rgba(0, 0, 0, 0.12);
  transition-duration: .18s;
}

.email-chip__input {
  height: 18px;
  width: auto;
  outline: none !important;
  outline-width: 0px;
  outline-color: transparent;
  border: none !important;
  overflow: visible;
  font-size: $chipFontSize !important;
  font-family: $fontManjari;
  line-height: 18px;
  vertical-align: middle;
  background-color: transparent;
}

.email-chip__text,
.email-chip__input {
  padding: 0px 4px;
}

.email-chip__action-close {
  display: inline-block;
  color: var(--black);
  text-align: center;
  vertical-align: middle;
  cursor: pointer;
}

i.email-chip__action-close {
  font-size: 18px;
  line-height: 1;
  padding: 0px 4px;
}

svg.email-chip__action-close {
  width: 12px;
  height: 12px;
  padding: 3px 7px;
  fill: var(--black);
}

.email-chip--enter {
  opacity: 0;

  > * {
    opacity: 0;
  }
}

.email-chip--enter-to {
  opacity: 1;

  > * {
    opacity: 1;
  }
}

.email-chip--enter-active {
  transition-delay: .16s;
  transition-duration: .44s;
  transition-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1);
}

.email-chip--leave {
  max-width: 600px;

  > * {
    opacity: 1;
  }
}

.email-chip--leave-to {
  max-width: 0px;

  > * {
    opacity: 0;
  }
}

.email-chip--leave-active {
  transition-duration: .44s;
  transition-timing-function: ease-out;
}

.email-chip--enter-active,
.email-chip--leave-active {
  will-change: width, max-width, opacity;

  > * {
    transition-duration: .44s;
    transition-timing-function: ease-out;
  }
}

</style>
