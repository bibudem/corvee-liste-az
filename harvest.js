import axios from 'axios'
import { JSDOM } from 'jsdom'
import readline from 'readline'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { Harvester } from 'corvee-harvester'
import { saveRecords } from './utils/index.js'
import { console, inspect } from 'corvee-core'

import config from './config/harvester.js'

const today = new Date();
const year = today.getFullYear();
const month = `${today.getMonth() + 1}`.padStart(2, '0');
const day = `${today.getDate()}`.padStart(2, '0');

const defaultJob = `${year}-${month}-${day}`;

const argv = yargs(hideBin(process.argv))
    .options({
        job: {
            alias: 'j',
            default: defaultJob,
            describe: `Job id. Defaults to today\'s date: ${defaultJob}`,
            type: 'string'
        },
        resume: {
            alias: 'r',
            default: false,
            type: 'boolean',
            describe: 'Resumes a previously stoped job. Requires --job options.',
            implies: 'j'
        }
    })
    .help()
    .parseSync();

const job = argv.job;

let internLinks = new Set()
let externLinks = new Set()

async function harvest() {

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
        if (key.ctrl && key.name === 'p') {
            if (harvester.isPaused) {
                harvester.resume();
            } else {
                harvester.pause();
            }
        }

        if (key.ctrl && key.name === 'c') {
            process.exit()
        }
    });

    console.log('Using job ' + job)

    const { data: azData } = await axios('https://libguides.bib.umontreal.ca/process/az/dblist?subject_id=&type_id=&vendor_id=&content_id=0&search=&site_id=18643&is_widget=0')

    const { document: azDOM } = (new JSDOM(azData.data.html)).window

    const links = Array
        .from(/** @type {NodeListOf<HTMLAnchorElement>} */(azDOM.querySelectorAll('#s-lg-az-results .s-lg-az-result > .s-lg-az-result-title > a[href]')))
        .map(link => ({
            url: link.href,
            text: link.firstChild?.textContent || '',
            urlData: link.getAttribute('href'),
            isNavigationRequest: true
        }))

    const harvester = new Harvester(config)

    await harvester.addUrl(links)

    harvester.on('request', function onRequest(request) {
        console.info(`[${request.retryCount}] Request url: ${request.url}`);

        if (request.extern) {
            externLinks.add(request.url)
        } else {
            internLinks.add(request.url)
        }
    })

    saveRecords(harvester, job)

    const task = argv.resume ? 'resume' : 'run';

    console.info(`Running with config: ${inspect(harvester.config)}`);

    harvester.on('start', function onStart() {
        console.info(`Running with run options: ${inspect(harvester.runOptions)}`)
    })

    harvester.on('end', function onEnd() {
        console.info(`Found ${internLinks.size} intern pages.`)
        console.info(`Found ${externLinks.size} extern pages.`)
    })

    console.log(`${task === 'resume' ? 'Resuming' : 'Running'} harvesting.`)

    try {
        await harvester[task]()
    } catch (e) {
        console.error(e)
        process.nextTick(function () {
            process.exit()
        })
    }
}

harvest();