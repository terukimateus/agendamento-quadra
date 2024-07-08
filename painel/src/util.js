export default {
    hourToMinutes: (data) => {
        // 1:00
        const [hour, minutes] = data.split(':')
        return parseInt(parseInt(hour) * 60 + parseInt(minutes))
    },
}