import './MyButton.css'

function MyButton({children, ...props}) {
    return (
        <button className="MyBtn" {...props}>
            {children}
        </button>
    )
}

export default MyButton;