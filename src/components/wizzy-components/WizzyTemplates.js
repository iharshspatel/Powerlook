import React, { Component } from 'react';

class WizzyTemplates extends Component {

    constructor() {
        super();
        this.state = {
            allClasses: "wizzy-autocomplete-wrapper"
        };
        this.makeAndAppendScript = this.makeAndAppendScript.bind(this);
        this.wizzySearchFiltersAutocompleteTopProducts = this.wizzySearchFiltersAutocompleteTopProducts.bind(this);
        this.wizzySearchFiltersAutocompleteSuggetions = this.wizzySearchFiltersAutocompleteSuggetions.bind(this);
        this.wizzySearchFiltersAutocompleteWrapper = this.wizzySearchFiltersAutocompleteWrapper.bind(this);
        this.wizzySearchFiltersProgress = this.wizzySearchFiltersProgress.bind(this);
        this.wizzySearchFiltersCommonSelect = this.wizzySearchFiltersCommonSelect.bind(this);
        this.wizzySearchFiltersFacetCategoryItem = this.wizzySearchFiltersFacetCategoryItem.bind(this);
        this.wizzySearchFiltersFacetBlock = this.wizzySearchFiltersFacetBlock.bind(this);
        this.wizzySearchFiltersFacetItemCommon = this.wizzySearchFiltersFacetItemCommon.bind(this);
        this.wizzySearchFiltersSelectedFacetItemCommon = this.wizzySearchFiltersSelectedFacetItemCommon.bind(this);
        this.wizzySearchFiltersFacetRangeAboveItem = this.wizzySearchFiltersFacetRangeAboveItem.bind(this);
        this.wizzySearchFiltersFacetRangeItem = this.wizzySearchFiltersFacetRangeItem.bind(this);
        this.wizzySearchFiltersSelectedFacetsBlock = this.wizzySearchFiltersSelectedFacetsBlock.bind(this);
        this.wizzySearchFiltersSearchEmptyResults = this.wizzySearchFiltersSearchEmptyResults.bind(this);
        this.wizzySearchFiltersSearchPagination = this.wizzySearchFiltersSearchPagination.bind(this);
        this.wizzySearchFiltersSearchResultsProduct = this.wizzySearchFiltersSearchResultsProduct.bind(this);
        this.wizzySearchFiltersSearchResults = this.wizzySearchFiltersSearchResults.bind(this);
        this.wizzySearchFiltersSearchSort = this.wizzySearchFiltersSearchSort.bind(this);
        this.wizzySearchFiltersSearchSummary = this.wizzySearchFiltersSearchSummary.bind(this);
        this.wizzySearchFiltersSearchWrapper = this.wizzySearchFiltersSearchWrapper.bind(this);
        this.wizzySearchFiltersCollectionEmptyResults = this.wizzySearchFiltersCollectionEmptyResults.bind(this);
    }

    makeAndAppendScript(id, inputString) {
        var wizzyMustacheTemp = document.createElement('script');
        wizzyMustacheTemp.type = "text/template";
        wizzyMustacheTemp.id = id;
        wizzyMustacheTemp.innerHTML = inputString;

        document.getElementsByTagName("body")[0].appendChild( wizzyMustacheTemp );
    }
    
