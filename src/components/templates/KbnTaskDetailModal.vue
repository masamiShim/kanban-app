<template>
  <div class="task-detail-modal">
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <KbnButton
            type="text"
            @click="handleClose">
            <KbnIcon name="close" />
          </KbnButton>
        </div>
        <div class="body">
          <KbnTaskDetailForm
            :task="task"
            :onupdate="handleUpdate"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import KbnButton from '../atoms/KbnButton'
import KbnIcon from '../atoms/KbnIcon'
import KbnTaskDetailForm from '../molecules/KbnTaskDetailForm'
export default {
  name: 'KbnTaskDetailModal',
  components: {KbnTaskDetailForm, KbnIcon, KbnButton},
  computed: {
    task () {
      const id = parseInt(this.$route.params.id)
      return !Number.isNaN(id)
        ? {...this.$store.getters.getTaskById(id)}
        : {}
    }
  },
  methods: {
    back () {
      this.$router.push({ path: '/' })
    },
    handleClose () {
      this.back()
    },
    handleUpdate (task) {
      return this.$store.dispatch('updateTask', task)
        .then(() => {
          this.back()
        })
        .catch(err => Promise.reject(err))
    }
  }
}
</script>

<style scoped>
  .task-detail-modal {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0, .5);
    display: table;
    transition: opacity .3s ease;
  }
  .header {
    text-align: right;
  }
  .header button {
    width: 16px;
    cursor: pointer;
  }
  .body {
    width: 100%;
  }
</style>
