import './Cover.css'
import { Canvas } from "@react-three/fiber";

export default function Cover() {
    return(
            <div id="cover" className="cover__container">
                <div className='title1'>
                    <h1 className='mood'>
                        <span>M</span>
                        <span>O</span>
                        <span>O</span>
                        <span>D</span>
                    </h1>
                </div>
                <div className='title2'>
                    <h1>1</h1>
                </div>
                <div className="image">
                    <img src="mood1.jpg"/>
                </div>
                <div className="genre">
                    <img src='barcode3.png'/>
                    <img src='barcode.png'/>
                    <img src='barcode.png'/>
                    <img src='barcode.png'/>
                    <img src='barcode3.png'/>
                    <h3>RnB</h3>
                    <img src='barcode3.png'/>
                </div>
            </div>
    )
}