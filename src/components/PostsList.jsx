import MyButton from "../UI/MyButton/MyButton";

function PostsList({posts, removePost, likeStateReverse, disLikeStateReverse, search}) {

    if (posts.length === 0 && search.length > 0) {
        return (
            <div className="postsNotFound">
                <h2>Посты не найдены</h2>
            </div>
        )
    }
    if (posts.length === 0) {
        return (
            <div className="noPosts">
                <h2>Постов пока нет</h2>
            </div>
        )
    }

    return (
        <div className="allPosts">
            <h2>НАШИ ПОСТЫ</h2>
            {posts.map(post => (
                <div key={post.id} className="posts">
                    <div className="titleBody">
                        <h3>{post.title}</h3>
                        <p>{post.body}</p>
                    </div>
                    <div className="elementPosts">
                        <div className="delBtn">
                            <MyButton aria-label='Удалить' onClick={() => removePost(post.id)}>✕</MyButton>
                        </div>
                        <div className="likeBtn">
                            <MyButton aria-label='Лайк' disabled={post.likeState} onClick={() => {
                                likeStateReverse(post.id);
                                }}>👍 {post.likes}</MyButton>
                            <MyButton aria-label='Дизлайк' disabled={post.disLikeState} onClick={() => {
                                disLikeStateReverse(post.id);
                                }}>👎 {post.dislike}</MyButton>
                        </div>
                    </div>
                </div>
            ))} 
        </div>
    )
}

export default PostsList;