    wizzySearchFiltersAutocompleteTopProducts() {
        let inputString = `<div class="wizzy-autocomplete-top-products">        <p class="top-products-title">[[topProductsTitle]]</p>        <ul class="autocomplete-top-products">            [[#products]]            <li class="topproduct-item" title="[[& name ]]" data-id="[[id]]"                [[#groupId]]data-groupId="[[groupId]]"[[/groupId]]>            <a href="[[&url]]" class="topproduct-item-link">                <div class="topproduct-item-image">                    <img src="[[ mainImage ]]" class="topproduct-image" loading="lazy" />                </div><!-- ending of topproduct-item-image -->                <div class="topproduct-item-image hover-image">                    [[#hoverImage]]                    <img src="[[ hoverImage ]]" class="topproduct-image" loading="lazy" />                    [[/hoverImage]]                    [[^hoverImage]]                    <img src="[[ mainImage ]]" class="topproduct-image" loading="lazy" />                    [[/hoverImage]]                </div><!-- ending of topproduct-item-image -->                <div class="topproduct-item-info">                    <p class="topproduct-title">[[& name ]]</p>                    [[#hasCategories]]                    <p class="topproduct-in-category">in [[&category]]</p>                    [[/hasCategories]]                    <p class="topproduct-price">                        [[#priceWithCurrency]][[ sellingPrice ]][[/priceWithCurrency]]<br>[[#price]]                        <span class="topproduct-original-price">                                    [[#priceWithCurrency]][[ price ]][[/priceWithCurrency]]                                </span>                        [[/price]]                        <span class="topproduct-item-discount">                                   [[#discountPercentage]]                                       ([[discountPercentage]]% off)                                   [[/discountPercentage]]                               </span></p>                </div><!-- ending of topproduct-item-info -->            </a><!-- ending of topproduct-item-link -->            </li><!-- ending of topproduct-item -->            [[/products]]        </ul><!-- ending of autocomplete-top-products -->    </div><!-- ending of top-products -->`
        this.makeAndAppendScript("wizzy-autocomplete-topproducts", inputString);
    }

    wizzySearchFiltersAutocompleteSuggetions() {
        let inputString = `<div class="wizzy-autocomplete-suggestions">        [[#hasSuggestions]]        <ul class="autocomplete-suggestions-list">            [[#suggestions]]            [[#isHead]]            [[#label]]            <li class="autocomplete-item-head" data-index="[[index]]">                [[&label]]            </li><!-- ending of autocomplete-item-head -->            [[/label]]            [[/isHead]]            [[^isHead]]            <li class="autocomplete-item">                <a data-selectable="true" data-searchterm="[[&searchTerm]]" href="#"                   class="autocomplete-link"                   data-index="[[index]]">                    [[#isRecentSearch]]                    <span class='wizzy-recent-search-icon'> </span>                    [[/isRecentSearch]]                    [[&label]]                    [[#hasLabelPath]]                    <ul class="autocomplete-item-path">                        <li>in</li>                        [[#labelPath]]                        <li>[[&label]]</li>                        [[/labelPath]]                    </ul>                    [[/hasLabelPath]]                    <span class="autocomplete-text-wrapper"></span>                </a><!-- ending of autocomplete-link -->            </li><!-- ending of autocomplete-item -->            [[/isHead]]            [[/suggestions]]        </ul>        [[/hasSuggestions]]        [[^hasSuggestions]]        <div class="autocomplete-no-results">            <p>No Results Found</p>        </div>        [[/hasSuggestions]]    </div><!-- ending of autocomplete-suggestions -->`;
        this.makeAndAppendScript("wizzy-autocomplete-suggestions", inputString);
    }

    wizzySearchFiltersAutocompleteWrapper() {
        let inputString = `<div class="wizzy-autocomplete-wrapper onLeft [[^topProducts]]withoutTopProducts[[/topProducts]] [[^hasSuggestions]]withoutSuggestions[[/hasSuggestions]]"         style="display: [[^isMenuHidden]]flex[[/isMenuHidden]]">        [[#topProducts]]        [[&topProducts]]        [[/topProducts]]        [[#suggestions]]        [[&suggestions]]        [[/suggestions]]        [[^suggestions]]        [[^topProducts]]        <div class="autocomplete-no-results">            <p>No Results Found</p>        </div>        [[/topProducts]]        [[/suggestions]]    </div><!-- ending of wizzy-autocomplete-wrapper -->`;
        this.makeAndAppendScript("wizzy-autocomplete-wrapper", inputString);
    }

