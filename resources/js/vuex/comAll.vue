<template>
<div>
    <div class="content">
        <div class="container-fluid">
            <h1>I will show how all other components react to chnages</h1>
            <h2>The master component counter is : {{counter}}</h2>

            <div>
                <comA></comA>
                <comB></comB>
                <comC></comC>
            </div>
            <Button type="info" @click="changeCounter">Change state</Button>
        </div>
    </div>
</div>
</template>

<script>
import comA from './comA'
import comB from './comB'
import comC from './comC'
import { mapGetters, mapActions } from "vuex";


export default {
    data() {
        return {
            localVar: 'some value'
        }
    },
    methods: {
        ...mapActions([
            'changerCounterAction'
        ])
    },
    computed: {
        ...mapGetters({
            'counter': 'getCounter'
        })
    },
    methods: {
        changeCounter() {
            this.$store.dispatch('changeCounterAction', 1)
            // this.$store.commit('changeTheCounter', 1)
        },
        counterChangeAction() {
            console.log('I am acting on any changes made')
        }
    },
    created() {
        console.log(this.$store.state.counter)
    },
    components: {
        comA,
        comB,
        comC,
    },
    watch: {
        counter(value) {
            console.log('counter is changing', value)
            this.counterChangeAction()
            console.log('local var', this.localVar)
        }
    }
}
</script>