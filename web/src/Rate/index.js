import React, { Component } from 'react';
import Carousel from 'nuka-carousel';
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
      currentlyShownPage: 0,
      totalPages: null,
      showRating: false,
      currentThought: null
    }
    this.handleCardClick = this.handleCardClick.bind(this);
    this.reRenderState = false;
  }

  componentWillMount() {
    this.fetchAllThoughts();
  }

  componentDidMount(){
    setTimeout(() => {
      try {
        this.carousel.setDimensions(null)
      }
      catch(err){
        // sometimes it crashes in chrome, pristine error handling here
      }
    }, 300);
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
      var thoughts = res.filter(thought => thought.hasOwnProperty('_pos_thoughts'))
      this.setState({thoughts: thoughts});
      this.setState({totalNumPages: Math.ceil(thoughts/6.0)});
      this.reRenderState = false;
    }).catch(err => {
      console.log(err)
    });
  }

  showNextPage() {
    debugger
  }

  showPreviousPage() {
    debugger
  }

  handleCardClick(thoughtId) {
    this.setState({showRating: true});
    var currentThought = this.state.thoughts.filter((thought) =>{
      return thought._id === thoughtId;
    })[0];
    this.setState({currentThought: currentThought});
    console.log(currentThought)
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

  render() {
    if(this.state.showRating) {
      var reframes = this.state.currentThought._pos_thoughts.map((positive_thought, i) => {
        return (
          <div className="column" key={i}>{positive_thought.reframe}</div>
        )
      });
      return (
        <div className="is-centered container">
          <div className="box dark rating-box">
            <h1>{this.state.currentThought._neg_thought}</h1>
            <div className="columns">
              {reframes}
            </div>
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
                    <h2>{thought._pos_thought}</h2>
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
      debugger
      return (
        <div className="is-centered container">
          <div className="box dark carousel-container">
            {gallery_template.slice(1)}
          </div>
        </div>
      );
    }
  }
 }

export default Rate;
