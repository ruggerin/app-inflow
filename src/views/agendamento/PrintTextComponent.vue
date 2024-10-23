<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    text: {
        type: String as () => string | null,
        required: true
    },
    label: {
        type: String as () => string | null,
        required: true
    },
    aligment: {
        type: String as () => string | null,
        default: 'left'
    }

});

function constructedClass() {
    return {
        'text-left': props.aligment == 'left',
        'text-center': props.aligment == 'center',
        'text-right': props.aligment == 'right'
    }
}
</script>

<template>
    <v-row class="compact-form">
        <v-col cols="12">
            <span :class="constructedClass()" style="font-size: 12px; color:grey">{{ props.label }}</span>
        </v-col>
        <v-col cols="12">
            <span :class="constructedClass()" style="font-size: 12px; ">{{ props.text }}</span>
        </v-col>
    </v-row>
</template>

<style scoped>
.compact-form {
    padding: 2 !important;
}

.compact-form>* {
    margin-top: 1 !important;
    margin-bottom: 1 !important;
    padding: 0 !important;
}

.text-left {
    text-align: left;
    display: block;
}

.text-center {
    text-align: center;
    display: block;
}
</style>