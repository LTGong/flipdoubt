import React, {Component} from 'react';

import './gallery.css';
import background1 from './background-1.jpg';
import background2 from './background-2.jpg';
import background3 from './background-3.jpg';
import background4 from './background-4.jpg';
import background5 from './background-5.jpg';
import background6 from './background-6.jpg';
import background7 from './background-7.jpg';
import background8 from './background-8.jpg';
import background9 from './background-9.jpg';
import background10 from './background-10.jpg';
import background11 from './background-11.jpg';

var share = require('social-share');

class Gallery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            thoughts: []
        }
        this.handleCardClick = this
            .handleCardClick
            .bind(this);
        this.swap = this
            .swap
            .bind(this);
        this.handleShareClick = this
            .handleShareClick
            .bind(this);
        this.handlePositiveClick = this
            .handlePositiveClick
            .bind(this);
        this.handleNegativeClick = this
            .handleNegativeClick
            .bind(this);
        this.handleTwitterClick = this
            .handleTwitterClick
            .bind(this);
        this.reRenderState = false;
    }

    componentWillMount() {
        this.fetchThoughts();
    }

    componentWillUpdate() {
        if (!this.reRenderState) {
            this.reRenderState = this.props.reRender;
            if (this.reRenderState) {
                this.fetchThoughts();
            }
        }
    }

    fetchThoughts() {
        var the_headers = Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, this.props.getAuthorizationHeader());
        if (this.props.user != null) {
            let request = new Request('/api/db/get-user-quotes', {
                method: 'POST',
                body: JSON.stringify({username: this.props.user}),
                headers: the_headers
            });

            console.log(request);
            fetch(request).then((res) => res.json()).then((res) => {
                res.forEach((item) => {
                  for(var i = 0; i < item._HITs.length; i++) {
                    if(item._HITs[i].positive_thought !== undefined
                      && item._pos_thought === undefined) {
                      item['_pos_thought'] = item._HITs[i].positive_thought;
                    }
                  }
                });
                this.setState({thoughts: res});
                this.reRenderState = false;
            }).catch(err => console.log(err));
        }
    }

    handleCardClick(e) {
        e.preventDefault();
        if (e.currentTarget.className.includes('flipped')) {
            e.currentTarget.className = "custom-card";
        } else {
            e.currentTarget.className = "custom-card flipped";
        }
    }

    handleTwitterClick(e) {
        console.log("child click");
        e.stopPropagation();
        var url = share('twitter', {
            title: e
                .currentTarget
                .getAttribute('value')
        });

        this.bounce(e.currentTarget);
        window.open(url, "_blank");
    }

    handleShareClick(e) {
        e.stopPropagation();
        var the_headers = Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, this.props.getAuthorizationHeader());
        let share_request = new Request('/api/db/share-thought', {
            method: 'POST',
            body: JSON.stringify({
                _HITId: e
                    .currentTarget
                    .getAttribute('value')
            }),
            // this header sends the user token from auth0
            headers: the_headers
        });
        fetch(share_request).then((res) => res.json()).then((res) => {
            console.log(res.message);
        }).catch(err => console.log(err));

        this.bounce(e.currentTarget);
    }

    handlePositiveClick(e) {
        e.stopPropagation();

        var the_headers = Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, this.props.getAuthorizationHeader());

        let increment_positive_req = new Request('/api/db/increment_pos_thought', {
            method: 'POST',
            body: JSON.stringify({
                _HITId: e
                    .currentTarget
                    .getAttribute('value')
            }),
            // this header sends the user token from auth0
            headers: the_headers
        });

        fetch(increment_positive_req).then((res) => res.json()).then((res) => {
            console.log(res.message);
        }).catch(err => console.log(err));

        this.bounce(e.currentTarget);
    }

    handleNegativeClick(e) {
        e.stopPropagation();

        var the_headers = Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, this.props.getAuthorizationHeader());

        let increment_negative_req = new Request('/api/db/increment_neg_thought', {
            method: 'POST',
            body: JSON.stringify({
                _HITId: e
                    .currentTarget
                    .getAttribute('value')
            }),
            // this header sends the user token from auth0
            headers: the_headers
        });

        fetch(increment_negative_req).then((res) => res.json()).then((res) => {
            console.log(res.message);
        }).catch(err => console.log(err));

        this.bounce(e.currentTarget);
    }

    bounce(element) {
        element
            .classList
            .remove("bounce");
        element
            .classList
            .add("bounce");
    }

    swap(e) {
        console.log('swap');
        e.stopPropagation();
        var the_headers = Object.assign({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }, this.props.getAuthorizationHeader());
        var img = e.currentTarget.parentElement.parentElement.parentElement.children[0];
        let img_request = new Request('/api/db/swap-image', {
            method: 'POST',
            body: JSON.stringify({
                _HITId: e
                    .currentTarget
                    .getAttribute('value')
            }),
            // this header sends the user token from auth0
            headers: the_headers
        });

        fetch(img_request).then((res) => res.json()).then((res) => {
            img.src = this.getBackground(res._img_id);
        }).catch(err => console.log(err));

        this.bounce(e.currentTarget);
    }

    getBackground(img_id) {
        switch (img_id) {
            case 1:
                return background1;
            case 2:
                return background2;
            case 3:
                return background3;
            case 4:
                return background4;
            case 5:
                return background5;
            case 6:
                return background6;
            case 7:
                return background7;
            case 8:
                return background8;
            case 9:
                return background9;
            case 10:
                return background10;
            default:
                return background1;
        }
    }

    render() {
        let setsOfThree = [];
        let i = 0;
        while (i < this.state.thoughts.length) {
            setsOfThree.push(this.state.thoughts.slice(i, i + 3));
            i += 3
        }

        let templates = [];
        for (i = 0; i < setsOfThree.length; i++) {
            templates.push(setsOfThree[i].map((thought, i) => {
                return (
                    <div className="column is-4" key={i}>
                        <div className="card-container">
                            <div className="custom-card" onClick={this.handleCardClick}>

                                <figure className="front">
                                    <img src={this.getBackground(thought._img_id)} alt="front"/>
                                    <div className="caption">
                                        <h2>{thought._pos_thought}</h2>
                                        <div className="share-social">
                                            <i
                                                data-service="twitter"
                                                className="fa fa-twitter"
                                                aria-hidden="true"
                                                value={thought._pos_thought}
                                                onClick={this.handleTwitterClick}></i>
                                            <i
                                                className="fa fa-bullhorn"
                                                aria-hidden="true"
                                                value={thought._HITId}
                                                onClick={this.handleShareClick}></i>
                                            <i
                                                className="fa fa-exchange"
                                                aria-hidden="true"
                                                value={thought._HITId}
                                                onClick={this.swap}></i>
                                            <i
                                                value={thought._HITId}
                                                className="fa fa-plus"
                                                aria-hidden="true"
                                                onClick={this.handlePositiveClick}></i>
                                        </div>
                                    </div>
                                </figure>

                                <figure className="is-overlay back">
                                    <img src={background11} alt="back"/>
                                    <div className="caption">
                                        <h2>{thought._neg_thought}</h2>
                                        <div className="share-social">
                                            <i
                                                value={thought._HITId}
                                                className="fa fa-plus"
                                                aria-hidden="true"
                                                onClick={this.handleNegativeClick}></i>
                                        </div>
                                    </div>
                                </figure>
                            </div>
                        </div>
                    </div>
                );
            }));
        }
        var gallery_template = templates.map((template, i) => <div key={i} className="columns">
            {template}
        </div>);
        return (
            <div className="box dark has-text-centered is-radiusless">
                <p>{this.props.shouldRerender}</p>
                <h2 className="card-header title is-3 has-text-centered">Gallery of the Mind</h2>
                <br/> {gallery_template}
            </div>
        );
    }
}

export default Gallery;