    wizzySearchFiltersProgress() {
        let inputString = `<div class="wizzy-progress-container [[#isForFilter]][[^isPaginating]]for-filter[[/isPaginating]][[/isForFilter]]    [[#isPaginating]]for-pagination[[/isPaginating]]">        <div class="wizzy-progress">            <div class="wizzy-lds-ellipsis">                <div></div>                <div></div>                <div></div>                <div></div>            </div><!-- ending of wizzy-lds-ellipsis -->        </div><!-- ending of wizzy-progress -->    </div><!--ending of wizzy-progress-container -->    <div class="wizzy-progress-bg [[#isForFilter]][[^isPaginating]]for-filter[[/isPaginating]][[/isForFilter]]    [[#isPaginating]]for-pagination[[/isPaginating]]"></div><!-- ending of wizzy-progress-bg -->`;
        this.makeAndAppendScript("wizzy-progress", inputString);
    }

    wizzySearchFiltersCommonSelect() {
        let inputString = `<div class="wizzy-common-select-wrapper">        <div class="wizzy-common-select-container">            <div class="wizzy-common-select-overlay"></div>            <div class="wizzy-common-select-selector">            <span class="wizzy-common-select-label">                [[#label]]                [[&label]]                [[/label]]            </span>                <span class="wizzy-common-select-selectedItem">                [[&selectedItem]]            </span>            </div>            <div class="wizzy-common-select-options">                [[#items]]                <div class="wizzy-common-select-option [[#isSelected]]selected[[/isSelected]]" title="[[&label]]">                    [[&label]]                </div>                [[/items]]            </div>        </div>    </div>`;
        this.makeAndAppendScript("wizzy-common-select", inputString);
    }

    wizzySearchFiltersFacetCategoryItem() {
        let inputString = `<li class="wizzy-facet-list-item facet-category-hierarchy-item [[#isSelected]]active[[/isSelected]]"        data-key="[[ key ]]" data-term="[[& label ]]" title="[[& label ]]">        <span class="wizzy-facet-list-item-label">            <span class="wizzy-facet-list-item-checkbox">                <input type="checkbox" class="wizzy-facet-list-item-checkbox-input" [[#isSelected]]checked[[/isSelected]] />                <div class="checkbox-indicator"></div>            </span>            [[& label ]]        </span>        <span class="wizzy-facet-list-item-count">            ([[ count ]])        </span>        [[#childrenHTML]]        <ul class="wizzy-facet-list facet-child-list">            [[&childrenHTML]]        </ul>        [[/childrenHTML]]    </li>`;
        this.makeAndAppendScript("wizzy-facet-category-item", inputString);
    }

    wizzySearchFiltersFacetBlock() {
        let inputString = `<div class="wizzy-filters-facet-block facet-block-[[ divKey ]]facet-block-[[#isLeft]]left [[#leftFacetCollapsible]]collapsible[[/leftFacetCollapsible]][[#leftDefaultCollapsed]]collapsed[[/leftDefaultCollapsed]][[#firstLeftDefaultOpened]]first-opened[[/firstLeftDefaultOpened]][[/isLeft]][[^isLeft]]top[[/isLeft]]"         data-key="[[ key ]]" [[#parentKey]]data-parentKey="[[parentKey]]" [[/parentKey]]>    <div class="wizzy-facet-head facet-head-[[divKey]]" title="[[& title ]]">        <span class="facet-head-title">            [[& title ]]        </span>        <span class="facet-head-right">        </span>    </div>    <div class="wizzy-facet-body facet-body-[[divKey]]">        <div class="facet-search-wrapper">            <input type="text" class="facet-head-search-input" placeholder="Search [[ title ]]" />            [[#withSearch]]            <div class="facet-head-search">                <a href="#" class="facet-head-search-icon" title="Search [[ title ]]"></a>            </div>            [[/withSearch]]        </div>        <ul class="wizzy-facet-list">            [[#items]]            [[&html]]            [[/items]]        </ul>    </div>    </div>`;
        this.makeAndAppendScript("wizzy-facet-block", inputString);
    }

