const moment = require('moment-timezone');

module.exports = {
    SLOT_DURATION: 60,
    isOpened: async (horarios) => {},
    toCents: (price) => {
        return parseInt(price.toString().replace('.', '').replace(',', ''))
    },
    mergeDateTime: (date, time) => {
      const merged = `${moment(date).format('YYYY-MM-DD')}T${moment(time, 'HH:mm').format('HH:mm')}`;
      return moment.tz(merged, 'YYYY-MM-DDTHH:mm', 'America/Sao_Paulo');
  },
    formatDateToISOString: (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) {
          throw new Error('Invalid date format');
        }
        return date.toISOString();
    },
    hourToMinutes: (data) => {
        // 1:00
        const [hour, minutes] = data.split(':')
        return parseInt(parseInt(hour) * 60 + parseInt(minutes))
    },
    sliceMinutes: (start, end, duration) => {
        const slices = []
        let count = 0

        // 60
        start = moment(start)
        // 120
        end = moment(end)

        while (end>start) {
            slices.push(start.format('HH:mm'))

            start = start.add(duration, 'minutes')
            count++
        }

        return slices
    },
    splitByValue: (array, value) => {
        let newArray = [[]];
        array.forEach((item) => {
          if (item !== value) {
            newArray[newArray.length - 1].push(item);
          } else {
            newArray.push([]);
          }
        });
        return newArray;
      }
}

