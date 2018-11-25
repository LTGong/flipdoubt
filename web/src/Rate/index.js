import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import Carousel from 'nuka-carousel';
import StarRatingComponent from 'react-star-rating-component';
import '../Gallery/gallery.css';
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
import './rate.css';


class Rate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      thoughts: [],
      currentShownPage: 0,
      totalPages: null,
      showRating: false,
      currentThought: null
    }
    this.handleCardClick = this.handleCardClick.bind(this);
    this.showNextPage = this.showNextPage.bind(this);
    this.showPreviousPage = this.showPreviousPage.bind(this);
    this.backToSelection = this.backToSelection.bind(this);
    this.reRenderState = false;
  }

  componentWillMount() {
    this.fetchAllThoughts();
  }

  componentWillUpdate() {
    if (!this.reRenderState) {
      this.reRenderState = this.props.reRender;
      if (this.reRenderState) {
        this.fetchAllThoughts();
      }
    }
  }

  fetchAllThoughts() {
    var the_headers = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, this.props.getAuthorizationHeader());
    let request = new Request('/api/db/get-thoughts', {
      method: 'GET',
      headers: the_headers
    });

    fetch(request).then((res) => res.json()).then((res) => {
      var thoughts = res;
      this.setState({thoughts: thoughts});
      this.setState({totalPages: thoughts.length === 3.0 ? 0 : Math.ceil(thoughts.length/3.0)});
      this.setState({lowerBound: 0});
      this.setState({upperBound: 1});
      this.reRenderState = false;
    }).catch(err => {
      console.log(err)
    });
  }

  showNextPage(gallery_template) {
    if(this.state.currentShownPage < (this.state.totalPages - 1)) {
      this.setState({currentShownPage: this.state.currentShownPage + 1})
    } else if(this.state.currentShownPage === (this.state.totalPages - 1)) {
      this.setState({currentShownPage: 0})
    }
    var upper_bound = 0;
    var lower_bound = 0;
    if(this.state.upperBound === gallery_template.length) {
      this.setState({lowerBound: 0});
      this.setState({upperBound: 1});
    } else {
      upper_bound = (this.state.upperBound > gallery_template.length) ? gallery_template.length : this.state.upperBound + 1;
      lower_bound = upper_bound -1;
      this.setState({lowerBound: lower_bound});
      this.setState({upperBound: upper_bound});
    }
  }

  showPreviousPage(gallery_template) {
    var current_page = 0;
    if(this.state.currentShownPage > 0) {
      this.setState({currentShownPage: (this.state.currentShownPage - 1)})
      current_page = this.state.currentShownPage - 1;
    } else if(this.state.currentShownPage === 0) {
      this.setState({currentShownPage: this.state.totalPages - 1})
      current_page = this.state.totalPages - 1
    }
    var upper_bound = 0;
    var lower_bound = 0;
    if(current_page === (this.state.totalPages - 1)) {
      upper_bound = gallery_template.length;
      lower_bound = upper_bound - 1;
      this.setState({upperBound: upper_bound});
      this.setState({lowerBound: lower_bound});
    } else {
      upper_bound = this.state.upperBound - 1;
      lower_bound = upper_bound - 1;
      this.setState({upperBound: upper_bound});
      this.setState({lowerBound: lower_bound});
    }
  }

  handleCardClick(thoughtId) {
    this.setState({showRating: true});
    var currentThought = this.state.thoughts.filter((thought) =>{
      return thought._id === thoughtId;
    })[0];
    this.setState({currentThought: currentThought});
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

  getThoughtsInSetsOfThree(thoughts) {
    let setsOfThree = [];
    let i = 0;
    while (i < this.state.thoughts.length) {
      setsOfThree.push(this.state.thoughts.slice(i, i + 3));
      i += 3
    }
    return setsOfThree;
  }

  getCircleIcons() {
    var circles = [];
    for(var i = 0; i < this.state.totalPages; i++) {
      var currentColor = this.state.currentShownPage === i ? "#000000" : "#FFFFFF"
      circles.push((<FontAwesomeIcon key={i} className="circles" style={{color: currentColor}} icon="circle" />));
    }
    return ( <div className="circles-container">{circles}</div> )
  }

  update_thought_with_rating(thoughtId, hitId, rating) {
    var the_headers = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, this.props.getAuthorizationHeader());
    let request = new Request('/api/db/set-rating', {
      method: 'POST',
      body: JSON.stringify({
        thoughtId,
        hitId,
        rating
      }),
      headers: the_headers
    });

    fetch(request).then((res) => res.json()).then((res) => {
      console.log("Rating response updated")
      var currentThought = this.state.currentThought;
      for(var i = 0; i < currentThought._HITs.length; i++) {
        if(res.hitId === currentThought._HITs[i].HITId) {
          currentThought._HITs[i].rating = res.rating;
        }
      }
      this.setState({currentThought: currentThought});
    }).catch(err => {
      console.log(err)
    });
  }

  onStarClickHalfStar(nextValue, prevValue, name, e) {
    const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;

    if (xPos <= 0.5) {
      nextValue -= 0.5;
    }

    console.log('name: %s, nextValue: %s, prevValue: %s', name, nextValue, prevValue);
    var hitId = e.currentTarget.children[0].attributes['data-hitid'].value
    for(var i = 0; i < this.state.currentThought._HITs.length; i++) {
      if(this.state.currentThought._HITs[i].HITId === hitId) {
        if(i === 0) {
          this.setState({rating1: nextValue})
         }
        if(i === 1) {
          this.setState({rating2: nextValue})
         }
        if(i === 2) {
          this.setState({rating3: nextValue})
         }
      }
    }
    this.update_thought_with_rating(this.state.currentThought._id, hitId, nextValue)
  }

  backToSelection() {
    this.setState({showRating: false});
  }

  render() {
    if(this.state.showRating) {
      var reframes = this.state.currentThought._HITs.map((hit, i) => {
        return (
          <div className="column is-one-third">
              <div className="reframes">
                <div className="reframe" data-hitid={hit.HITId} key={i}>{hit.positive_thought}</div>
              </div>
              <div className="ratings" style={{fontSize: 18}}>
                <StarRatingComponent
                  name={"rater_"+i.toString()}
                  starColor="#ffb400"
                  emptyStarColor="#ffb400"
                  value={hit.rating}
                  onStarClick={this.onStarClickHalfStar.bind(this)}
                  renderStarIcon={(index, value) => {
                  return (
                    <span data-hitid={hit.HITId}>
                      {(index <= value)
                          ? <FontAwesomeIcon icon={['fas','star']} size="2x"/>
                          : <FontAwesomeIcon icon={['far', 'star']} size="2x"/>}
                    </span>
                  );
                }}
                renderStarIconHalf={() => {
                  return (
                    <span data-hitid={hit.HITId} className="half-star-span">
                      <FontAwesomeIcon style={{position: 'absolute'}} icon={['far', 'star']} size="2x"/>
                      <FontAwesomeIcon icon={['fas', 'star-half']} size="2x"/>
                    </span>
                  );
                }}
                />
              </div>
         </div>
        )
      });
      return (
        <div className="is-centered container">
          <div className="box dark rating-box">
            <div className="columns">
              <div className="column is-full">
                <div className="negative-thought">
                  {this.state.currentThought._neg_thought}
                </div>
              </div>
            </div>
            <div className="columns column-container">
              {reframes}
            </div>
            <div onClick={() => this.backToSelection() } className="back-button">back</div>
          </div>
        </div>
      )
    } else {
      var setsOfThree = this.getThoughtsInSetsOfThree(this.state.thoughts);
      var templates = []
      for(var i = 0; i < setsOfThree.length; i++) {
        templates.push(setsOfThree[i].map((thought, i) => {
          return (
            <div className="column is-4" key={i}>
              <div className="custom-card"
                key={i}
                onClick={() => this.handleCardClick(thought._id)}>
                <figure className="is-overlay back">
                  <img src={this.getBackground(thought._img_id)} alt="back"/>
                  <div className="caption">
                    <h2>{thought._HITs[0].positive_thought}</h2>
                  </div>
                </figure>
                <figure className="front">
                  <img src={background11} alt="front"/>
                  <div className="caption">
                    <h2>{thought._neg_thought}</h2>
                  </div>
                </figure>
              </div>
            </div>
          )
        }));
      }
      var gallery_template = templates.map((template, i) => <div key={i} className="columns">
        {template}
      </div>);
      var circles = this.getCircleIcons();
      return (
        <div className="is-centered container">
          <div className="box dark carousel-container">
            {gallery_template.slice(this.state.lowerBound, this.state.upperBound)}
            <div className="control-container">
              <div className="page-controls"><FontAwesomeIcon onClick={this.showPreviousPage.bind(this, gallery_template)} className="pull-right" icon="angle-left" size="3x" /></div>
              {circles}
              <div className="page-controls"><FontAwesomeIcon onClick={this.showNextPage.bind(this, gallery_template)} className="pull-left" icon="angle-right" size="3x" /></div>
            </div>
          </div>
        </div>
      );
    }
  }
 }

export default Rate;
