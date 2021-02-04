import React from "react"
import { Link } from "react-router-dom"

class Navigator extends React.Component {
    render() {
        return (
            <div className="Navigator">
                <ul>
                    <li>
                        <Link to={"/"}>
                            자작곡 갤러리
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Navigator;
