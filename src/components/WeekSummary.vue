<template>
    <table>
        <thead>
            <tr>
            <th>Maanantai</th>
            <th>Tiistai</th>
            <th>Keskiviikko</th>
            <th>Torstai</th>
            <th>Perjantai</th>
            <th>Yhteensä</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{ useHoursStore().parseTime(getHours(0)) }}</td>
                <td>{{ useHoursStore().parseTime(getHours(1)) }}</td>
                <td>{{ useHoursStore().parseTime(getHours(2)) }}</td>
                <td>{{ useHoursStore().parseTime(getHours(3)) }}</td>
                <td>{{ useHoursStore().parseTime(getHours(4)) }}</td>
                <td>{{ useHoursStore().parseTime(getWeekHours()) }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script setup>
import { useHoursStore } from '@/stores/hours';

const getHours = weekday => {
    const d = new Date(new Date());
    const day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1) + weekday;
    const date = new Date(d.setDate(diff)).toISOString().split('T')[0];

    return useHoursStore().hours
        .filter(entry => entry.date === date)
        .map(e => e.minutes)
        .reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        },0);
}

const getWeekHours = () => {
    const dailyHours = [];
    for (let index = 0; index < 5; index++) {
        dailyHours.push(getHours(index));
    }
    return dailyHours.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
    },0);
}
</script>

<style lang="css" scoped>
table {
    margin-top: 2rem;
    width: 100%;
    text-align: center;
    
    td {
        cursor: default;
    }

    tbody tr:hover {
        opacity: 80%;
    }
}
</style>