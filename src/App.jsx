import { useEffect, useMemo, useState } from 'react'
import './App.css'
import PostsList from './components/PostsList';
import PostForm from './components/PostForm';
import MyButton from './UI/MyButton/MyButton';
import MyInput from './UI/MyInput/MyInput';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(false);
  const [likeSite, setLikeSite] = useLocalStorage('likeSite', 0);
  const [act, setAct] = useState(false);
  const [sortType, setSortType] = useState('');
  const [confirmation, setConfirmation] = useState(false);
  const [onDelPostID, setOnDelPostID] = useState();

  const [isFirstVisit] = useState(() => localStorage.getItem('postsLoaded') === null);
  const [posts, setPosts] = useLocalStorage('posts', []);
  const [loading, setLoading] = useState(isFirstVisit);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isFirstVisit) return;
    async function load() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Ошибка: ' + response.status);
        const data = await response.json();
        setPosts(data.map(p => ({...p, likes: 0, dislike: 0, likeState: false, disLikeState: false})));
        localStorage.setItem('postsLoaded', 'true');
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function removePost(id) {
    setConfirmation(true);
    setOnDelPostID(id);
  };
  
  function removePosts() {
    setPosts(prev => prev.filter(p => p.id !== onDelPostID));
  }


  function likeStateReverse(id) {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (p.disLikeState) {
        return {...p, likes: (p.likes + 1), dislike: (p.dislike - 1), disLikeState: false, likeState: true}
      }
      return {...p, likes: (p.likes + 1), disLikeState: false, likeState: true}
    }))
  }

  function disLikeStateReverse(id) {
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p;
      if (p.likeState) {
        return {...p, likes: (p.likes - 1), dislike: (p.dislike + 1), disLikeState: true, likeState: false}
      }
      return {...p, dislike: (p.dislike + 1), disLikeState: true, likeState: false}
    }))
  }

  function addPost(title, body) {
    const newPost = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      likes: 0,
      dislike: 0,
      likeState: false, 
      disLikeState: false
    }
    setPosts(prev => [...prev, newPost]);
    likeInSite();
  }

  function likeInSite() {
    if (act) return
    setNotification(true);
  }

  const sortOnPost = useMemo(() => {
    var copy = [...posts];
    if (sortType === 'like') {
      copy.sort((a,b) => b.likes - a.likes);
    }
    else if (sortType === 'date') {
      copy.sort((a,b) => b.id - a.id);
    }
    else if (sortType === 'default') {
      copy = [...posts];
    }
    return copy
  }, [sortType, posts]);

  const filteredPosts = useMemo(() =>  {
    const q = search.toLowerCase().trim();
    if (!q) return sortOnPost;
    return sortOnPost.filter(p => p.title.toLowerCase().includes(q));
  }, [sortOnPost, search])

  return (
    <>
      <div className='root2'>
        <div>
          {!loading && !error && <PostForm addPost={addPost}/>}
        </div>
        <div className='sortBtn'>
          <MyButton onClick={() => {
            setSortType('like');
            }}>Сортировка по лайкам</MyButton>
          <MyButton onClick={() => {
            setSortType('date');
            }}>Сортировка по дате</MyButton>
          <MyButton onClick={() => {
            setSortType('default');
            }}>Сортировка по умолчанию</MyButton>
        </div>
        <div className='search'>
          <h2>ПОИСК ПОСТОВ</h2>
          <MyInput type="text" 
          placeholder='Найти пост'
          value={search}
          onChange={(e) => {setSearch(e.target.value)}}
          />
          {search && <p>Найдено постов: {filteredPosts.length}</p>}
        </div>
        {loading ? <p className='loading'>Загрузка...</p> : error ? <p className='error'>{error}</p> : <PostsList search={search} posts={filteredPosts} removePost={removePost} likeStateReverse={likeStateReverse} disLikeStateReverse={disLikeStateReverse}/>}      
        </div>
      <div className='postsLength'>
        <p>Всего постов: {posts.length}</p>
      </div>
      {notification && <div className='notification'>
        <h2>ВАМ ПОНРАВИЛСЯ НАШ САЙТ?</h2>
        <MyButton onClick={() => {
          setLikeSite(prev => prev + 1);
          setNotification(false);
          setAct(true);
          }}>ДА</MyButton>
        <MyButton onClick={() => {
          setLikeSite(prev => prev - 1);
          setNotification(false);
          setAct(true);
          }}>НЕТ</MyButton>
      </div>}
      {confirmation && <div className='notification'>
        <h2>ВЫ ДЕЙСТВИТЕЛЬНО ХОТИТЕ УДАЛИТЬ ПОСТ?</h2>
        <MyButton onClick={() => {
          setConfirmation(false);
          removePosts();
        }}>Удалить</MyButton>
        <MyButton onClick={() => {
          setConfirmation(false);
        }}>Оставить</MyButton>
        </div>}
      <footer className='footer'>
        <p>СКОЛЬКИМ ЛЮДЯМ ПОНРАВИЛСЯ НАШ САЙТ: {likeSite}</p>
      </footer>
    </>
  )
}

export default App
