import React, {Component} from 'react';
import './gallery.css';

class Gallery extends Component {

    render() {
        return (
            <div className="box">
                <h2 className="title is-3 has-text-centered">Gallery of the Mind</h2>
                <br/>
                <div className="columns">
                    <div className="column is-4">
                        <div className="card-container">
                            <div className="custom-card">
                                <figure className="front">
                                    <img src="http://www.jboeijenga.nl/img/front.jpg" alt="front"/>
                                    <div className="caption">
                                        <h2>be fearless in the pursuit of what sets your soul on fire</h2>
                                        <i className="fa fa-twitter" aria-hidden="true"></i>
                                        <i className="fa fa-google-plus" aria-hidden="true"></i>
                                        <i className="fa fa-facebook" aria-hidden="true"></i>
                                    </div>
                                </figure>

                                <figure className="back is-hidden">
                                    <img src="http://www.jboeijenga.nl/img/back.jpg" alt="back"/>
                                    <div className="caption">
                                        <h2>I want to learn photography but so scared of how the photographs would turn out.</h2>
                                    </div>
                                </figure>
                            </div>
                        </div>
                    </div>

                    <div className="column is-4">
                        <div className="card-container">
                            <div className="custom-card">
                                <figure className="front">
                                    <img src="http://www.jboeijenga.nl/img/front.jpg" alt="front"/>
                                    <div className="caption">
                                        <h2>be fearless in the pursuit of what sets your soul on fire</h2>
                                        <i className="fa fa-twitter" aria-hidden="true"></i>
                                        <i className="fa fa-google-plus" aria-hidden="true"></i>
                                        <i className="fa fa-facebook" aria-hidden="true"></i>
                                    </div>
                                </figure>

                                <figure className="back is-hidden">
                                    <img src="http://www.jboeijenga.nl/img/back.jpg" alt="back"/>
                                    <div className="caption">
                                        <h2>I want to learn photography but so scared of how the photographs would turn out.</h2>
                                    </div>
                                </figure>
                            </div>
                        </div>
                    </div>
                    <div className="column is-4">
                        <div className="card-container">
                            <div className="custom-card">
                                <figure className="front">
                                    <img src="http://www.jboeijenga.nl/img/front.jpg" alt="front"/>
                                    <div className="caption">
                                        <h2>be fearless in the pursuit of what sets your soul on fire</h2>
                                        <i className="fa fa-twitter" aria-hidden="true"></i>
                                        <i className="fa fa-google-plus" aria-hidden="true"></i>
                                        <i className="fa fa-facebook" aria-hidden="true"></i>
                                    </div>
                                </figure>

                                <figure className="back is-hidden">
                                    <img src="http://www.jboeijenga.nl/img/back.jpg" alt="back"/>
                                    <div className="caption">
                                        <h2>I want to learn photography but so scared of how the photographs would turn out.</h2>
                                    </div>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Gallery;
