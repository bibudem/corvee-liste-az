import { openSync, writeSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'


const today = new Date();
const year = today.getFullYear();
const month = `${today.getMonth() + 1}`.padStart(2, '0');
const day = `${today.getDate()}`.padStart(2, '0');

const defaultJob = `${year}-${month}-${day}`;

export async function toCsv({
    job = defaultJob,
    dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'data'),
    data
} = {}) {

    // const job = prefix.replace(/-/g, '');

    const eol = '\n';

    const outFilePath = join(dir, `${job}_processed.csv`);
    const outFile = openSync(outFilePath, 'w');
    const headers = [...data.reduce((keys, item) => {
        Object.keys(item).forEach(key => {
            if (!key.startsWith('_')) {
                keys.add(key);
            }
        });
        return keys;
    }, new Set())];

    console.log('headers: ' + headers.join(', '))

    // outFile.on('open', () => {
    //     outFile.write(`"${headers.join('","')}"`);
    //     write(data);
    // })

    function csvItemToString(str = '') {
        if (str === null) {
            str = '';
        }
        return `"${('' + str).replace('\n', ' ').replace('"', '""')}"`
    }

    function arrayPropsToString(arr) {
        return `${arr.map(item => csvItemToString(item)).join(',')}${eol}`;
    }

    function write(data) {
        data.forEach(item => {

            const dataItem = [];

            headers.forEach(key => {
                // let value = '';
                // if (key in item) {
                //     value = csvItemToString(item[key]);
                // }
                dataItem.push(item[key]);
            })

            writeSync(outFile, arrayPropsToString(dataItem));

        });
    }

    writeSync(outFile, `"${headers.join('","')}"${eol}`);
    write(data)
}