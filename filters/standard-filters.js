import { filters as _, messagesFrCA } from 'corvee-processor'

export const standardFilters = [
    _.http30xAllTempRedirects,
    _.http30xPermanentRedirectSuccessfull,
    _.http30xPermanentRedirectFailure,
    {
        ..._.http30xCircularRedirection,
        exclude: true // KEEP
    },
    {
        ..._.http30xMissingSlash,
        exclude: true // KEEP
    },
    _.http30xHttpsUpgradeAny,
    new _.http30xHttpsUpgradeLoose({
        ignoreWww: true
    }),
    new _.http30xHttpsUpgradeStrict({
        ignoreWww: false,
        level: 'info',
        limit: 1000,
        // exclude: true
    }),
    _.http30xWelcomePage,
    _.http307HSTSRedirect,

    _.netSystem,
    _.netConnection,
    _.netCertificate,
    _.netHttp,
]

export const standardMessages = messagesFrCA;