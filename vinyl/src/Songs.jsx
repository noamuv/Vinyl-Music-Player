import './css/Songs.css'

export default function Songs(props) {
    return(
        <li className='song-item' onClick={props.onClick}>
            {/* <span>{props.number}</span>
            <img>{props.img}</img> */}
            <span>{props.name}</span>
            <span>{props.artist}</span>
            {/* <span>{props.duration}</span> */}
        </li>
    )
}