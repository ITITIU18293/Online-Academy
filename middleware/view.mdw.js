const exphbs = require('express-handlebars');
const hbs_sections = require('express-handlebars-sections');
const numeral = require('numeral');

module.exports = function (app) {
    // VIEW ENGINE
    app.engine('hbs', exphbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        layoutsDir: 'views/_layouts',
        partialsDir: 'views/_partials',
        helpers: {
            section: hbs_sections(),
            format(val) {
                return numeral(val).format('0,0') + ' VND';
            },
            
            isUndefined(value) {
                return value === undefined;
            },
            thumbImage(value) {
                return value + "-thumbs.png"
            },
            largeImage(value) {
                return value + ".png"
            },
            isZero(value) {
                return value === 0;
            },
            isAdmin(value) {
                return value === 0;
            },
            isUser(value) {
                return value === 1;
            }, 
            isLecturer(value) {
                return value === 2;
            },

            subArray(value, number) {
                return value.slice(4 * number, 4 * number + 4);
            }
        }
    }));
    app.set('view engine', 'hbs');
}