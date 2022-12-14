export default {
  code: 'friendly-url',
  level: 'error',
  test: (/** @type {import('corvee-harvester').RecordType} */ record) => !record.url.startsWith('https://libguides.bib.umontreal.ca/')
}