    wizzySearchFiltersFacetItemCommon() {
        let inputString = ` <li class="wizzy-facet-list-item [[#isSwatch]]facet-has-swatch[[/isSwatch]] [[#isSelected]]active[[/isSelected]]"        data-key="[[ key ]]" data-term="[[& label ]]" title="[[& label ]]">    <span class="wizzy-facet-list-item-label">    <span class="wizzy-facet-list-item-checkbox">        <input type="checkbox" class="wizzy-facet-list-item-checkbox-input" [[#isSelected]]checked[[/isSelected]] />        <div class="checkbox-indicator"></div>    </span>[[#isSwatch]]<span class="wizzy-facet-item-swatch-wrapper [[#isVisualSwatch]]facet-visual-swatch[[/isVisualSwatch]]    [[^isVisualSwatch]]facet-text-swatch[[/isVisualSwatch]]">    <span class="wizzy-facet-item-swatch [[#isVisualSwatch]]facet-visual-swatch[[/isVisualSwatch]]        [[^isVisualSwatch]]facet-text-swatch[[/isVisualSwatch]]"          style="[[#isVisualSwatch]][[#isURLSwatch]]background-image:url([[swatchValue]]);[[/isURLSwatch]]            [[^isURLSwatch]]background-color:[[swatchValue]];[[/isURLSwatch]][[/isVisualSwatch]]">        [[#value]]            <span class="wizzy-facet-swatch-individual-value">[[value]]</span>        [[/value]]        [[^isVisualSwatch]]            <span class="wizzy-facet-swatch-value">[[swatchValue]]</span>        [[/isVisualSwatch]]    </span></span>[[/isSwatch]]    <span class="facet-item-label-value">[[& label ]]</span>    </span>        <span class="wizzy-facet-list-item-count">    ([[ count ]])    </span>    </li>`;
        this.makeAndAppendScript("wizzy-facet-item-common", inputString);
    }

    wizzySearchFiltersSelectedFacetItemCommon() {
        let inputString = `<li class="wizzy-selected-facet-list-item [[#isSwatch]]facet-has-swatch[[/isSwatch]]" data-facetKey="[[facetKey]]"        data-key="[[ key ]]" data-term="[[& label ]]" title="[[& label ]]">    <span class="wizzy-selected-facet-list-item-label">        [[#isSwatch]]<span class="wizzy-facet-item-swatch-wrapper [[#isVisualSwatch]]facet-visual-swatch[[/isVisualSwatch]]    [[^isVisualSwatch]]facet-text-swatch[[/isVisualSwatch]]">    <span class="wizzy-facet-item-swatch [[#isVisualSwatch]]facet-visual-swatch[[/isVisualSwatch]]        [[^isVisualSwatch]]facet-text-swatch[[/isVisualSwatch]]"          style="[[#isVisualSwatch]][[#isURLSwatch]]background-image:url([[swatchValue]]);[[/isURLSwatch]]            [[^isURLSwatch]]background-color:[[swatchValue]];[[/isURLSwatch]][[/isVisualSwatch]]">        [[#value]]            <span class="wizzy-facet-swatch-individual-value">[[value]]</span>        [[/value]]        [[^isVisualSwatch]]            <span class="wizzy-facet-swatch-value">[[swatchValue]]</span>        [[/isVisualSwatch]]    </span></span>[[/isSwatch]]    <span class="facet-item-label-value">[[& label ]]</span>    </span>        <span class="wizzy-selected-facet-delete"></span>    </li>`;
        this.makeAndAppendScript("wizzy-selected-facet-item-common", inputString);
    }

