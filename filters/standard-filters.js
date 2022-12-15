import { filters as _, messagesFrCA } from 'corvee-processor'

export const standardFilters = [
    _.http30xAllTempRedirects,
    new _.Http30xPermanentRedirectSuccessful(),
    _.http30xPermanentRedirectFailure,
    {
        ..._.http30xCircularRedirection,
        exclude: true // KEEP
    },
    {
        ..._.http30xSlash,
        exclude: true // KEEP
    },
    _.http30xHttpsUpgradeAny,
    new _.Http30xHttpsUpgradeLoose({
        ignoreWww: true
    }),
    new _.Http30xHttpsUpgradeStrict({
        ignoreWww: false,
        level: 'error',
    }),
    _.http30xRedirectToWelcomePage,
    _.http307HSTSRedirect,

    _.netSystem,
    _.netConnection,
    _.netCertificate,
    _.netHttp,
]

export const standardMessages = messagesFrCA;