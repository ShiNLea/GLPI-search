<script>
    import Header from './Header.svelte';
</script>

<div class="app">
    <Header />

    <main>
        <slot />
    </main>

    <footer>
        <p> This app was made by <a href="https://www.blackdiamondgroup.com/">Black Diamond Group.</a></p>
    </footer>
</div>