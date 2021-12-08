<template>
  <div class="home">
    <div class="article-list-box">
      <n-list bordered>
        <!-- <template #header> hhh </template>
        <template #footer> fff </template> -->
        <n-list-item>
          <template #prefix>
            <n-button>Prefix</n-button>
          </template>
          <template #suffix>
            <n-button>Suffix</n-button>
          </template>
          <n-thing title="Thing" title-extra="extra" description="description">
            Biu<br />
          </n-thing>
        </n-list-item>
      </n-list>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { NList, NListItem, NButton, NThing } from "naive-ui";

export default {
  name: "Home",
  components: {
    NButton,
    NList,
    NListItem,
    NThing,
  },
};
</script>

<style lang="less"></style>