    wizzySearchFiltersFacetRangeAboveItem() {
        let inputString = `<li class="wizzy-facet-list-item facet-aboveRange-item [[#isSelected]]active[[/isSelected]]" data-key="[[ key ]]"        data-term="[[ value ]][[&symbol]] &amp; above">    <span class="wizzy-facet-list-item-label">    <span class="wizzy-facet-list-item-checkbox">        <input type="checkbox" class="wizzy-facet-list-item-checkbox-input" [[#isSelected]]checked[[/isSelected]] />        <div class="checkbox-indicator"></div>    </span>    [[ value ]][[&symbol]] [[&sText]]    </span>        <span class="wizzy-facet-list-item-count">    ([[ count ]])    </span>    </li>`;
        this.makeAndAppendScript("wizzy-facet-range-above-item", inputString);
    }

    wizzySearchFiltersFacetRangeItem() {
        let inputString = `<li class="wizzy-facet-list-item facet-range-item" data-key="[[ key ]]" data-term="[[ label ]]">        <div class="wizzy-facet-range-slider" data-min="[[ min ]]" data-max="[[ max ]]" data-avg="[[ avg ]]">        </div>    </li>`;
        this.makeAndAppendScript("wizzy-facet-range-item", inputString);
    }

    wizzySearchFiltersSelectedFacetsBlock() {
        let inputString = `<div class="wizzy-filters-selected-facets-block">        <ul class="wizzy-selected-facet-list">            [[#items]]            [[&html]]            [[/items]]        </ul>    </div>`;
        this.makeAndAppendScript("wizzy-selected-facets-block", inputString);
    }

    wizzySearchFiltersSearchEmptyResults() {
        let inputString = `<div class="wizzy-search-empty-results-wrapper wizzy-suggestions">        <div class="wizzy-empty-results-summary">            <p>You searched for <span class="wizzy-empty-searched-query">[[ query ]]</span></p>        </div>        <div class="wizzy-empty-results-icon"></div>        <div class="wizzy-empty-results-content">            <h2>[[ title ]]</h2>            <p>Please check the spelling or try searching for something else.</p>            [[#lastRequestId]]            <p class="wizzy-req-ref-id">Ref ID: [[ lastRequestId ]]</p>            [[/lastRequestId]]        </div>        <div class="wizzy-search-wrapper">            <div class="wizzy-search-results-wrapper">                <div class="wizzy-search-results-container">                    <div class="wizzy-search-results">                        <ul class="wizzy-search-results-list">                            [[#suggestions]]                            [[& html]]                            [[/suggestions]]                        </ul><!-- ending of wizzy-search-results-list -->                    </div>                </div>            </div>        </div>    </div>`;
        this.makeAndAppendScript("wizzy-search-empty-results", inputString);
    }

    wizzySearchFiltersSearchPagination() {
        let inputString = `<div class="wizzy-pagination-container">        <ul class="wizzy-pagination-list">            <li class="[[^isPrevActive]]inactive[[/isPrevActive]] pagination-arrow previous-arrow"><a href="#"><span                            class="text">&laquo;</span></a></li>            [[#items]]            <li class="[[#isSelected]]active[[/isSelected]] [[customClass]]" title="[[ value ]]" data-page="[[value]]"><a href="#"><span                            class="text">[[ value ]]</span></a></li>            [[/items]]            <li class="[[^isNextActive]]inactive[[/isNextActive]] pagination-arrow next-arrow"><a href="#"><span                            class="text">&raquo;</span><span class="text-mobile">Show More</span></a></li>        </ul>    </div>`;
        this.makeAndAppendScript("wizzy-search-pagination", inputString);
    }

