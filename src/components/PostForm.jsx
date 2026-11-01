import { useState } from "react";
import MyButton from "../UI/MyButton/MyButton";
import MyInput from "../UI/MyInput/MyInput";

function PostForm({addPost}) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [errorTitle, setErrorTitle] = useState(false);
    const [errorBody, setErrorBody] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();
        if (title.trim().length < 1 && body.trim().length < 1) {
            setErrorBody(true);
            setErrorTitle(true);
            return
        }
        if (title.trim().length < 1) {
            setErrorTitle(true);
            return
        };
        if (body.trim().length < 1) {
            setErrorBody(true);
            return
        };
        addPost(title, body);
        setTitle('');
        setBody('');
    }

    return (
        <form className="postForm" onSubmit={handleSubmit}>
            <h2>СОЗДАНИЕ ПОСТОВ</h2>
            <div>
                <MyInput 
                type="text"
                placeholder='Введите название'
                value={title}
                onChange={e => {
                    setTitle(e.target.value);
                    setErrorTitle(false);
                }}/>
                {errorTitle && <p className="errorInput">Вы не ввели название!</p>}
            </div>
            <div>
                <MyInput 
                type="text"
                placeholder='Введите описание'
                value={body}
                onChange={e => {
                    setBody(e.target.value);
                    setErrorBody(false);
                }}/>
                {errorBody && <p className="errorInput">Вы не ввели текст!</p>}
            </div>
            <MyButton type='submit'>Создать пост</MyButton>
        </form>
    )
}

export default PostForm;