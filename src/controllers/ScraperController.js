import puppeteer from 'puppeteer'
import {searchInPage} from '../services/scrapper/scraper.js'


const ScraperController = {

    index: async (req,res) => {
        
        var response = [], url = ''
        const { search, market, pages } = req.params
        const { AMAZON_URL, ML_URL } = process.env

        var options
        switch(market) {
            case 'amazon':
                url = AMAZON_URL
                options = {
                    inputSearchWay: '#twotabsearchtextbox',
                    searchText: search,
                    productWay: 'div > span > div > div.a-spacing-medium',
                    productNameWay: 'span.a-text-normal',
                    productPriceWay: '.a-price-whole',
                    currentPaginationWay: '.a-selected',
                    pages
                }
                break
            case 'mercado_livre':
                url = ML_URL
                options = {
                    inputSearchWay: 'input.nav-search-input',
                    searchText: search,
                    productWay: '.andes-card',
                    productNameWay: '.ui-search-item__title',
                    productPriceWay: '.price-tag-fraction',
                    currentPaginationWay: '.andes-pagination__button--current',
                    pages
                }
                break
            default:
                return false
        }

        const browser = await puppeteer.launch({
            headless: false,
            product: 'chrome'
        })
        const page = await browser.newPage()
        await page.goto(url)
        
        searchInPage(page, options)
        .then(data => {
            browser.close()
            res.json(data)
        })
        
    }
}

export default ScraperController