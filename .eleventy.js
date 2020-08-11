module.exports = function(eleventyConfig) {

    const defaultLocale = 'fr';

    // Copy static files and media files in content folders
    eleventyConfig.addPassthroughCopy('favicon.png');
    eleventyConfig.addPassthroughCopy('static');
    eleventyConfig.addPassthroughCopy('ui-design/**/*.(png|jpg|gif)');
    eleventyConfig.addPassthroughCopy('games/**/*.(png|jpg|gif|mp4)');
    eleventyConfig.addPassthroughCopy('3d-works/**/*.(png|jpg|gif|mp4)');

    // Removes the lang from a given URL (for example, to access media files in default lang folder)
    eleventyConfig.addFilter('removelang', function(value) {
        return value.replace(/(en|jp)\//, '');
    });

    // Returns the absolute URL for a given file in the current page's folder (thus removing the lang)
    eleventyConfig.addFilter('selfurl', function(value) {
        value = (value.startsWith('./')) ? value.slice(2) : value;
        return this.ctx.page.url.replace(/(en|jp)\//, '') + value;
    });

    // Returns the absolute URL of a page in another given language
    eleventyConfig.addFilter('locurl', function(value, locale) {
        if (/(en|jp)\//.exec(value) != null) {
            if (locale != defaultLocale) {
                return value.replace(/(en|jp)\//, `${locale}/`);
            } else {
                return value.replace(/(en|jp)\//, '');
            }
        } else {
            if (locale != defaultLocale) {
                return `/${locale}${value}`.replace(/\/\/$/g, '/');
            } else {
                return `${value}`.replace(/\/\/$/g, '/');
            }
        }
    });

    // Tells Eleventy the URL of each page, depending on its locale
    eleventyConfig.addShortcode('getPermalink', function(locale, filePathStem) {
        let [_, path, filename] = filePathStem.match(/^(.*[\\\/])(.*)/);
        path = path.replace(/\+?(en|jp)/, '');
        filename = filename.replace(/\+?(en|jp)/, '');
        
        if (filename != 'index') {
            path += filename + '/';
        }
        const prefix = (locale != defaultLocale) ? `/${locale}` : '';
        return `${prefix}${path}`;
    });

    // Custom collections for the "games" pages as I want them ordered by a custom field
    eleventyConfig.addCollection('games_fr', function(collectionApi) {
        return collectionApi.getFilteredByTag('game_fr').sort((a, b) => a.data.order < b.data.order);
    });

    eleventyConfig.addCollection('games_en', function(collectionApi) {
        return collectionApi.getFilteredByTag('game_en').sort((a, b) => a.data.order < b.data.order);
    });

    eleventyConfig.addCollection('games_jp', function(collectionApi) {
        return collectionApi.getFilteredByTag('game_jp').sort((a, b) => a.data.order < b.data.order);
    });
};