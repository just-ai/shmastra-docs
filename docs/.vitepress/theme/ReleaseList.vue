<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <div class="release-list">
    <div v-for="release in frontmatter.releases" :key="release.version" class="release-item">
      <a class="release-card" :href="release.link ?? `/shmastra-docs/releases/${release.version}`">
        <div class="box">
          <h2 class="title">{{ release.version }} — {{ release.date }}</h2>
          <p class="details">{{ release.summary }}</p>
          <div class="link-text">
            <p class="link-text-value">
              Read release notes <span class="vpi-arrow-right" style="margin-left:6px" />
            </p>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>
