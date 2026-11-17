<template>
  <span class="logo">
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" fill="none" stroke="currentColor" stroke-width="2" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
    <span class="text"><strong>TUNE</strong><span>COLLECTOR</span></span>
  </span>
</template>

<style scoped>
.logo { display: inline-flex; align-items: center; gap: 8px; color: var(--accent); font-family: 'Nunito', sans-serif; }
.text { display: flex; align-items: baseline; gap: 2px; }
strong { font-size: 1.15rem; font-weight: 800; }
span span { font-size: .8rem; font-weight: 700; color: var(--text); letter-spacing: .03em; }
</style>