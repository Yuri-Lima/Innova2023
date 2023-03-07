/**
 * Description: This function replaces the placeholders in a string with the data provided
 * @param str 
 * @param data 
 * @returns 
 */
function stringInjections(str: string, data: Array<any> | any): string | boolean | undefined{
    if (typeof str === 'string' && (data instanceof Array)) {
        return str.replace(/({\d})/g, function(i: any) {
            return data[i.replace(/{/, '').replace(/}/, '')]; // replace {0} with data[0]
        });
    }else if (typeof str === 'string' && (data instanceof Object)) {

        if (Object.keys(data).length === 0) {
            return str; // if data is an empty object, return the string
        }

        for (let key in data) {
            return str.replace(/({([^}]+)})/g, function(i: any) {
                key = i.replace(/{/, '').replace(/}/, ''); // remove { and } from the string
                if (!data[key]) { // if data[key] is undefined or null
                    return i;
                }

                return data[key]; // replace {key} with data[key]
            });
        }
    } else if (typeof str === 'string' && data instanceof Array === false || typeof str === 'string' && data instanceof Object === false) {
        return str; // if data is not an array or object, return the string
    } else {
        return false; // if str is not a string, return false
    }
}

export default stringInjections;