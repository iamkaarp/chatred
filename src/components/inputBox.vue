<template>
    <div>
        <input
            id="message"
            ref="input"
            v-model="message"
            class="shadow appearance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
            type="text"
            autocomplete="off"
            placeholder="Meddelande"
            @keyup="keyCode"
        />
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: '',
        };
    },
    mounted() {
        this.$refs['input'].select();
        this.$refs['input'].focus();
    },
    methods: {
        keyCode(e) {
            if(e.key === 'Enter') {
                this.$emit('send', this.message);
                this.message = '';
            }
        },
    },
};
</script>

<style>

</style>