    wizzySearchFiltersSearchResultsProduct() {
        let inputString = `<li class="wizzy-result-product wizzy-product-[[id]]
        [[#groupId]]has-variations wizzy-group-product-[[groupId]][[/groupId]]"
            title="[[& name ]]" data-id="[[id]]" [[#groupId]]data-groupId="[[groupId]]"[[/groupId]]>
    
        <span class="wizzy-product-variation-loader-bg"></span>
        <span class="wizzy-product-variation-loader"></span>
    
        <a href="[[&url]]" class="wizzy-result-product-item">
            <div class="result-product-item-image">
                <img src="[[ mainImage ]]" class="product-item-image" loading="lazy" />
            </div><!-- ending of result-product-item-image -->
            <div class="result-product-item-image hover-image">
                [[#hoverImage]]
                <img src="[[ hoverImage ]]" class="product-item-image" loading="lazy"/>
                [[/hoverImage]]
                [[^hoverImage]]
                <img src="[[ mainImage ]]" class="product-item-image" loading="lazy"/>
                [[/hoverImage]]
            </div><!-- ending of result-product-item-image -->
            <div class="result-product-item-info">
                <p class="product-item-title">[[& name ]]</p>
                [[#subTitle]]
                <p class="product-item-sub-title">[[&subTitle]]</p>
                [[/subTitle]]
                [[#swatches]]
                <div class="product-item-swatch-group
                [[#isPrimary]]swatch-group-primary[[/isPrimary]] swatch-group-[[key]]"
                     data-swatchKey="[[key]]">
                    [[#values]]
                    <div data-variationId="[[variationId]]" title="[[#value]][[value]][[/value]]"
                         class="product-item-swatch-item
                        [[#isSelected]]swatch-selected[[/isSelected]]
                        [[#inStock]]swatch-in-stock[[/inStock]]">
    
                        [[#isSwatch]]
                        <span class="wizzy-facet-item-swatch-wrapper [[#isVisualSwatch]]facet-visual-swatch[[/isVisualSwatch]]
        [[^isVisualSwatch]]facet-text-swatch[[/isVisualSwatch]]">
        <span class="wizzy-facet-item-swatch [[#isVisualSwatch]]facet-visual-swatch[[/isVisualSwatch]]
            [[^isVisualSwatch]]facet-text-swatch[[/isVisualSwatch]]"
              style="[[#isVisualSwatch]][[#isURLSwatch]]background-image:url([[swatchValue]]);[[/isURLSwatch]]
                [[^isURLSwatch]]background-color:[[swatchValue]];[[/isURLSwatch]][[/isVisualSwatch]]">
             [[^swatchValue]]
                    [[#value]]
                        <span class="wizzy-facet-swatch-individual-value">[[value]]</span>
                    [[/value]]
            [[/swatchValue]]
            [[^isVisualSwatch]]
                <span class="wizzy-facet-swatch-value">[[swatchValue]]</span>
            [[/isVisualSwatch]]
        </span>
    </span>
                        [[/isSwatch]]
    
                    </div>
                    [[/values]]
                </div><!-- ending of product-item-swatch-group -->
                [[/swatches]]
                <div class="wizzy-product-item-price-reviews-wrapper">
    
                    <div class="wizzy-product-item-reviews">
                        [[#avgRatings]]
                        <span class="product-item-reviews-avgRatings">[[avgRatings]]</span><span
                                class="product-item-review-wrapper">&#x2605;</span>[[#totalReviews]]<span
                                class="product-item-reviews-totalReviews">([[totalReviews]])</span>[[/
                        totalReviews]]
                        [[/avgRatings]]
                    </div>
    
                    <div class="wizzy-product-item-price [[#hasSwatches]]with-swatches[[/hasSwatches]]">
                        [[#priceWithCurrency]][[ sellingPrice ]][[/priceWithCurrency]]
                        [[#price]]
                        <br>
                        <span class="product-item-original-price">
                                    [[#priceWithCurrency]][[ price ]][[/priceWithCurrency]]
                                </span>
                        <span class="product-item-discount">
                                    [[#discountPercentage]]
                                        ([[discountPercentage]]% off)
                                    [[/discountPercentage]]
                                </span>
                        [[/price]]
                    </div>
    
                    <div class="wizzy-product-actions">
                        <div class="product_item-actions actions">
    
                            <div class="actions-primary">
                                <div class="wizzy-product-add-to-cart">
                                    <form data-role="tocart-form" class="wizzy-tocart-form" method="post" action="/cart/add">
                                        <input type="hidden" name="id" value="[[id]]"/>
                                        <input min="1" type="hidden" id="quantity" name="quantity" value="1"/>
                                        <input type="submit" value="Add to Cart"
                                               class="wizzy-tocart-button btn button"/>
                                    </form>
                                </div>
                            </div>
    
                        </div>
                    </div><!-- ending of wizzy-product-actions -->
    
                </div><!-- ending of wizzy-product-item-price-reviews-wrapper -->
            </div><!-- ending of result-product-item-info -->
        </a><!-- ending of wizzy-result-product-item -->
        </li><!-- ending of wizzy-result-product -->`;
        this.makeAndAppendScript("wizzy-search-results-product", inputString);
    }

