import React, { Component } from 'react';
import Helmet from 'react-helmet';
import {MEDIA_BASE} from '../constants';

class MetaData extends Component {

    render() {
        const {data} = this.props;

        let reviews = [];
        if(data.reviews  && data.reviews[3]){
          data.reviews[3].map(review => {
            reviews.push({
              "@type": "Review",
              "name": review.title,
              "reviewBody": review.detail,
              "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.ratingSummary
              },
              "datePublished": review.created_at,
              "author": {"@type": "Person", "name": review.nickname}
            });
          });
        }
        
        const jsonLd = typeof data.product !== 'undefined' 
                      ? 
                      {
                        "@context": "https://schema.org/", 
                        "@type": "Product", 
                        "name": data.productName,
                        "image": ((data) => {
                                    if(typeof data.mediaGallery.images === 'undefined'){
                                      return '';
                                    }
                                    const d = Object.values(data.mediaGallery.images).filter((item) => {
                                      return item.styleimage_default === 'undefined' || item.styleimage_default != '1'
                                    });

                                    return d.length > 0 ? `${MEDIA_BASE}/catalog/product/${d[0].file}` : '';
                                  }
                        )(data),
                        "description": data.productDetail ? data.productDetail : '',
                        "sku": data.product.sku,
                        "offers": {
                          "@type": "AggregateOffer",
                          "url": "",
                          "priceCurrency": "INR",
                          "lowPrice": typeof data.product.finalprice !== 'undefined' && parseFloat(data.product.finalprice) > 0 && parseFloat(data.product.finalprice) != parseFloat(data.product.price) ? data.product.finalprice : data.product.price, 
                          "highPrice": data.product.price
                        },
                        "aggregateRating": {
                          "@type": "AggregateRating",
                          "ratingValue": data.overallRatingSummary.toFixed(1),
                          "ratingCount": data.reviewCounts,
                          "reviewCount": data.reviewCounts
                        },
                        "review": reviews
                      } 
                      : 
                      null;
        return (
            <Helmet>
              {
                typeof data.title !== 'undefined'
                &&
                <title>{data.title}</title>
              }
              {
                typeof data.description !== 'undefined'
                &&
                <meta name="description" content={data.description} />
              }
              {
                typeof data.keyword !== 'undefined'
                &&
                <meta name="keywords" content={data.keyword} />
              }
              {
                typeof data.product !== 'undefined'
                &&
                <script type="application/ld+json">
                  {`${JSON.stringify(jsonLd)}`}
                </script>
              }
            </Helmet>
        );
    }
}

export default MetaData;
