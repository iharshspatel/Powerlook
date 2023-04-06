const express = require('express');
const fs = require("fs");
const app = express();
const axios = require("axios");

const API_URLL = process.env.API_URL + "/rest/default/V1";
const INDEX_PATH = process.env.INDEX_PATH + "";
const PUBLIC_PATH = process.env.PUBLIC_PATH + "";

const PORT = process.env.PORT || 8080;
const indexPath = INDEX_PATH;

app.get('/', (req, res, next) => {
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        try {
            const response = await axios(`${API_URLL}/meta/details?type=cms_page&section=home`)
            htmlData = getData(response, htmlData);
        } catch (error) {
            console.log("ERROR :: ", error)
            return res.send(htmlData);
        }

        return res.send(htmlData);
    })
})

app.get('/service-worker.js', (req, res) => {
    res.send(`importScripts('https://widgets.in.webengage.com/js/service-worker.js');`)
})

// static resources should just be served as they are
app.use(express.static(PUBLIC_PATH, { maxAge: '30d' },
));

app.get("/product-category/:category_slug/:sub_category_slug", (req, res, next) => {
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        try {
            const slugg = req.params.sub_category_slug ? req.params.sub_category_slug : req.params.category_slug;
            const response = await axios(`${API_URLL}/meta/details?type=category_page&section=${slugg}`);
            htmlData = getData(response, htmlData);
        } catch (error) {
            console.log("ERROR ", error.message)
            return res.send(htmlData);
        }
        return res.send(htmlData);
    })
})

app.get("/product-category/:category_slug/", (req, res, next) => {
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        try {
            const slugg = req.params.category_slug;
            const response = await axios(`${API_URLL}/meta/details?type=category_page&section=${slugg}`);
            htmlData = getData(response, htmlData);
        } catch (error) {
            console.log("ERROR ", error.message)
            return res.send(htmlData);
        }
        return res.send(htmlData);
    })
})

app.get("/shop/:category_slug/:productName", (req, res, next) => {
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        try {
            const productDetailResponse = await axios(`${API_URLL}/product/${req.params.productName}`)
            const { data: productDetail } = productDetailResponse;
            const response = await axios(`${API_URLL}/meta/details?type=product_page&section=${productDetail[0].sku}`);
            htmlData = getData(response, htmlData);
        } catch (error) {
            console.log("ERROR ", error.message)
            return res.send(htmlData);
        }
        return res.send(htmlData);

    })

});

app.get("*", (req, res, next) => {
    fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
        try {
            const response = await axios(`${API_URLL}/meta/details?type=cms_page&section=${req.url.split("/")[1]}`);
            if (response && response.data && response.data.length > 0) {
                htmlData = getData(response, htmlData);
            }
        } catch (error) {
            console.log("ERROR ", error.message)
            return res.send(htmlData);
        }
        return res.send(htmlData);
    })
});

// listening...
app.listen(PORT, (error) => {
    if (error) {
        return console.log('Error during app startup', error);
    }
    console.log("listening on " + PORT + "...");
});

function getData(response, htmlData) {
    const { data } = response;
    if (data) {
        htmlData = htmlData
            .replace(`<title>Powerlook - Men's Fashion</title>`, `<title>${data[0].meta_title}</title >`)
            .replace(
                '__TITLE__', data[0].meta_title
            )
            .replace(
                '__META_TITLE__', data[0].meta_title
            ).replace(
                '__META_DESCRIPTION__', data[0].meta_description
            ).replace(
                '__META_KEYWORD__', data[0].meta_keywords
            ).replace(
                '__META_CANONICAL_URL__', data[0].canonical_url);
    } else {
        htmlData = htmlData
            .replace(
                '__TITLE__', ''
            )
            .replace(
                '__META_TITLE__', ''
            ).replace(
                '__META_DESCRIPTION__', ''
            ).replace(
                '__META_KEYWORD__', ''
            ).replace(
                '__META_CANONICAL_URL__', '');
    }
    return htmlData;
}