    wizzySearchFiltersSearchResults() {
        let inputString = `<ul class="wizzy-search-results-list">        [[#products]]        [[& html ]]        [[/products]]    </ul><!-- ending of wizzy-search-results-list -->`;
        this.makeAndAppendScript("wizzy-search-results", inputString);
    }

    wizzySearchFiltersSearchSort() {
        let inputString = `<div class="wizzy-sort-container">        <select class="wizzy-sort-select" id="wizzy-sort-select">            [[#options]]            <option value="[[ field ]]"                    data-order="[[order]]"                    [[#isSelected]]selected[[/isSelected]]>            [[ label ]]            </option>            [[/options]]        </select>    </div>`;
        this.makeAndAppendScript("wizzy-search-sort", inputString);
    }

    wizzySearchFiltersSearchSummary() {
        let inputString = ` <div class="wizzy-search-summary-container">        [[#query]]        [[#total]]        <p class="wizzy-summary-head">[[ total ]] Results found for <strong>"[[query]]"</strong>:</p>        [[/total]]        [[/query]]    </div>`;
        this.makeAndAppendScript("wizzy-search-summary", inputString);
    }

    wizzySearchFiltersSearchWrapper() {
        let inputString = `<div class="wizzy-search-wrapper [[#inOnCategoryPage]]wizzy-category-page[[/inOnCategoryPage]]
        [[#hasFacets]]has-facets[[/hasFacets]]
        [[#hasLeftFacets]]has-left-facets[[/hasLeftFacets]]
        [[#hasTopFacets]]has-top-facets[[/hasTopFacets]]">
    
            <div class="wizzy-search-summary-wrapper">
                [[#summary]]
                [[&summary]]
                [[/summary]]
            </div>
    
            <div class="wizzy-search-results-wrapper">
                [[#hasFacets]]
                <a href="#" class="wizzy-filters-mobile-entry [[^sort]]only-filters[[/sort]]">Filters</a>
                [[/hasFacets]]
    
                [[#hasLeftFacets]]
                <div class="wizzy-search-filters-left">
    
                    <div class="wizzy-filters-bg"></div>
                    <div class="wizzy-filters-close-btn"></div>
                    <div class="wizzy-filters-header">
                        <p class="header-title">Filters</p>
                        [[#hasFilters]]
                        <a href="#" class="wizzy-filters-clear-all">Clear All</a>
                        [[/hasFilters]]
                    </div>
    
                    <div class="wizzy-search-filters-left-wrapper">
                        [[#leftFacets]]
                        [[&html]]
                        [[/leftFacets]]
    
                        <div class="wizzy-search-filters-left-mobile-extra">
                        </div><!-- ending of wizzy-search-filters-left-mobile-extra -->
                    </div>
    
                </div><!-- ending of wizzy-search-filters-->
                [[/hasLeftFacets]]
    
                <div class="wizzy-search-results-container">
    
                    <div class="wizzy-search-filters-top">
    
                        <div class="search-filters-top-wrapper">
                            <div class="wizzy-search-filters-list-top">
                                [[#topFacets]]
                                [[&html]]
                                [[/topFacets]]
    
                            </div><!-- ending of wizzy-search-filters-list-top -->
    
                            <div class="wizzy-search-sort-wrapper">
                                [[#sort]]
                                [[&sort]]
                                [[/sort]]
                            </div><!-- ending of wizzy-search-sort-wrapper -->
                        </div><!-- ending of search-filters-top-wrapper-->
    
                        <div class="filters-list-top-values-wrapper">
    
                        </div><!-- ending of filters-list-top-values-wrapper -->
    
                        <div class="wizzy-selected-filters">
                            [[&selectedFacets]]
                        </div><!-- ending of wizzy-selected-filters -->
    
                    </div><!-- ending of wizzy-search-filters-->
    
                    <div class="wizzy-search-results">
                        [[& products ]]
                    </div><!-- ending of wizzy-search-filters-->
    
                    <div class="wizzy-search-pagination">
                        [[& pagination ]]
                    </div>
    
                </div><!-- ending of wizzy-search-results-->
    
            </div><!-- ending of wizzy-search-results-container -->
        </div><!-- ending of wizzy-search-wrapper-->
    
        [[#addMoveToTopWidget]]
        <div class="wizzy-scroll-to-top-wrapper">
            <div class="wizzy-scroll-to-top-button">
    
            </div><!-- ending of wizzy-scroll-to-top-button -->
        </div><!-- ending of wizzy-scroll-to-top-wrapper -->
        [[/addMoveToTopWidget]]`;
        this.makeAndAppendScript("wizzy-search-wrapper", inputString);
    }

