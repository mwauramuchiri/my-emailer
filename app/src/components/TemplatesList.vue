<template>
  <div
    v-if="hideTemplatesList === false"
    class="templates"
  >
    <h4 class="title">
      Select a template to continue
    </h4>

    <div class="list">
      <div
        v-for="(template, index) in templates"
        v-bind:key="index"
        class="template-item"
        v-on:click="selectTemplate(template)"
      >
        <p>{{ template }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "./../modules/axios";
export default {
  name: 'TemplatesList',
  data() {
    return {
      templates: [],
      hideTemplatesList: false,
    };
  },
  created() {
    axios.get("/templates")
      .then(({ data }) => {
        // console.log(data);
        const removedExtTemplates = data.data.map((template) => template.split('.json')[0])

        this.templates = removedExtTemplates;
      });
    //
  },
  methods: {
    selectTemplate(templateName) {
      this.$emit('start-bee', `${templateName}.json`)

      this.hideTemplatesList = true;
    },
  },
  
};
</script>

<style lang="scss">
  .templates {
    max-width: 50vw;
    width: 100%;
    margin: 3vh auto;
    top: 0;
    left: calc(50% - 25vw);
    max-height: 94vh;
    border-radius: 20px;
    border: 1px solid #a4a4a4;
    position: fixed;
    display: block;
    z-index: 77777;
    padding: 20px;
    background-color: white;
    overflow-y: auto;

    * {
      font-family: $fontLexend;
    }

    .title {
      margin-bottom: 20px;
    }

    .template-item {
      cursor: pointer;
      padding: 20px;
      border-radius: 20px;
      border: 1px solid #e7e7e7;
      margin-bottom: 10px;

      &:hover {
        background-color: #e7e7e7;
      }
    }
  }
</style>