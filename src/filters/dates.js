(function() {
    var module = angular.module('datesFilter', []);

    module.filter('duration', function() {
        return function(seconds) {
            if (seconds == -1) {
                return 'forever';
            } else if (seconds) {
                return moment.duration(seconds, 'seconds').humanize();
            } else {
                return 'none';
            }
        };
    });

    module.filter('datesPrint', function() {
        return function(date) {
            if (date) {
                var localTime = moment.utc(date).toDate();
                return moment(localTime).format('DD/MM/YY @ HH:mm:ss');
            } else {
                return 'none';
            }
        };
    });

    module.filter('between', function() {
        return function(endDate, startDate, h) {
            if (endDate) {
                var end = moment(moment.utc(endDate).toDate()),
                    humanize = true,
                    start = moment();

                if (startDate) {
                    start = moment(moment.utc(startDate).toDate());
                }

                if(h !== undefined) {
                    humanize = h;
                }

                var duration = moment.duration(end.diff(start));

                return duration.humanize(humanize);
            } else {
                return 'none';
            }
        };
    });
})();