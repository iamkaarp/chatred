<template>
    <div
        id="app"
        class="h-screen flex"
    >
        <!-- Fixed sidebar -->
        <div class="bg-gray-600 w-40 sm:w-64">
            <h1 class="p-4 text-white font-semibold text-xl">
                Channels
            </h1>
            <ul class="p-4">
                <li
                    v-for="channel of channels"
                    :key="channel.id"
                >
                    #{{ channel.name }}
                </li>
            </ul>
        </div>
        <!-- Scroll wrapper -->
        <div class="flex-1 flex overflow-hidden">
            <!-- Scrollable container -->
            <div
                id="messageContainer"
                class="px-6 py-4 flex-1 overflow-y-scroll"
            >
                <!-- Your content -->
                <div
                    v-for="(message, index) of messages"
                    :key="index"
                    class="p-2 shadow rounded my-10 bg-white text-gray-600"
                >
                    {{ message }}
                </div>
            </div>
            <div class="w-full bg-gray-800 fixed bottom-0">
                <input-box @send="send" />
            </div>
        </div>
    </div>
</template>

<script>
import socketio from 'socket.io-client';
import inputBox from '@/components/inputBox.vue';

export default {
    components: {
        inputBox,
    },
    data() {
        return {
            io: socketio('http://localhost:5000'),
            channels: [
                {
                    id: 1,
                    name: 'Default',
                },
            ],
            messages: [],
            commands: [
                '/join',
                '/exit',
                '/leave',
                '/whisper',
            ],
            activeChannel: 1,
        };
    },
    mounted() {
        this.io.on('connect', () => {
            this.io.on('message', (response) => {
                console.log(response);
                let elem = document.getElementById('messageContainer');
                elem.scrollTop = elem.scrollHeight;
            });
            this.io.on('joined', response => {
                console.log(response);
            });
        });
    },
    methods: {
        send(message) {
            const parts = message.split(' ');
            if(this.isCommand(parts[0])) {
                this.io.emit(parts[0].substring(1), parts[1]);
                return;
            }
            let activeChannel = this.channels.find(channel => channel.id === this.activeChannel);
            this.io.emit('message', { channel: activeChannel, message: message });
        },
        isCommand(command) {
            return this.commands.includes(command);
        },
    },
};
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
