<template>
  <div>
    {{ labelTitle }}
  </div>
</template>

<script>
export default {
  name: 'KbnBoardLabel',
  props: {
    labelTitle: {
      type: String,
      default: 'label'
    }
  }
}
</script>

<style scoped>

</style>
