<script setup lang="ts">
import { data as posts } from '../posts.data.js'
import { useData } from 'vitepress'

const { theme } = useData()
const showTags = theme.value.postList?.showTags ?? true
</script>

<template>
  <div class="post-list">
    <article v-for="post in posts" :key="post.url" class="post-item">
      <a :href="post.url" class="post-link">
        <h3 class="post-title">{{ post.title }}</h3>
        <p v-if="post.excerpt" class="post-excerpt">{{ post.excerpt }}</p>
        <div class="post-meta">
          <time v-if="post.date" class="post-date">{{ post.date }}</time>
          <span v-if="showTags && post.tags.length" class="post-tags">
            <span v-for="tag in post.tags" :key="tag" class="tag">#{{ tag }}</span>
          </span>
        </div>
      </a>
    </article>
  </div>
</template>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
}
.post-item {
  border-bottom: 1px solid var(--vp-c-divider);
}
.post-item:last-child {
  border-bottom: none;
}
.post-link {
  display: block;
  padding: 18px 4px;
  text-decoration: none !important;
  transition: padding-left 0.2s ease;
}
.post-link:hover {
  padding-left: 10px;
}
.post-title {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}
.post-excerpt {
  margin: 0 0 8px;
  font-size: 0.92rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.post-date {
  font-size: 0.82rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}
.post-tags {
  display: inline-flex;
  gap: 8px;
}
.tag {
  font-size: 0.78rem;
  color: var(--vp-c-brand-1);
}
</style>
