const lodash = require('lodash')


const analysisFunction = async () => {
    const response = await fetch(process.env.REQUEST_URL, {
        method: 'GET',
        headers: {
            'x-hasura-admin-secret': process.env.REQUEST_URL_SECRET,
        },
    });

    if (!response.ok) {
        return
    }

    const blogs = await response.json();

    const totalBlogs = lodash.size(blogs.blogs);
    const longestTitle = lodash.maxBy(blogs.blogs, (blog) => blog.title.length);
    const privacyTitle = lodash.filter(blogs.blogs, (blog) =>
        blog.title.includes('Privacy') || blog.title.includes('privacy')
    );
    const totalBlogsWithPrivacyTitle = lodash.size(privacyTitle);

    const uniqueBlogTitles = lodash.uniqBy(blogs.blogs, 'title').map((blog) => blog.title);

    const stats = {
        "total": totalBlogs,
        "longestTitle": longestTitle.title,
        "privacyKeyword": totalBlogsWithPrivacyTitle,
        "uniqueTitle": uniqueBlogTitles
    }

    return stats
}

const analysis = lodash.memoize(analysisFunction, (...args) => lodash.values(args).join("_"));

const blogAnalysis = async (req, res, next) => {


    const stats = await analysis()

    if (!stats) {
        res.json({ "success": false, "msg": "API is unavailable" })
    }

    req.stats = stats
    next()
}

module.exports = blogAnalysis