import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import classes from './MostPopular.css';

import Spinner from '../../CommonComponents/Spinner/Spinner';
import apiUrl from '../../../Services/apiUrls';

const MostPopular = React.memo((props) => {
    
    const [ mostViewed, setMostViewed ]     = useState([]);
    const [ storiesLimit, setStoriesLimit ] = useState(5);
    const [ isLoading, setLoading ]         = useState(false);

    const getMostViewed = useCallback(() => {
        setLoading(true);
        axios.get(apiUrl.mostViewed)
        .then((response) => {
            setMostViewed(response.data.results);
            setLoading(false); 
        })
        .catch((error) => {
            console.log(error);
            setLoading(false); 
        })
    }, [mostViewed, setMostViewed, setLoading]);

    useEffect(() => {
        getMostViewed();
    }, []);

    const changeStoriesLimit = () => {
        setStoriesLimit(mostViewed.length);
    }

    let content = null;
    if(mostViewed.length > 0){
        content = mostViewed.map((stories, index) => {

            let imageURL =  "assets/images/logo-placeholder.png";
            if(stories.media.length > 0  && stories.media[0]["media-metadata"]){
                imageURL = stories.media[0]["media-metadata"][0].url;
            }

            let publishedDate = "";
            let d     = new Date(stories.published_date);
            let day   = d.getDate();
            let month = d.getMonth() + 1;
            let year  = d.getFullYear();
            if (month.length < 2) 
                month = '0' + month;
            if (day.length < 2) 
                day = '0' + day;
            publishedDate = [day, month, year].join('/');

            let story = null;
            if(index < storiesLimit){
                story = (
                    <div 
                        key       = {stories.asset_id}
                        className = {classes.contentMainArticles}
                    >
                        <img 
                            src   = {imageURL}
                            className = {classes.contentImage}
                            alt   = "StoriesImage"
                        />
                        <div
                            className = {classes.contentText}
                        >    
                            <div className = {classes.TextContainer}>
                                <span className = {classes.title}>{stories.title}</span>
                                <span className = {classes.byLine}>{stories.byline}.</span>
                                <span className = {classes.date}>
                                    Published On: {publishedDate}.
                                </span>
                                <span className = {classes.abstract}>{stories.abstract}</span>
                            </div>
                            <div className = {classes.IconContainer}>
                                <div>
                                    <a 
                                        href      = {stories.url} 
                                        className = {classes.ImageContainer}
                                        target    = "_blank"
                                        rel       = "noopener"
                                    >
                                        <img 
                                            src       = "assets/images/chevron-right.svg"
                                            className = {classes.Image}
                                            alt       = "SEE ARTICLE"
                                        />                                
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            return story;
        })
    }


    return (
        <div className = {classes.layoutContent}>
            <div>
                <p className = {classes.contentHeadingText}>
                    The most popular articles on <span className = {classes.Bold}>NYTimes.com</span> this week...
                </p>
            </div>
            {
                isLoading 
                ? <Spinner />
                : <div>
                    {content}
                    {  mostViewed.length > storiesLimit &&
                        <div className = {classes.ButtonContainer}>
                            <button 
                                className = {classes.searchButton}
                                onClick   = {changeStoriesLimit}
                            >
                                See More 
                            </button>
                        </div>
                    }
                  </div>
            }
        </div>
    )
})

export default MostPopular;