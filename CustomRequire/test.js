const customRequire = require('./index.js');

(async function() {
    const { collection } = await customRequire('./module.js', {});
    console.log(collection);
})();


