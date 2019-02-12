import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      currentThought: null,
      showTellUsWhy: false,
      thought_text: "",
      score: "",
      showOnlyUnratedThoughts: true
    };
    this.handleCardClick = this.handleCardClick.bind(this);
    this.showNextPage = this.showNextPage.bind(this);
    this.showPreviousPage = this.showPreviousPage.bind(this);
    this.backToSelection = this.backToSelection.bind(this);
    this.changeView = this.changeView.bind(this);
    this.reRenderState = false;
  }

  componentWillMount() {
    this.fetchAllThoughts();
  }

  componentWillUpdate() {
    if(this.reRenderState) {
      this.fetchAllThoughts()
    }
  }

  fetchAllThoughts() {
    if(this.props.profile) {
      const the_headers = Object.assign({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, this.props.getAuthorizationHeader());

      let url = new URL("/api/db/get-thoughts", window.location.origin);
      if(this.state.showOnlyUnratedThoughts) {
        var params = {user_id: this.props.profile.nickname};
      } else {
        params = {user_id: this.props.profile.nickname, showAll: true};
      }
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

      const request = new Request(url.href, {
        'method': 'GET',
        'headers': the_headers
      });

      fetch(request).then((res) => res.json()).then((res) => {
        let thoughts = res;
        this.setState({thoughts: thoughts});
        this.setState({totalPages: thoughts.length === 3.0 ? 0 : Math.ceil(thoughts.length/3.0)});
        this.setState({lowerBound: 0});
        this.setState({upperBound: 1});
        this.reRenderState = false;
      }).catch(err => {
        console.log(err)
      });
    }
  }

  changeView() {
    this.setState({showOnlyUnratedThoughts: !this.state.showOnlyUnratedThoughts});
    this.reRenderState = true;
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
      this.showTellUsWhy(this.state.currentThought);
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
    let hitId = e.currentTarget.children[0].attributes['data-hitid'].value;
    this.update_thought_with_rating(this.state.currentThought._id, hitId, nextValue);
  }

  getHitForQual(currentThought, that) {
    return new Promise(function(resolve, reject) {
      const the_headers = Object.assign({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }, that.props.getAuthorizationHeader());

      let nickname = that.props.profile.nickname;

      let url = new URL("/api/db/get-ratings", window.location.origin);
      const request = new Request(url.href, {
        'method': 'GET',
        'headers': the_headers
      });
      fetch(request).then((res) => res.json()).then((res) => {
        let starRatings = res.starRatings;
        let user_url = new URL("/api/db/get-user", window.location.origin);
        const params = {username: nickname};
        Object.keys(params).forEach(key => user_url.searchParams.append(key, params[key]));
        let users_request = new Request(user_url.href, {
          'method': 'GET',
          'headers': the_headers
        });
        fetch(users_request).then((resp) => resp.json()).then((resp) => {
          let scores = {};
          for(let i = 0; i < starRatings.length; i++) {
            for(let j = 0; j < currentThought._HITs.length; j++) {
              console.log("rating is: " + currentThought._HITs[j].rating + ", numStars is: " + starRatings[i].numStars);
              if(currentThought._HITs[j].rating === starRatings[i].numStars) {
                scores[currentThought._HITs[j].rating] = starRatings[i].count;
              }
            }
          }
          const keys = Object.keys(scores);
          let lowest_count = Number.POSITIVE_INFINITY;
          let rating_with_lowest_count = Number.POSITIVE_INFINITY;
          for (var p = 0; p < keys.length; p++) {
            if (scores[keys[p]] < lowest_count) {
              lowest_count = scores[keys[p]];
              rating_with_lowest_count = keys[p];
            }
          }
          var thought = "";
          var hitId = "";
          for(let m = 0; m < currentThought._HITs.length; m++) {
            if(currentThought._HITs[m].rating.toString() == rating_with_lowest_count) {
              thought = currentThought._HITs[m].positive_thought;
              hitId = currentThought._HITs[m].HITId;
            }
          }
          resolve({"thought": thought, "score": rating_with_lowest_count, "hitId": hitId});
        });
      }).catch(err => {
        reject("Something went wrong in fetching data");
        console.log(err)
      });
    });
  }

  showTellUsWhy (currentThought) {
    let allRated = currentThought._HITs.reduce((accumulator, hit) => {
      return accumulator && (hit.rating !== null)
    }, true);

    const the_headers = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, this.props.getAuthorizationHeader());

    if(allRated) {
      let url = new URL("/api/db/get-user", window.location.origin);
      const params = {username: this.props.profile.nickname};
      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
      const request = new Request(url.href, {
        'method': 'GET',
        'headers': the_headers
      });
      fetch(request).then((resp) => resp.json()).then((resp) => {
        let prevDate = new Date(resp.last_responded);
        let currentDate = new Date();
        let twoDaysAfterPrevDate = prevDate.setHours(prevDate.getDate() + 48);
        if(twoDaysAfterPrevDate < currentDate) {
          this.getHitForQual(currentThought, this).then((function(data) {
            this.setState({showTellUsWhy: true,
              thought_text: data.thought,
              score: data.score,
              hitId: data.hitId
            });
          }).bind(this));
        }
      });
    } else {
      this.setState({showTellUsWhy: false});
    }
  }

  backToSelection() {
    this.setState({showRating: false});
  }

  setReasonsForHit(textarea) {
    let text = textarea.value;
    var the_headers = Object.assign({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, this.props.getAuthorizationHeader());
    let request = new Request('/api/db/set-reason', {
      method: 'POST',
      body: JSON.stringify({
        thoughtId: this.state.currentThought._id,
        hitId: this.state.hitId,
        reason: text,
      }),
      headers: the_headers
    });

    fetch(request).then((res) => res.json()).then((res) => {
      console.log("Rating reason updated");
      this.setState({showRating: false});
    }).catch(err => {
      console.log(err)
    });
  }

  render() {
    if(this.state.showRating) {
      var reframes = this.state.currentThought._HITs.map((hit, i) => {
        return (
          <div className="column is-one-third">
            <div className="reframes">
              <div className="reframe" data-hitid={hit.HITId} key={i} dangerouslySetInnerHTML={{__html: hit.positive_thought}}/>
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
                  <div className="negative-thought" dangerouslySetInnerHTML={{ __html: this.state.currentThought._neg_thought }}>
                  </div>
                </div>
              </div>
              <div className="columns column-container">
                {reframes}
              </div>
              <div onClick={() => this.backToSelection() } className="back-button">back</div>
            </div>
            <div className={this.state.showTellUsWhy ? "box dark tell-us rated" : "tell-us"}>
              <p>Tell us why you rated: <em>{this.state.thought_text}</em></p>
              <p>With a rating of: <strong>{this.state.score}</strong></p>
              <div className="column is-one-third is-offset-one-third">
                <form onSubmit={() => this.setReasonsForHit(this.input)}>
                  <textarea className="reason" rows="12" ref={(input) => this.input = input}/>
                  <button className="button is-primary">Submit</button>
                </form>
              </div>
            </div>
          </div>
      )
    } else {
      if(!this.props.isAuthenticated()) {
        return (
            <div className="is-centered container">
              <div className="box dark carousel-container" style={{"textAlign": "center"}}>
                <h2 className="not-logged-in">Please login to rate your thoughts.</h2>
              </div>
            </div>
        )
      } else {
        if(this.state.thoughts.length === 0) {
          return (
              <div className="is-centered container">
                <div className="box dark carousel-container" style={{"textAlign": "center"}}>
                  <h2 className="not-logged-in">Transform some thoughts before coming here to rate the reformulations.</h2>
                </div>
              </div>
          )
        } else {
          var setsOfThree = this.getThoughtsInSetsOfThree(this.state.thoughts);
          var templates = [];
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
                          <h3 dangerouslySetInnerHTML={{ __html: thought._HITs[0].positive_thought }} />
                        </div>
                      </figure>
                      <figure className="front">
                        <img src={background11} alt="front"/>
                        <div className="caption">
                          <h1 dangerouslySetInnerHTML={{ __html: thought._neg_thought }} />
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
                  <span onClick={() => this.changeView() }
                    className="change-view">{this.state.showOnlyUnratedThoughts ? "Show all thoughts": "Show only thoughts with unrated reframes"}</span>
                </div>
              </div>
          );
        }
      }
    }
  }
}
export default Rate;
