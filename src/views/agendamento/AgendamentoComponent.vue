<template>
    <v-row>

        <v-dialog v-model="dialogEdit">
            <FormEditComponent @closeDialog="closeDialogEdit()"></FormEditComponent>

        </v-dialog>
        <v-col cols="12" lg="12" sm="12">
            <v-card elevation="0" class="mb-3">
                <v-card-title class="pa-3">
                    Agendamento de recebimentos
                </v-card-title>
                <v-card-text class="d-flex  pa-5 justify-end">
                    <v-btn @click="openDialogEdit" color="primary">Novo agendamento</v-btn>
                </v-card-text>
            </v-card>

        </v-col>

        <v-col cols="12" lg="12" sm="12">
            <UiParentCard title="Calendar with Min Date">
                <div class="text-center section">

                    <v-calendar class="custom-calendar max-w-full" :masks="masks" :attributes="attributes"
                        disable-page-swipe is-expanded>
                        <template v-slot:day-content="{ day, attributes }">
                            <div @click="openDialogEdit" class="flex flex-col h-full z-10 overflow-hidden">
                                <span class="day-label text-sm text-gray-900">{{ day.day }}</span>
                                <div class="flex-grow overflow-y-auto overflow-x-auto">
                                    <p v-for="attr in attributes" :key="attr.key"
                                        class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1"
                                        :class="attr.customData.class">
                                        {{ attr.customData.title }}
                                    </p>
                                </div>
                            </div>
                        </template>
                    </v-calendar>
                </div>

            </UiParentCard>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import 'v-calendar/style.css';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import FormEditComponent from './FormEditComponent.vue';




const breadcrumbs = ref([
    {
        text: 'Dashboard',
        disabled: false,
        href: '#'
    },
    {
        text: 'Chat Page',
        disabled: true,
        href: '#'
    }
]);

const dialogEdit = ref(false);

const openDialogEdit = () => {
    dialogEdit.value = true;
};

function closeDialogEdit() {
    console.log('closeDialogEdit');
    dialogEdit.value = false;
};

const month = new Date().getMonth();
const year = new Date().getFullYear();

const masks = reactive({
    weekdays: 'WWW',
});

const attributes = ref([
    {
        key: 1,
        customData: {
            title: 'Recebimento de mercadoria da Empresa A.',
            class: 'bg-red-600 custom-size text-white',
        },
        dates: new Date(year, month, 1),
    },
    {
        key: 2,
        customData: {
            title: 'Recebimento de mercadoria da Empresa B.',
            class: 'bg-blue-500 custom-size text-white',
        },
        dates: new Date(year, month, 2),
    },
    {
        key: 3,
        customData: {
            title: 'Recebimento de mercadoria da Empresa C.',
            class: 'bg-blue-500 custom-size text-white',
        },
        dates: new Date(year, month, 5),
    },
    {
        key: 4,
        customData: {
            title: 'Recebimento de mercadoria da Empresa D.',
            class: 'bg-indigo-500 custom-size text-white',
        },
        dates: new Date(year, month, 5),
    },
    {
        key: 5,
        customData: {
            title: 'Recebimento de mercadoria da Empresa E.',
            class: 'bg-teal-500 custom-size text-white',
        },
        dates: new Date(year, month, 7),
    },
    {
        key: 6,
        customData: {
            title: 'Recebimento de mercadoria da Empresa F.',
            class: 'bg-pink-500 custom-size text-white',
        },
        dates: new Date(year, month, 11),
    },
    {
        key: 7,
        customData: {
            title: 'Recebimento de mercadoria da Empresa G.',
            class: 'bg-orange-500 text-white custom-size',
        },
        dates: { months: 5, ordinalWeekdays: { 2: 1 } },
    },
    {
        key: 8,
        customData: {
            title: 'Recebimento de mercadoria da Empresa H.',
            class: 'bg-primary  custom-size text-white',
        },
        dates: new Date(year, month, 22),
    },
    {
        key: 9,
        customData: {
            title: 'Recebimento de mercadoria da Empresa I.',
            class: 'bg-green-500 text-white custom-size',
        },
        dates: new Date(year, month, 25),
    },
]);
</script>

<style scoped>
::-webkit-scrollbar {
    width: 0px;
}


/* Novas classes de cores */
.bg-red-600 {
    background-color: #e53935;
}

.bg-blue-500 {
    background-color: #2196f3;
}

.bg-indigo-500 {
    background-color: #3f51b5;
}

.bg-teal-500 {
    background-color: #009688;
}

.bg-pink-500 {
    background-color: #e91e63;
}

.bg-orange-500 {
    background-color: #ff9800;
}

.bg-green-500 {
    background-color: #4caf50;
}

.bg-primary {
    background-color: #1976d2;
}

.custom-size {
    width: 150px;
    height: auto;
    padding: 2px;
    margin-left: 2px;
    margin-right: 2px;
}

flex-grow overflow-y-auto overflow-x-auto {
    display: flex;
    flex-direction: column;
}

::-webkit-scrollbar-track {
    display: none;
}

.custom-calendar.vc-container {
    --day-border: 1px solid #b8c2cc;
    --day-border-highlight: 1px solid #b8c2cc;
    --day-width: 90px;
    --day-height: 90px;
    --weekday-bg: #f8fafc;
    --weekday-border: 1px solid #eaeaea;

    border-radius: 0;
    width: 100%;

    & .vc-header {
        background-color: #f1f5f8;
        padding: 10px 0;
    }

    & .vc-weeks {
        padding: 0;
    }

    & .vc-weekday {
        background-color: var(--weekday-bg);
        border-bottom: var(--weekday-border);
        border-top: var(--weekday-border);
        padding: 5px 0;
    }

    & .vc-day {
        padding: 0 5px 3px 5px;
        text-align: left;
        height: var(--day-height);
        min-width: var(--day-width);
        background-color: white;

        &.weekday-1,
        &.weekday-7 {
            background-color: #eff8ff;
        }

        &:not(.on-bottom) {
            border-bottom: var(--day-border);

            &.weekday-1 {
                border-bottom: var(--day-border-highlight);
            }
        }

        &:not(.on-right) {
            border-right: var(--day-border);
        }
    }

    & .vc-day-dots {
        margin-bottom: 5px;
    }
}
</style>