const authMiddleware = require('../routes/controllers/auth');

module.exports = function (app) {
    // DEFAULT
    app.use('/', require('../routes/index.route'));

    // ROUTE ĐĂNG NHẬP ĐĂNG KÍ
    app.use('/auth', require('../routes/auth.route'));

    // ROUTE THAO TÁC VỚI TỪNG TÀI KHOẢN
    app.use('/admin/', authMiddleware.adminAuthenticated, require('../routes/admin.route'));
    app.use('/categories/',authMiddleware.adminAuthenticated, require('../routes/category.route'));
    app.use('/categories1/',authMiddleware.adminAuthenticated, require('../routes/category1.route'));
    app.use('/courses/', require('../routes/course.route'));
    app.use('/users/', authMiddleware.ensureAuthenticated, require('../routes/user.route'));
    app.use('/lecturer/', require('../routes/lecturer.route'));

}