import React, { Component } from 'react';
import StarRatings from 'react-star-ratings';
import moment from 'moment';
import { STARRATING } from '../../constants.js';
import { Link } from 'react-router-dom';
import '../../slick.js';
import '../../slick.css';
import "./ReviewHome.css";


class ReviewHome extends Component {
    constructor(props) {
        super(props);
        this._unMounted = false;
        this.state = {
            reviews: [],
            avg_count: 0,
            based_on_total_review: 0,
            review_count: 0,
            review_main_title: 0,
            loading: true,
            id: Math.floor((Math.random() * 10) + 1)
        }
    }

    componentDidUpdate(nextProps) {
        const $ = window.$$;
        const classId = '.reviewslider-main' + this.state.id
        if ($(classId).length > 0 && !$(classId + '.slick-initialized').length) {
            $(classId).slick({
                autoplay: true,
                autoplaySpeed: 3000,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 3,
                dots: false,
                swipeToSlide: true,
                arrows: true,
                speed: 600,
                easing: 'ease',
                prevArrow: $('.prev-review' + this.state.id),
                nextArrow: $('.next-review' + this.state.id),
                responsive: [
                    {
                        breakpoint: 767.98,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 1,
                            arrows: false,
                        }
                    },
                    {
                        breakpoint: 991,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: false,
                        }
                    }
                ]
            });
        }

        if (!this.state.reviews || (this.state.reviews && this.state.reviews.length === 0)) {
            const rews = Object.keys(nextProps.reviews).filter((r, i) => Number(r) === i).map((r) => nextProps.reviews[Number(r)])
            const reviewData = rews.map(r => {
                return {
                    ...r,
                    createdAt: moment(r.created_at).format("DD/MM/YYYY")
                }
            })
            this.setState({
                reviews: reviewData,
                avg_count: Math.round(Number(nextProps.reviews.avg_count.split("/")[0])),
                based_on_total_review: nextProps.reviews.based_on_total_review,
                review_count: nextProps.reviews.avg_count,
                review_main_title: nextProps.title
            })
            setTimeout(() => {
                this.setState({ loading: false })
            }, 2000)
        }
    }

    componentWillUnmount() {
        this._unMounted = true;
    }

    render() {
        const { reviews, avg_count, review_count, based_on_total_review, review_main_title, loading, id } = this.state;
        return (
            reviews && reviews.length > 0 && !loading &&
            <>
                <div className="heading-block">
                    <div className="container">
                        <h2 data-aos="fade-up" data-aos-delay="100">{review_main_title || "Review "}</h2>
                        <div className="head-line aos-init aos-animate" data-aos="fade-up" data-aos-delay="300"></div>
                    </div>
                </div>
                <div className='review-homesection'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-3'>
                                <div className='review-hometitle'>

                                    <div className='heading-block m-0 '>
                                        <h2>Our customers</h2>
                                        <p>OUR INFLUENCERS</p>
                                    </div>
                                    <p className="tagline">
                                        <span>{review_count}</span> based on {based_on_total_review} reviews.
                                    </p>
                                    <div className='star-rating-rev'>
                                        <StarRatings
                                            starRatedColor={STARRATING.color}
                                            starEmptyColor={STARRATING.color}
                                            numberOfStars={avg_count}
                                            starDimension="20px"
                                            starSpacing="0"
                                            name='rating'
                                        />
                                    </div>
                                    <p className='des-btn-review'><Link className='btn-border' to={"/reviews/detail"}>
                                        <span>See More</span><i className="icon-arrow-righ-v1"></i>
                                    </Link></p>
                                </div>
                            </div>
                            <div className='col-md-9'>
                                <div className='review-slidersection'>
                                    <div className="review-sliderin">
                                        <div className={"reviewslider-main" + id}>
                                            {
                                                reviews.map((r) => {
                                                    return <div key={r.review_id} className='review-slideitem'>
                                                        <div className='starrating-slide'>
                                                            <StarRatings
                                                                starRatedColor={STARRATING.color}
                                                                numberOfStars={r.ratingSummary}
                                                                starDimension="20px"
                                                                starSpacing="0"
                                                                name='rating'
                                                            />
                                                        </div>
                                                        <div className='review-detaild'>
                                                            <h6>{r.title}
                                                            </h6>
                                                            <div dangerouslySetInnerHTML={{ __html: r.detail }} ></div>
                                                        </div>
                                                        <div className='review-byperson'>
                                                            <h6>{r.author}</h6>
                                                            <p>{r.product_name}
                                                            </p>
                                                            <span>{r.createdAt}</span>
                                                        </div>
                                                    </div>

                                                })
                                            }
                                        </div>
                                        <div className="paginator-center text-center">
                                            <ul>
                                                <li className={"prev-review prev-review" + this.state.id}></li>
                                                <li className={"next-review next-review" + this.state.id}></li>
                                            </ul>
                                            <p className='mt-3 mob-btn-review'><Link className='btn-border' to={"/reviews/detail"}>
                                                <span>See More</span><i className="icon-arrow-righ-v1"></i>
                                            </Link></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default ReviewHome;
