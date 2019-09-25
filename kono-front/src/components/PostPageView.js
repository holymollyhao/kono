import React from 'react';
import { useSelector } from 'react-redux';
import style from '../styles/PostPageView.module.scss';
import StaticContent from './StaticContent';
import MaterialIcon from './MaterialIcon';
import PostHeader from './PostHeader';

function getTypeString(type, language) {
    switch (language) {
        case 'kr':
            switch (type) {
                case 'notice':
                    return '공지사항';
                case 'lostfound':
                    return '분실물';
                default:
                    return '게시물';
            }
        case 'en':
            switch (type) {
                case 'notice':
                    return 'Notice';
                case 'lostfound':
                    return 'Lost & Found';
                default:
                    return 'Post';
            }
    }
}

function getDateString(date, language) {
    return date.toLocaleString('default', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

export default ({ post }) => {

    const language = useSelector(state => state.config.language, []);

    const header = {
        type : getTypeString(post.type, language),
        title: post[`title_${language}`],
        date : getDateString(post.date, language)
    };
    const textContentURL = post[`content_${language}`];
    const imgContentURLs = post.content_img;

    return (
        <div className={style.PostPageView}>
            <PostHeader header={header} />
            <div className={style.PostPageView__content}>
                <StaticContent url={textContentURL} />
            </div>
            <a href="/">
                <MaterialIcon>arrow_back</MaterialIcon>
            </a>
        </div>
    );

}