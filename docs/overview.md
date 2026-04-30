---
layout: false
---

<script setup>
import { onMounted } from 'vue'
import { useData } from 'vitepress'

onMounted(() => {
  const { site } = useData()
  window.location.replace(site.value.base + 'deck.html')
})
</script>
