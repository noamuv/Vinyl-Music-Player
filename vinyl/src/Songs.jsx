import './css/Songs.css'

export default function Songs(props) {
    return(
        <div className='song-item' onClick={props.onClick}>
            <img id="song-img" src={props.image}/>
            <h2 id="song-name">{props.name}</h2>
            <span id="song-artist">{props.artist}</span>
        </div>
    )
}