import React, {Component} from 'react';
import './community.css';
import background1 from '../Gallery/background-1.jpg';
import background2 from '../Gallery/background-2.jpg';
import background3 from '../Gallery/background-3.jpg';
import background4 from '../Gallery/background-4.jpg';
import background5 from '../Gallery/background-5.jpg';
import background6 from '../Gallery/background-6.jpg';
import background7 from '../Gallery/background-7.jpg';
import background8 from '../Gallery/background-8.jpg';
import background9 from '../Gallery/background-9.jpg';
import background10 from '../Gallery/background-10.jpg';
import background11 from '../Gallery/background-11.jpg';

class Community extends Component {

    constructor(props) {
        super(props);
        this.state = {
            thoughts: [],
        }
        this.handleCardClick = this
            .handleCardClick
            .bind(this);
    }

    componentWillMount() {
        fetch('/api/db/get-community-quotes').then((res) => res.json()).then((res) => {
            console.log(res);
            this.setState({thoughts: res});
        }).catch(err => console.log(err));
    }

    handleCardClick(e) {
        e.preventDefault();
        if (e.currentTarget.className.includes('flipped')) {
            e.currentTarget.className = "custom-card";
            e.currentTarget.children[0].className = "front";
            e.currentTarget.children[1].className = "back is-hidden";
        } else {
            e.currentTarget.className = "custom-card flipped";
            e.currentTarget.children[0].className = "front is-hidden";
            e.currentTarget.children[1].className = "back";
        }
    }

    getBackground(){
        switch(Math.floor(Math.random() * 10) + 1 ) {
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
        while(i < this.state.thoughts.length){
            setsOfThree.push(this.state.thoughts.slice(i, i + 3));
            i += 3
        }

        let templates = [];
        for(i = 0; i < setsOfThree.length; i++) {
            templates.push(
                setsOfThree[i].map((thought, i) =>
                {
                    return (<div className="column is-4">
                            <div className="card-container">
                            <div className="custom-card" onClick={this.handleCardClick}>

                            <figure className="front">
                                <img src={this.getBackground()} alt="front"/>
                                <div className="caption">
                                    <h2>{thought._pos_thought}</h2>
                                    <div className="share-social">
                                        <i className="fa fa-twitter" aria-hidden="true"></i>
                                        <i className="fa fa-google-plus" aria-hidden="true"></i>
                                        <i className="fa fa-facebook" aria-hidden="true"></i>
                                    </div>
                                </div>
                            </figure>

                            <figure className="back is-hidden">
                                <img src={background11} alt="back"/>
                                <div className="caption">
                                    <h2>{thought._neg_thought}</h2>
                                </div>
                            </figure>
                            </div>
                            </div>
                            </div>
                        );
                })
            );
        }

        var gallery_template =
            templates
            .map((template, i) =>
                <div className="columns">
                    {template}
                </div>
        );
        return (
            <div className="box dark has-text-centered container">
                <h2 className="title is-3">Community</h2>
                <br/>
                {gallery_template}
            </div>
        );
    }
}

export default Community;
