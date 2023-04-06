import React, { useEffect, useState } from 'react';
import "./Reviews.css"
import { STARRATING } from '../../constants.js';
import { getAllReviews } from '../../actions/products';
import InfinitScroll from 'react-infinite-scroll-component'
import moment from 'moment';
import Header from '../Header';
import Footer from '../Footer';
import ReactStars from "react-rating-stars-component";
import ContentLoader from '../ContentLoader';

const Reviews = () => {

    const rating = {
        size: 20,
        edit: false,
        count: STARRATING.stars,
        activeColor: STARRATING.color,
        color: "#e9ecef"
    }

    const [loading, setLoading] = useState(false)

    const [page, setPage] = useState(1)

    const [data, setData] = useState({
        product_reviews: [],
        reviews_data: {},
        review_bar_data: []
    })

    useEffect(() => {
        setLoading(true)
        fetchAllReviews();
    }, [])

    const getReviewData = (rating, c1, state, c2, c3, c4, c5) => {
        return [
            {
                rating: {
                    ...rating,
                    value: c1
                },
                percentage: state.reviews_data['1_star_percentage'],
                count: state.reviews_data['1_star_count']
            },
            {
                rating: {
                    ...rating,
                    value: c2
                },
                percentage: state.reviews_data['2_star_percentage'],
                count: state.reviews_data['2_star_count']
            },
            {
                rating: {
                    ...rating,
                    value: c3
                },
                percentage: state.reviews_data['3_star_percentage'],
                count: state.reviews_data['3_star_count']
            },
            {
                rating: {
                    ...rating,
                    value: c4
                },
                percentage: state.reviews_data['4_star_percentage'],
                count: state.reviews_data['4_star_count']
            },
            {
                rating: {
                    ...rating,
                    value: c5
                },
                percentage: state.reviews_data['5_star_percentage'],
                count: state.reviews_data['5_star_count']
            }
        ];
    }

    const fetchAllReviews = async (page = 1) => {
        setPage(page);
        try {
            let res = await getAllReviews(page);
            const state = Object.assign({}, data)
            state.reviews_data = res.data[0].reviews_data
            const c1 = Math.round((5 * state.reviews_data['1_star_percentage']) / 100)
            const c2 = Math.round((5 * state.reviews_data['2_star_percentage']) / 100)
            const c3 = Math.round((5 * state.reviews_data['3_star_percentage']) / 100)
            const c4 = Math.round((5 * state.reviews_data['4_star_percentage']) / 100)
            const c5 = Math.round((5 * state.reviews_data['5_star_percentage']) / 100)
            state.reviews_data.rating = {
                ...rating,
                value: Number(res.data[0].reviews_data.avg_count.split("/")[0])
            }
            const reviewData = getReviewData(rating, c1, state, c2, c3, c4, c5);
            state.review_bar_data = reviewData.sort((a, b) => b.percentage - a.percentage);
            if (res && res.data && res.data[0] && res.data[0].product_reviews) {
                const dat = res.data[0].product_reviews.map(r => {
                    return {
                        ...r,
                        'createdAt': moment(r.created_at).format("DD/MM/YYYY"),
                        rating: {
                            ...rating,
                            value: r.ratingSummary
                        }
                    }
                })
                state.product_reviews.push(...dat)
            }
            setData(state)
            setLoading(false)
        } catch (error) {
            console.error("ERROR IN FETCHING REVIEWS, error cause: ", error)
        }
    }

    return (
        <div className="main-wrapper">
            <Header />
            <div className='reviews-page'>
                <div className='container'>
                    <h4 className='text-center'>Reviews</h4>

                    <div className='loader-reviewpage'>
                        {
                            loading ? <ContentLoader /> :
                                <div className='row'>
                                    <div className='col-md-12'>
                                        {
                                            data && data.reviews_data.based_on_total_review ?
                                                <div className='review-page-pading'>
                                                    <div className="rating-review-progress">
                                                        <div className='review-rating-head'>
                                                            {
                                                                data && data.reviews_data.based_on_total_review ?
                                                                    <>
                                                                        <ReactStars {...data.reviews_data.rating} />
                                                                        <p>Based on {data.reviews_data.based_on_total_review} reviews </p>
                                                                    </> : null
                                                            }
                                                        </div>
                                                        <div className='rating-progressbar'>
                                                            {
                                                                data.review_bar_data && data.review_bar_data.length > 0 ?
                                                                    data.review_bar_data.map(d => {
                                                                        return (
                                                                            <div key={d.rating.percentage} className='rating-progress-flex'>
                                                                                <div className='star-points-bar'>
                                                                                    {
                                                                                        d.rating && <ReactStars {...d.rating} />
                                                                                    }
                                                                                </div>
                                                                                <div className='rating-bar-detaild'>
                                                                                    <div className="progress">
                                                                                        <div className="progress-bar bg-warning" role="progressbar"
                                                                                            style={{ width: d.percentage + '%' }}
                                                                                            aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                                                                    </div>
                                                                                </div>
                                                                                <p>{d.percentage}%</p>
                                                                                <p className='rating-usercount'>({d.count})</p>
                                                                            </div>
                                                                        )
                                                                    }) : null
                                                            }
                                                        </div>
                                                    </div>

                                                    <div className='reviewd-person-main'>
                                                        <InfinitScroll
                                                            dataLength={data.product_reviews.length}
                                                            next={() => fetchAllReviews(page + 1)}
                                                            hasMore={true}
                                                            loader={<h4>Loading ... </h4>}
                                                        >
                                                            {
                                                                data.product_reviews &&

                                                                data.product_reviews.map(r => {
                                                                    return <div key={r.review_id} className='reviewd-profile-item'>
                                                                        <div className='reviewd-profileflex'>
                                                                            <div className='review-profile-img'>
                                                                                {r.author[0].toUpperCase()}
                                                                                {/* <img src='https://pixlok.com/wp-content/uploads/2021/02/profile-Icon-SVG.jpg' /> */}
                                                                            </div>
                                                                            <div className='reviewd-profile-contnt'>
                                                                                <div className='rating-withperson'>
                                                                                    <ReactStars {...r.rating} />
                                                                                    <p>{r.createdAt}</p>
                                                                                    <p>about</p>
                                                                                    <p>{r.product_name}</p>
                                                                                </div>
                                                                                <div className='review-verifiedstatus'>
                                                                                    {/* <label>Verified</label> */}
                                                                                    <h6>{r.author}</h6>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className='reviewd-person-desc'>
                                                                            <h6>{r.title}</h6>
                                                                            <div dangerouslySetInnerHTML={{ __html: r.detail }}></div>
                                                                        </div>
                                                                    </div>
                                                                })
                                                            }
                                                        </InfinitScroll>
                                                    </div>
                                                </div> : null
                                        }
                                    </div>
                                </div>
                        }
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Reviews;


