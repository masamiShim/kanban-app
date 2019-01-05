<template>
  <nav class="board-navigation">
    <div class="title">
      <h1>kanban App</h1>
    </div>
    <div class="actions">
      <KbnButton
        type="text"
        @click="$emit('logout')">
        ログアウト
      </KbnButton>
    </div>
  </nav>
</template>
<script>
import KbnButton from '../atoms/KbnButton'
export default {
  components: {KbnButton}
}
</script>
