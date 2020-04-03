
/*
 * Helps manipulate date objects
 */
class DateService {

	/*
	 * Returns the current date in a string format
	 */
    GetCurrentDate() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        return date;
    }

	/*
	 * Returns the current time in a string format
	 */
    GetCurrentTime() {
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        return time;
    }

	/*
	 * Returns the current date time in a string format
	 */
    GetCurrentDateTime() {
        var date = this.GetCurrentDate();
        var time = this.GetCurrentTime();
        var dateTime = date + ' ' + time;
        return dateTime;
    }
}

module.exports = DateService