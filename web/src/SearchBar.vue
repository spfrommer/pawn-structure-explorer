<template>
    <div id="bar">
        <span id="logo-span">
            <img src="../assets/logo.png" width="50"> 
        </span>
        <input id="search-field" @keyup.enter="search" v-model="query"/>
        <button id="search-button" @click="search">
            <img src="../assets/search-icon.png"> 
        </button>
    </div>
</template>

<script>
export default {
    props: ['startQuery'],
    computed: {
        query: {
            get() {
                return this.startQuery;
            },
            set(val) {
                this.$emit('setquery', val);
            }
        }
    },
    methods: {
        search: function() {
            console.log('Searchbar emitting search');
            this.$emit('search', this.query);
        }
    }
}
</script>

<style>
#bar {
    box-shadow: 0 2px 5px #ddd;
    background-color: var(--off-white);
    
    padding: 40px 0px 30px 0px;
    margin: -10px -10px 30px -10px;

    position: fixed;
    overflow: hidden;
    z-index: 1400;
    left: 0px;
    right: 0px;
    top: 0px !important;
    -webkit-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -ms-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
}
#bar * {
    vertical-align: middle;
}

#logo-span {
    margin: 0px 40px 0px 48px;
    color: var(--main-color);
}

#search-field {
    width: 700px;
    height: 20px;

    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 2px #ddd inset;
    
    padding: 20px;
    font-size: 25px;
    color: var(--text-second);
}
#search-field:focus {
    outline-width: 0;
}

#search-button {
    background-color: Transparent;
    border: none;
    outline: none;

    margin-left: -50px;
}
#search-button img {
    width: 40px;
    height: 40px;
}

</style>
