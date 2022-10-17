export default {
  code: 'friendly-url',
  level: 'error',
  test: (record) => !record.url.startsWith('https://libguides.bib.umontreal.ca/')
}