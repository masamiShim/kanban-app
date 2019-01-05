<template>
  <span>
    {{ icon }}
  </span>
</template>

<script>
export default {
  name: 'KbnIcon',
  props: {
    name: {
      type: String,
      required: true,
      validator: value => ['remove', 'add', 'close'].indexOf(value) !== -1
    }
  },
  computed: {
    classes () {
      return ['kbn-icon-', this.name]
    },
    icon () {
      const name = this.name
      if (['remove', 'close'].indexOf(name) !== 1) {
        return 'x'
      } else if (name === 'add') {
        return '+'
      }
    }
  }
}
</script>