    wizzySearchFiltersCollectionEmptyResults() {
        let inputString = `<div class="wizzy-search-empty-results-wrapper wizzy-suggestions">        <div class="wizzy-empty-results-icon"></div>        <div class="wizzy-empty-results-content">            <h2>[[ title ]]</h2>                       [[#lastRequestId]]            <p class="wizzy-req-ref-id">Ref ID: [[ lastRequestId ]]</p>            [[/lastRequestId]]        </div>        <div class="wizzy-search-wrapper">            <div class="wizzy-search-results-wrapper">                <div class="wizzy-search-results-container">                    <div class="wizzy-search-results">                        <ul class="wizzy-search-results-list">                            [[#suggestions]]                              [[& html]]                            [[/suggestions]]                        </ul><!-- ending of wizzy-search-results-list -->                    </div>                </div>            </div>        </div>    </div>`;
        this.makeAndAppendScript("wizzy-collection-empty-results", inputString);
    }

    componentDidMount() {
        this.wizzySearchFiltersAutocompleteTopProducts();
        this.wizzySearchFiltersAutocompleteSuggetions();
        this.wizzySearchFiltersAutocompleteWrapper();
        this.wizzySearchFiltersProgress();
        this.wizzySearchFiltersCommonSelect();
        this.wizzySearchFiltersFacetCategoryItem();
        this.wizzySearchFiltersFacetBlock();
        this.wizzySearchFiltersFacetItemCommon();
        this.wizzySearchFiltersSelectedFacetItemCommon();
        this.wizzySearchFiltersFacetRangeAboveItem();
        this.wizzySearchFiltersFacetRangeItem();
        this.wizzySearchFiltersSelectedFacetsBlock();
        this.wizzySearchFiltersSearchEmptyResults();
        this.wizzySearchFiltersSearchPagination();
        this.wizzySearchFiltersSearchResultsProduct();
        this.wizzySearchFiltersSearchResults();
        this.wizzySearchFiltersSearchSort();
        this.wizzySearchFiltersSearchSummary();
        this.wizzySearchFiltersSearchWrapper();
        this.wizzySearchFiltersCollectionEmptyResults();

    }

  render() {
    const { allClasses } = this.state;
    const first = 'wizzy-autocomplete-wrapper';
    // const second = 'onLeft';
    return (
        <div className="wizzy-body-end-wrapper">
            <div className="wizzy-autocomplete-wrapper" style={{display: 'none', top: '156px', right: '110px', opacity: 0}}></div>
        </div>
    );
  }
}

export default WizzyTemplates;
