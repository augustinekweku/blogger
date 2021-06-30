<template>
    <div>
        <h1>I am comp B and the counter is {{counter}}</h1>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
        computed: {
        ...mapGetters({
            'counter': 'getCounter'
        })
    },
}
</script>