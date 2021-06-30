<template>
    <div>
        <h1 ref="myref">Hooks tutorial</h1>
        <h3>My name is {{ name }}</h3>
    </div>
</template>

<script>
export default {
    data() {
        return{
            name: 'Augustine',
        }
    },
    created() {
        //call mostly initial data from it
        //created is renderd before html is rendered
        console.log('data and other function is available but not html', this.name)
    },
    mounted() {
        console.log(this.$refs.myref)
    }
}
</script>