import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { urlServer } from '../../App';
import './DetailedPostView.css';
import moment from 'moment';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';

const DetailedPostView = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);
    const [likedComments, setLikedComments] = useState(new Set()); // Store liked comment IDs

    const { user } = useAuth(); 

    const formatDate = (utcDateString) => {
        const localDate = moment.utc(utcDateString).local();
        const now = moment();
        if (now.diff(localDate, 'hours') < 24) {
            return localDate.fromNow();  // Correctly uses the local time
        }
        return localDate.format('MMMM Do YYYY');  // e.g., 'January 3rd 2021'
    };

    const fetchPostAndComments = async () => {
        try {
            axios.get(`${urlServer}/posts/${postId}`)
            .then(response => {
                setPost(response.data);
            })
            .catch(error => console.error('Error fetching post:', error));

            const commentsResponse = await axios.get(`${urlServer}/posts/${postId}/comments`);
            setComments(commentsResponse.data.sort((a, b) => 
                new Date(b.created_at) - new Date(a.created_at)
            ));
            const likedCommentsResponse = await axios.post(`${urlServer}/comments/likes`, { user_id: user.id });
            setLikedComments(new Set(likedCommentsResponse.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchPostAndComments();
    }, [postId]);

    const submitComment = () => {
        if (!newComment.trim()) {
            return; // Prevent empty comments
        }

        const commentToAdd = {
            // You can include an id if available from the response, or a temporary one
            id: Date.now(), 
            post_id: post.id,
            author: user.username, // Replace with actual author data once authentication is implemented
            content: newComment,
            likes: 0,
            created_at: new Date().toISOString()
        };

        // Optimistically update the local state
        setComments([commentToAdd, ...comments]);

        axios.post(`${urlServer}/posts/${post.id}/comments`, { author: user.username, content: newComment })
            .then(response => {
                setNewComment('');
                setComments([response.data, ...comments]); // Use data from the backend
            })
            .catch(error => console.error('Error posting comment:', error));
    };

    const likeComment = async (commentId) => {
        try {
            await axios.post(`${urlServer}/comments/${commentId}/like`, { user_id: user.id });
            setLikedComments(prev => {
                const newLikes = new Set(prev);
                if (newLikes.has(commentId)) {
                    newLikes.delete(commentId);
                } else {
                    newLikes.add(commentId);
                }
                return newLikes;
            });
            // Optionally, refetch comments or adjust like counts locally
            setComments(prevComments => prevComments.map(comment => {
                if (comment.id === commentId) {
                    // If the comment is currently liked, decrease its like count
                    // Otherwise, increase its like count
                    return {
                        ...comment,
                        likes: likedComments.has(commentId) ? comment.likes - 1 : comment.likes + 1
                    };
                }
                return comment; // Return unchanged for other comments
            }));

        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };

    const deleteComment = (commentId) => {
        axios.delete(`${urlServer}/comments/${commentId}`)
            .then(() => {
                const updatedComments = comments.filter(comment => comment.id !== commentId);
                setComments(updatedComments);
            })
            .catch(error => console.error('Error deleting comment:', error));
    }; 

    const handleClose = () => {
        navigate("/"); // Go back to the previous page
    };

    const handleLikeClick = (e, comment) => {
        e.stopPropagation(); // Prevent event from bubbling up to the comment element
        likeComment(comment.id);
    };

    const handleDeleteClick = (e, commentId) => {
        e.stopPropagation(); // Prevent event from bubbling up to the comment element
        deleteComment(commentId);
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent the default action to avoid line breaks in input
            submitComment();
        }
    };

    const loadMoreComments = () => {
        setVisibleCommentsCount(prevCount => prevCount + 5); // Load 5 more comments
    };

    if (!post) {
        return <Loading />; // Or any other loading indicator
    }

    return (
        <div className="detailed-post-view">
            <div className="navigation-back">
                <i className="fas fa-arrow-left" onClick={handleClose}></i>
                <span>Post</span>
            </div>
            <div className="post-content-detailed">
                <h3>{post.author}</h3>
                <p>{post.content}</p>
            </div>
            <div className="post-info-banner">
                <span><i className="fas fa-calendar-alt"></i> {formatDate(post.created_at)}</span>
                <span><i className="fas fa-heart"></i> {post.likes} Like{post.likes !== 1 ? 's' : ''}</span>
                <span><i className="fas fa-comments"></i> {comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="comment-submission">
                <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
                <button onClick={submitComment}>Submit</button>
            </div>
            <div className="comments-section">
                {comments.slice(0, visibleCommentsCount).map((comment) => (
                    <div key={comment.id} className="comment">
                        <div className="comment-header">
                            <div className="author-and-date">
                                <h3>{comment.author}</h3>
                                <span className="comment-date">{formatDate(comment.created_at)}</span>
                            </div>
                            <span className="delete-icon" onClick={(e) => handleDeleteClick(e, comment.id)}>
                                <i className="fas fa-trash-alt"></i>
                            </span>
                        </div>
                        <p className='comment-content'>{comment.content}</p>
                        <div className="comment-interactions">
                            <span className="likes" onClick={(e) => handleLikeClick(e, comment)}>
                                <i className={likedComments.has(comment.id) ? "fas fa-heart liked" : "fas fa-heart"}></i> {comment.likes}
                            </span>
                        </div>
                    </div>
                ))}
                {visibleCommentsCount < comments.length && (
                    <button className="load-more-comments" onClick={loadMoreComments}>
                        Load More Comments
                    </button>
                )}
            </div>
        </div>
    );
};

export default DetailedPostView;
